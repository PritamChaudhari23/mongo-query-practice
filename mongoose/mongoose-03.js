const mongoose = require("mongoose");

// ============================================================
// 1. EMBEDDING VS REFERENCING
// ============================================================

// EMBEDDING:
// Store related data inside the same document.

const embeddedOrderSchema = new mongoose.Schema({
  orderNumber: String,

  customer: {
    name: String,
    email: String,
  },

  total: Number,
});

// REFERENCING:
// Store another document's ObjectId.

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  orderNumber: String,

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  total: Number,
});

const Customer = mongoose.model("Customer", customerSchema);
const Order = mongoose.model("Order", orderSchema);

// ============================================================
// 2. CREATE RELATED DOCUMENTS
// ============================================================

async function createCustomerAndOrder() {
  const customer = await Customer.create({
    name: "John Doe",
    email: "john@example.com",
  });

  const order = await Order.create({
    orderNumber: "ORD-1001",
    customer: customer._id,
    total: 1500,
  });

  return order;
}

// ============================================================
// 3. POPULATE - FETCH REFERENCED DOCUMENT
// ============================================================

// Populate customer details instead of returning only ObjectId.
async function getOrdersWithCustomer() {
  return Order.find().populate("customer");
}

// Populate selected fields only.
async function getOrdersWithSelectedCustomerFields() {
  return Order.find().populate("customer", "name email");
}

// Populate with conditions.
async function getOrdersWithActiveCustomers() {
  return Order.find().populate({
    path: "customer",
    match: { isActive: true },
    select: "name email",
  });
}

// Multiple populate operations.
async function getOrdersWithMultipleRelations() {
  return Order.find()
    .populate("customer", "name email")
    .populate("products", "name price");
}

// Populate a referenced document using findById.
async function getOrderById(id) {
  return Order.findById(id).populate("customer");
}

// ============================================================
// 4. ONE-TO-MANY RELATIONSHIP
// ============================================================

// One customer can have multiple orders.
// The customer stores an array of order references.

const customerWithOrdersSchema = new mongoose.Schema({
  name: String,

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

const CustomerWithOrders = mongoose.model(
  "CustomerWithOrders",
  customerWithOrdersSchema,
);

// Add an order reference to a customer.
async function addOrderToCustomer(customerId, orderId) {
  return CustomerWithOrders.findByIdAndUpdate(
    customerId,
    {
      $addToSet: { orders: orderId },
    },
    { returnDocument: "after" },
  );
}

// Populate all orders of a customer.
async function getCustomerOrders(customerId) {
  return CustomerWithOrders.findById(customerId).populate("orders");
}

// ============================================================
// 5. VIRTUAL POPULATE
// ============================================================

// Alternative one-to-many approach.
// Orders reference the customer; customer does not store order IDs.

const customerVirtualSchema = new mongoose.Schema({
  name: String,
  email: String,
});

customerVirtualSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "customer",
});

customerVirtualSchema.set("toJSON", {
  virtuals: true,
});

customerVirtualSchema.set("toObject", {
  virtuals: true,
});

const CustomerVirtual = mongoose.model(
  "CustomerVirtual",
  customerVirtualSchema,
);

async function getCustomerWithVirtualOrders(customerId) {
  return CustomerVirtual.findById(customerId).populate("orders");
}

// ============================================================
// 6. DOCUMENT MIDDLEWARE - PRE SAVE
// ============================================================

const documentSchema = new mongoose.Schema({
  title: String,
  slug: String,
});

// Runs before a document is saved.
documentSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, "-");
  }
});

const Document = mongoose.model("Document", documentSchema);

// ============================================================
// 7. DOCUMENT MIDDLEWARE - POST SAVE
// ============================================================

// Runs after a document is saved successfully.
documentSchema.post("save", function (doc) {
  console.log("Document saved:", doc._id);
});

// ============================================================
// 8. QUERY MIDDLEWARE
// ============================================================

const taskSchema = new mongoose.Schema({
  title: String,
  status: String,
  deletedAt: Date,
});

// Runs before find queries.
taskSchema.pre(/^find/, function () {
  this.where({ deletedAt: null });
});

const Task = mongoose.model("Task", taskSchema);

// Queries using Task.find() automatically add deletedAt: null.
// This is a basic soft-delete filtering pattern.

// ============================================================
// 9. QUERY MIDDLEWARE - PRE UPDATE
// ============================================================

taskSchema.pre("findOneAndUpdate", function () {
  console.log("Updating task:", this.getQuery());
});

// ============================================================
// 10. MODEL MIDDLEWARE
// ============================================================

// Model middleware example: intercept insertMany.
const auditSchema = new mongoose.Schema({
  action: String,
  createdAt: Date,
});

auditSchema.pre("insertMany", function (next, docs) {
  docs.forEach((doc) => {
    doc.createdAt = new Date();
  });

  next();
});

const Audit = mongoose.model("Audit", auditSchema);

// ============================================================
// 11. MIDDLEWARE - IMPORTANT DISTINCTIONS
// ============================================================

// Document middleware:
// this refers to the document.
// Example: save

// Query middleware:
// this refers to the query.
// Example: find, findOneAndUpdate

// Model middleware:
// this refers to the model.
// Example: insertMany

// Aggregate middleware:
// this refers to the aggregation object.
// Example: aggregate

const reportSchema = new mongoose.Schema({
  name: String,
});

reportSchema.pre("aggregate", function () {
  console.log("Aggregation pipeline:", this.pipeline());
});

const Report = mongoose.model("Report", reportSchema);
