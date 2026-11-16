const mongoose = require("mongoose");

// ============================================================
// 1. AGGREGATION
// ============================================================

const orderSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
  },

  items: [
    {
      product: String,
      quantity: Number,
      price: Number,
    },
  ],

  totalAmount: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

// Basic aggregation
async function getOrdersByStatus() {
  return Order.aggregate([
    {
      $match: {
        status: "completed",
      },
    },
  ]);
}

// Group orders by status and count them
async function countOrdersByStatus() {
  return Order.aggregate([
    {
      $group: {
        _id: "$status",
        totalOrders: { $sum: 1 },
      },
    },
  ]);
}

// Calculate total revenue
async function getTotalRevenue() {
  return Order.aggregate([
    {
      $match: {
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$totalAmount" },
      },
    },
  ]);
}

// Calculate average order value
async function getAverageOrderValue() {
  return Order.aggregate([
    {
      $match: {
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        averageOrderValue: { $avg: "$totalAmount" },
      },
    },
  ]);
}

// Unwind an array and group by product
async function getProductSales() {
  return Order.aggregate([
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.product",
        totalQuantity: {
          $sum: "$items.quantity",
        },
        totalRevenue: {
          $sum: {
            $multiply: ["$items.quantity", "$items.price"],
          },
        },
      },
    },
    {
      $sort: {
        totalRevenue: -1,
      },
    },
  ]);
}

// Aggregation with lookup
async function getOrdersWithCustomerDetails() {
  return Order.aggregate([
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "email",
        as: "customerDetails",
      },
    },
    {
      $unwind: {
        path: "$customerDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
}

// IMPORTANT:
// Mongoose aggregation results are plain JavaScript objects.
// Mongoose does not automatically cast aggregation pipeline values
// like it does for many normal model queries.

// ============================================================
// 2. INDEXES
// ============================================================

// Define an index on a single field
orderSchema.index({ status: 1 });

// Compound index
orderSchema.index({
  status: 1,
  createdAt: -1,
});

// Unique index
const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

accountSchema.index({ email: 1 }, { unique: true });

const Account = mongoose.model("Account", accountSchema);

// Text index
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

articleSchema.index({
  title: "text",
  content: "text",
});

const Article = mongoose.model("Article", articleSchema);

// Query using a text index
async function searchArticles(searchText) {
  return Article.find({
    $text: {
      $search: searchText,
    },
  });
}

// Explain query execution plan
async function explainOrderQuery() {
  return Order.find({
    status: "completed",
  }).explain("executionStats");
}

// Important:
// Indexes improve read performance for suitable queries,
// but add storage overhead and slow down writes.
// Compound index field order matters.

// ============================================================
// 3. TRANSACTIONS
// ============================================================

const accountBalanceSchema = new mongoose.Schema({
  name: String,
  balance: {
    type: Number,
    required: true,
  },
});

const AccountBalance = mongoose.model("AccountBalance", accountBalanceSchema);

// Transfer money between two accounts atomically
async function transferMoney(fromId, toId, amount) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const sender = await AccountBalance.findById(fromId).session(session);

    const receiver = await AccountBalance.findById(toId).session(session);

    if (!sender || !receiver) {
      throw new Error("Account not found");
    }

    if (sender.balance < amount) {
      throw new Error("Insufficient balance");
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();

    return {
      message: "Transfer successful",
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

// Transaction concepts:
//
// startSession()       -> Starts a session
// startTransaction()   -> Starts a transaction
// commitTransaction()  -> Saves all transaction operations
// abortTransaction()   -> Rolls back transaction operations
// endSession()         -> Ends the session
//
// Transactions require a replica set or sharded cluster.
// A standalone MongoDB server does not support multi-document transactions.

// ============================================================
// 4. ERROR HANDLING
// ============================================================

async function createOrder(orderData) {
  try {
    const order = await Order.create(orderData);

    return order;
  } catch (error) {
    if (error.name === "ValidationError") {
      console.log("Schema validation failed:", error.message);
    } else if (error.code === 11000) {
      console.log("Duplicate key error");
    } else if (error.name === "CastError") {
      console.log("Invalid field value:", error.message);
    } else {
      console.log("Unexpected error:", error.message);
    }

    throw error;
  }
}

// Common Mongoose errors:
//
// ValidationError -> Schema validation failure
// CastError       -> Invalid type conversion
// code 11000      -> Duplicate key error

// ============================================================
// 5. CONNECTION MANAGEMENT
// ============================================================

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/learning", {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

// Connection events
mongoose.connection.on("connected", () => {
  console.log("Database connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("Database disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// Close connection gracefully
async function closeDB() {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
}

// ============================================================
// 6. PERFORMANCE PRACTICES
// ============================================================

// Use lean() when document methods and change tracking aren't needed
async function getOrdersLean() {
  return Order.find({ status: "completed" }).lean();
}

// Select only required fields
async function getOrderSummary() {
  return Order.find().select("customer status totalAmount");
}

// Use limit to avoid fetching too many records
async function getRecentOrders() {
  return Order.find().sort({ createdAt: -1 }).limit(20);
}

// Use countDocuments for filtered counts
async function getCompletedOrderCount() {
  return Order.countDocuments({
    status: "completed",
  });
}

// Use estimatedDocumentCount for an approximate collection-wide count
async function getEstimatedOrderCount() {
  return Order.estimatedDocumentCount();
}

// ============================================================
// 7. SCHEMA AND MODEL UTILITIES
// ============================================================

// Validate a document without saving
async function validateOrder(orderData) {
  const order = new Order(orderData);

  await order.validate();

  return "Order is valid";
}

// Check whether a document exists
async function checkOrderExists(id) {
  return Order.exists({ _id: id });
}

// Delete a document by ID
async function removeOrder(id) {
  return Order.findByIdAndDelete(id);
}

// Convert a Mongoose document into a plain object
async function getOrderAsObject(id) {
  const order = await Order.findById(id);

  if (!order) {
    return null;
  }

  return order.toObject();
}
