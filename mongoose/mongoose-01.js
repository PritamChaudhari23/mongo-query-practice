const mongoose = require("mongoose");

// ============================================================
// 1. DATABASE CONNECTION
// ============================================================

mongoose.connect("mongodb://127.0.0.1:27017/learning");

// ============================================================
// 2. SCHEMA
// ============================================================

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ============================================================
// 3. MODEL
// ============================================================

const User = mongoose.model("User", userSchema);

// ============================================================
// 4. CREATE
// ============================================================

// Create using save()
async function createUser() {
  const user = new User({
    name: "John",
    email: "john@example.com",
    age: 25,
  });

  await user.save();
}

// Create using create()
async function createUserDirectly() {
  await User.create({
    name: "Jane",
    email: "jane@example.com",
    age: 28,
  });
}

// ============================================================
// 5. READ
// ============================================================

// Find all users
async function getAllUsers() {
  return await User.find();
}

// Find one user
async function getUser() {
  return await User.findOne({ email: "john@example.com" });
}

// Find by ID
async function getUserById(id) {
  return await User.findById(id);
}

// Find using comparison operator
async function getAdultUsers() {
  return await User.find({
    age: { $gte: 18 },
  });
}

// ============================================================
// 6. UPDATE
// ============================================================

// Update one document
async function updateUser() {
  return await User.updateOne(
    { email: "john@example.com" },
    { $set: { age: 30 } },
  );
}

// Find and update
async function findAndUpdateUser() {
  return await User.findOneAndUpdate(
    { email: "john@example.com" },
    { $set: { age: 30 } },
    { new: true, runValidators: true },
  );
}

// ============================================================
// 7. DELETE
// ============================================================

// Delete one
async function deleteUser() {
  return await User.deleteOne({
    email: "john@example.com",
  });
}

// Delete multiple
async function deleteInactiveUsers() {
  return await User.deleteMany({
    isActive: false,
  });
}

// Find and delete
async function findAndDeleteUser(id) {
  return await User.findByIdAndDelete(id);
}

// ============================================================
// 8. QUERY CHAINING
// ============================================================

async function getUsersWithPagination() {
  return await User.find({ age: { $gte: 18 } })
    .select("name email age")
    .sort({ age: -1 })
    .skip(0)
    .limit(10)
    .lean();
}
