const mongoose = require("mongoose");

// ============================================================
// 1. SCHEMA DESIGN - BASIC FIELD TYPES
// ============================================================

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },

  age: {
    type: Number,
    min: 18,
    max: 100,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  role: {
    type: String,
    enum: ["user", "admin", "manager"],
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

// ============================================================
// 2. SCHEMA DESIGN - NESTED OBJECTS
// ============================================================

// Nested object inside a schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  address: {
    city: String,
    state: String,
    country: String,
  },

  contact: {
    email: String,
    phone: String,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

// ============================================================
// 3. SCHEMA DESIGN - SUBDOCUMENTS
// ============================================================

// Separate schema for embedded documents
const addressSchema = new mongoose.Schema({
  city: String,
  state: String,
  country: String,
});

const orderItemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    min: 1,
    required: true,
  },

  price: {
    type: Number,
    min: 0,
    required: true,
  },
});

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  addresses: [addressSchema],

  orders: [orderItemSchema],
});

const Customer = mongoose.model("Customer", customerSchema);

// ============================================================
// 4. SCHEMA DESIGN - ARRAYS AND ENUMS
// ============================================================

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: Number,

  tags: {
    type: [String],
    default: [],
  },

  category: {
    type: String,
    enum: ["Electronics", "Clothing", "Books"],
  },

  availableSizes: [String],
});

const Product = mongoose.model("Product", productSchema);

// ============================================================
// 5. QUERY OPERATORS - COMPARISON
// ============================================================

// $eq - Equal to
async function findUsersByAge() {
  return User.find({ age: { $eq: 25 } });
}

// $ne - Not equal to
async function findUsersNotAdmin() {
  return User.find({ role: { $ne: "admin" } });
}

// $gt - Greater than
async function findUsersAbove25() {
  return User.find({ age: { $gt: 25 } });
}

// $gte - Greater than or equal to
async function findUsersAtLeast25() {
  return User.find({ age: { $gte: 25 } });
}

// $lt - Less than
async function findUsersBelow30() {
  return User.find({ age: { $lt: 30 } });
}

// $lte - Less than or equal to
async function findUsersAtMost30() {
  return User.find({ age: { $lte: 30 } });
}

// $in - Match any value from an array
async function findUsersByRoles() {
  return User.find({
    role: { $in: ["admin", "manager"] },
  });
}

// $nin - Exclude values from an array
async function findUsersExcludingRoles() {
  return User.find({
    role: { $nin: ["admin", "manager"] },
  });
}

// ============================================================
// 6. QUERY OPERATORS - LOGICAL
// ============================================================

// $and - All conditions must match
async function findUsersAnd() {
  return User.find({
    $and: [{ age: { $gte: 25 } }, { isActive: true }],
  });
}

// $or - At least one condition must match
async function findUsersOr() {
  return User.find({
    $or: [{ role: "admin" }, { age: { $lt: 21 } }],
  });
}

// $nor - None of the conditions should match
async function findUsersNor() {
  return User.find({
    $nor: [{ role: "admin" }, { isActive: false }],
  });
}

// $not - Negates a condition
async function findUsersNot() {
  return User.find({
    age: { $not: { $gt: 30 } },
  });
}

// ============================================================
// 7. QUERY OPERATORS - FIELD EXISTENCE AND REGEX
// ============================================================

// $exists - Check whether a field exists
async function findUsersWithPhone() {
  return User.find({
    phone: { $exists: true },
  });
}

// $regex - Pattern matching
async function searchUsersByName() {
  return User.find({
    name: { $regex: "^john", $options: "i" },
  });
}

// ============================================================
// 8. QUERY OPERATORS - ARRAYS
// ============================================================

// Match documents containing a particular array value
async function findProductsByTag() {
  return Product.find({
    tags: "electronics",
  });
}

// $all - Array must contain all specified values
async function findProductsByAllTags() {
  return Product.find({
    tags: { $all: ["electronics", "mobile"] },
  });
}

// $size - Match arrays with a specific number of elements
async function findProductsWithTwoTags() {
  return Product.find({
    tags: { $size: 2 },
  });
}

// $elemMatch - Multiple conditions must match the same array element
async function findCustomersWithMatchingOrder() {
  return Customer.find({
    orders: {
      $elemMatch: {
        productName: "Laptop",
        quantity: { $gte: 2 },
        price: { $gt: 500 },
      },
    },
  });
}

// ============================================================
// 9. QUERY NESTED FIELDS
// ============================================================

// Dot notation for nested fields
async function findEmployeesByCity() {
  return Employee.find({
    "address.city": "Mumbai",
  });
}

// Multiple nested conditions
async function findEmployeesByLocation() {
  return Employee.find({
    "address.city": "Mumbai",
    "address.state": "Maharashtra",
  });
}

// ============================================================
// 10. FIELD SELECTION / PROJECTION
// ============================================================

// Include specific fields
async function getUserDetails() {
  return User.find().select("name email age");
}

// Exclude specific fields
async function getUsersWithoutEmail() {
  return User.find().select("-email");
}

// Exclude MongoDB _id
async function getUsersWithoutId() {
  return User.find().select("name email -_id");
}

// ============================================================
// 11. SORTING
// ============================================================

// Ascending order
async function getUsersAscending() {
  return User.find().sort({ age: 1 });
}

// Descending order
async function getUsersDescending() {
  return User.find().sort({ age: -1 });
}

// Sort using multiple fields
async function getUsersSorted() {
  return User.find().sort({
    age: -1,
    name: 1,
  });
}

// ============================================================
// 12. PAGINATION
// ============================================================

// Skip and limit
async function getUsersWithPagination(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  return User.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
}

// Get paginated data along with total count
async function getPaginatedUsers(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),

    User.countDocuments(),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// 13. QUERY EXECUTION AND LEAN
// ============================================================

// Execute a query using exec()
async function getUsersUsingExec() {
  return User.find({ isActive: true }).exec();
}

// Return plain JavaScript objects instead of Mongoose documents
async function getUsersUsingLean() {
  return User.find({ isActive: true }).lean();
}

// ============================================================
// 14. SCHEMA VALIDATION - CUSTOM VALIDATORS
// ============================================================

const registrationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },

  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  confirmPassword: {
    type: String,
    required: true,

    validate: {
      validator: function (value) {
        return value === this.password;
      },

      message: "Passwords do not match",
    },
  },
});

const Registration = mongoose.model("Registration", registrationSchema);

// ============================================================
// 15. VALIDATION DURING UPDATES
// ============================================================

// Update validators are disabled by default for update operations.
// Use runValidators: true to enable them.
async function updateUserWithValidation(id) {
  return User.findByIdAndUpdate(
    id,
    {
      $set: {
        age: 15,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
}

// ============================================================
// 16. VALIDATE A DOCUMENT MANUALLY
// ============================================================

async function validateUser() {
  const user = new User({
    name: "Jo",
    email: "invalid-email",
    age: 15,
  });

  const error = user.validateSync();

  if (error) {
    console.log(error.errors);
  }
}
