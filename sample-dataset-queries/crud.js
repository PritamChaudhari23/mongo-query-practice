/*
MONGODB SAMPLE QUERIES — CRUD
Condensed from the 9 original sample_* files.

Purpose:
- Keep one useful example for each distinct CRUD/query pattern.
- Remove repetitions that only change collection names or literal values.
- Examples use the original sample collection/field names where practical.

Sections:
CREATE | READ | UPDATE | DELETE | SORT

Note: These are mongosh-style examples. Use a test database for updates/deletes.
*/

// =============================================================================
// CREATE
// =============================================================================

// 1. Insert a document containing nested objects and arrays.
// Source pattern: sample_analytics.js (customer), sample_airbnb.js (listing).
db.customers.insertOne({
  username: "jdoe",
  name: "John Doe",
  email: "johndoe@example.com",
  active: true,
  birthdate: new Date("1985-12-15T00:00:00.000Z"),
  accounts: [371138, 324287],
  tier_and_details: {
    abc123: {
      tier: "Silver",
      id: "abc123",
      active: true,
      benefits: ["priority support"],
    },
  },
});

// =============================================================================
// READ — FIND FILTERS
// =============================================================================

// 2. Equality + multiple conditions (implicit AND).
// Source pattern: sample_analytics.js.
db.customers.find({
  active: true,
  accounts: 371138,
});

// 3. Comparison operators on a field.
// Source pattern: sample_airbnb.js, sample_guides.js, sample_geospatial.js.
db.listingsAndReviews.find({
  property_type: "House",
  price: { $lt: 100 },
});

// 4. Query a nested field using dot notation.
// Source pattern: sample_weatherdata.js, sample_guides.js.
db.data.find({
  "visibility.distance.value": { $gt: 10000 },
  "wind.speed.rate": { $lt: 5 },
});

// 5. Match a value inside an array.
// Source pattern: sample_analytics.js.
db.accounts.find({
  products: "Derivatives",
});

// 6. Match any of several values with $in; exclude a value with $ne.
// Source pattern: sample_mflix.js.
db.movies.find({
  rated: { $in: ["G", "PG", "PG-13", "R"] },
  genres: { $ne: "Short" },
});

// 7. Match a pattern with $regex.
// Source pattern: sample_training.js.
db.companies.find({
  tag_list: { $regex: /media-platform/ },
});

// 8. Compare a calculated property of the same document with $expr.
// Here, $size counts the reviews array.
// Source pattern: sample_airbnb.js.
db.listingsAndReviews.find({
  "host.host_name": "Ana&Gonçalo",
  $expr: { $gt: [{ $size: "$reviews" }, 50] },
});

// 9. Use $elemMatch when multiple conditions must match the SAME array element.
// Source pattern: sample_training.js.
db.grades.find({
  scores: {
    $elemMatch: {
      type: "exam",
      score: { $gt: 90 },
    },
  },
});

// 10. Filter by a date range.
// Source pattern: sample_training.js, sample_weatherdata.js.
// Use an inclusive start and exclusive end for a calendar-year range.
db.posts.find({
  tags: "food",
  date: {
    $gte: new Date("2012-01-01T00:00:00.000Z"),
    $lt: new Date("2013-01-01T00:00:00.000Z"),
  },
});

// 11. Filter an array of embedded documents by one nested value.
// Source pattern: sample_supplies.js.
db.sales.find({
  "items.tags": "office",
  storeLocation: "Denver",
});

// 12. Filter using an array's indexed coordinate values.
// GeoJSON coordinate order is longitude, latitude.
// Source pattern: sample_restaurants.js, sample_geospatial.js.
db.restaurants.find({
  borough: "Brooklyn",
  "address.coord.0": { $gte: -73.95, $lte: -73.90 },
});

// =============================================================================
// UPDATE
// =============================================================================

// 13. Update one document's simple and nested fields with $set.
// Source pattern: sample_weatherdata.js, sample_supplies.js.
db.data.updateOne(
  { _id: ObjectId("5553a998e4b02cf7151190b8") },
  {
    $set: {
      "airTemperature.value": 20.5,
      "pressure.value": 1020.0,
      callLetters: "NEWXYZ",
    },
  },
);

// 14. Update many matching documents.
// Source pattern: sample_weatherdata.js.
db.data.updateMany(
  { "wind.speed.rate": { $gt: 10 } },
  { $set: { "visibility.variability.value": "V" } },
);

// 15. Add an array element.
// $push always appends; $addToSet adds only if the value is not already present.
// Source pattern: sample_airbnb.js, sample_analytics.js, sample_guides.js.
db.listingsAndReviews.updateOne(
  { _id: "10006546" },
  { $push: { amenities: "Free WiFi" } },
);

db.accounts.updateOne(
  { accountid: 371138 },
  { $addToSet: { products: "RealEstate" } },
);

// 16. Increment a numeric value inside an embedded array element.
// The positional $ operator updates the first array element matched by the query.
// Source pattern: sample_supplies.js, sample_analytics.js.
db.sales.updateOne(
  { _id: ObjectId("5bd761dcae323e45a93ccfe8"), "items.name": "pens" },
  { $inc: { "items.$.quantity": 3 } },
);

// 17. Update a matched element in an array of embedded documents.
// Source pattern: sample_analytics.js.
db.transactions.updateOne(
  {
    account_id: 316726,
    transactions: { $elemMatch: { symbol: "znga" } },
  },
  {
    $set: {
      "transactions.$.transaction_code": "buy",
      "transactions.$.amount": 5000,
    },
  },
);

// 18. Remove matching elements from an array with $pull.
// Source pattern: sample_airbnb.js, sample_supplies.js.
db.listingsAndReviews.updateOne(
  { _id: "1001265" },
  {
    $pull: {
      reviews: { date: { $lt: new Date("2015-01-01T00:00:00.000Z") } },
    },
  },
);

// =============================================================================
// DELETE
// =============================================================================

// 19. Delete one matching document.
db.shipwrecks.deleteOne({ recrd: "Record 101" });

// 20. Delete all documents matching a filter.
db.data.deleteMany({ elevation: { $gt: 8000 } });

// 21. Delete documents based on a calculated aggregate value.
// A normal delete filter cannot directly use a per-document sum across an array.
// First calculate matching IDs, then delete those documents.
// Source pattern: sample_supplies.js.
const salesToDelete = db.sales.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$_id",
      totalPrice: {
        $sum: { $multiply: ["$items.price", "$items.quantity"] },
      },
    },
  },
  { $match: { totalPrice: { $lt: 100 } } },
]).toArray();

// Inspect salesToDelete before running the deletion.
salesToDelete.forEach((sale) => {
  db.sales.deleteOne({ _id: sale._id });
});

// =============================================================================
// SORTING
// =============================================================================

// 21. Sort ascending (1) or descending (-1).
// Source pattern: sample_guides.js.
db.planets.find({
  "surfaceTemperatureC.mean": { $gt: 100 },
}).sort({
  orderFromSun: -1,
});

// =============================================================================
// OPERATOR REMINDERS
// =============================================================================

/*
Comparison: $eq, $ne, $gt, $gte, $lt, $lte, $in
Logical:    $and, $or, $not
Arrays:     $elemMatch, $push, $addToSet, $pull
Updates:    $set, $inc
Expression: $expr, $size
Other:      $regex, sort()
*/
