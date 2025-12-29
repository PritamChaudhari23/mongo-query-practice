// CREATE:
// 1.Insert a new sale record for a store location "New York" with the following items:
//    - Item: "stapler", tags: ["office", "stationary"], price: 15.75, quantity: 3
//    - Item: "file folder", tags: ["office", "stationary"], price: 9.99, quantity: 5
//    - Customer details: Gender: Female, Age: 30, Email: "jdoe@example.com", Satisfaction: 5
//    - Coupon used: false
//    - Purchase method: "In-store"
//    - Sale date: 2024-12-25T14:20:00
db.sales.insertOne({
  saleDate: "2024-12-25T14:20:00",
  items: [
    {
      name: "stapler",
      tags: ["office", "stationary"],
      price: 15.75,
      quantity: 3,
    },
    {
      name: "file folder",
      tags: ["office", "stationary"],
      price: 9.99,
      quantity: 5,
    },
  ],
  storeLocation: "New York",
  customer: {
    gender: "F",
    age: 30,
    email: "jdoe@example.com",
    satisfaction: 5,
  },
  couponUsed: false,
  purchaseMethod: "In-store",
});

// -----------------------------------------------------------------------------------------------------------------------------

// READ:
// 2.Find all sales records for items that have the tag "office" and were sold in the "Denver" store location.
db.sales.find({
  "items.tags": "office",
  storeLocation: "Denver",
});

// 3.Retrieve the names and prices of items sold in the sale record with the `_id` of "5bd761dcae323e45a93ccfe8".
db.sales.find(
  {
    _id: ObjectId("5bd761dcae323e45a93ccfe8"),
  },
  {
    "items.name": 1,
    "items.price": 1,
  }
);

// 4.Find the total quantity sold for the item "notepad" across all sales records in the dataset.
db.sales.aggregate([
  // Unwind the items array to work with each item individually
  { $unwind: "$items" },
  // Match only those items which have the name "notepad"
  { $match: { "items.name": "notepad" } },
  // Group by item name and sum the quantities
  {
    $group: {
      _id: "$items.name",
      totalQuantity: { $sum: "$items.quantity" },
    },
  },
]);

// -----------------------------------------------------------------------------------------------------------------------------

// UPDATE:
// 5.Update the sale record with `_id: "5bd761dcae323e45a93ccfe8"` to change the store location to "Los Angeles".
db.sales.updateOne(
  { _id: ObjectId("5bd761dcae323e45a93ccfe8") },
  { $set: { storeLocation: "Los Angeles" } }
);

// 6.Update the sale record with `_id: "5bd761dcae323e45a93ccfe8"` to increase the quantity of the item "pens" by 3.
db.sales.updateOne(
  { _id: ObjectId("5bd761dcae323e45a93ccfe8"), "items.name": "pens" },
  { $inc: { "items.$.quantity": 3 } }
);

// 7.Update the customer email for the sale record with `_id: "5bd761dcae323e45a93ccfe8"` to "newemail@example.com".
db.sales.updateOne(
  { _id: ObjectId("5bd761dcae323e45a93ccfe8") },
  { $set: { "customer.email": "newemail@example.com" } }
);

// -----------------------------------------------------------------------------------------------------------------------------

// DELETE:
// 8.Delete the sale record where the customer's email is "cauho@witwuta.sv".
db.sales.deleteOne({ "customer.email": "cauho@witwuta.sv" });

// 9.Remove all items from the sale record with `_id: "5bd761dcae323e45a93ccfe8"` that have the tag "stationary".
db.sales.updateOne(
  { _id: ObjectId("5bd761dcae323e45a93ccfe8") },
  { $pull: { items: { tags: "stationary" } } }
);

// 10.Delete all sales records where the total price of items is less than 100 (calculate total price by summing the price * quantity of each item).
const salesToDelete = db.sales
  .aggregate([
    // Unwind the items array
    { $unwind: "$items" },
    // Calculate the total price for each item (price * quantity)
    {
      $group: {
        _id: "$_id",
        totalPrice: {
          $sum: { $multiply: ["$items.price", "$items.quantity"] },
        },
      },
    },
    // Match sales records with total price less than 100
    { $match: { totalPrice: { $lt: 100 } } },
  ])
  .toArray();

salesToDelete.forEach((sale) => {
  db.sales.deleteOne({ _id: sale._id });
});

// -----------------------------------------------------------------------------------------------------------------------------
