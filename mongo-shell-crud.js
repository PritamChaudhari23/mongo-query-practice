// ============================================================
// CREATE
// ============================================================

// Q1. Insert a new customer with nested tier details and an accounts array
// in the `customers` collection of the `sample_analytics` database.
db.customers.insertOne({
  username: "jdoe",
  name: "John Doe",
  address: "1234 Elm St, Springfield, IL 62701",
  birthdate: new Date("1985-12-15T00:00:00.000Z"),
  email: "johndoe@example.com",
  active: true,
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

// Q2. Insert a sale containing an array of items and a nested customer object
// in the `sales` collection of the `sample_supplies` database.
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

// Q3. Insert a shipwreck document containing location coordinates
// in the `shipwrecks` collection of the `sample_geospatial` database.
db.shipwrecks.insertOne({
  recrd: "Record 101",
  vesslterms: "Vessel ABC",
  feature_type: "Wrecks - Visible",
  chart: "US,U1,graph,DNC H1409999",
  latdec: 12.3456789,
  londec: -98.7654321,
  gp_quality: "High",
  depth: 150,
  sounding_type: "Echo",
  history: "Sank in 1823",
  quasou: "Some information",
  watlev: "always submerged",
  coordinates: [-98.7654321, 12.3456789],
});

// ============================================================
// READ
// ============================================================

// Q4. Find House listings with a price below 100
// in the `listingsAndReviews` collection of the `sample_airbnb` database.
db.listingsAndReviews.find({
  property_type: "House",
  price: { $lt: 100 },
});

// Q5. Find listings hosted by Ana&Gonçalo that have more than 50 reviews
// in the `listingsAndReviews` collection of the `sample_airbnb` database.
db.listingsAndReviews.find({
  "host.host_name": "Ana&Gonçalo",
  $expr: { $gt: [{ $size: "$reviews" }, 50] },
});

// Q6. Find active customers who have account ID 371138
// in the `customers` collection of the `sample_analytics` database.
db.customers.find({
  active: true,
  accounts: 371138,
});

// Q7. Find transactions containing IBM sell transactions
// in the `transactions` collection of the `sample_analytics` database.
db.transactions.find({
  "transactions.symbol": "ibm",
  "transactions.transaction_code": "sell",
});

// Q8. Find shipwrecks with longitude less than -80
// in the `shipwrecks` collection of the `sample_geospatial` database.
db.shipwrecks.find({
  "coordinates.0": { $lt: -80 },
});

// Q9. Find planets whose mean surface temperature is above 100°C
// in the `planets` collection of the `sample_guides` database.
db.planets.find({
  "surfaceTemperatureC.mean": { $gt: 100 },
});

// Q10. Find sales containing an item tagged as office and sold in Denver
// in the `sales` collection of the `sample_supplies` database.
db.sales.find({
  "items.tags": "office",
  storeLocation: "Denver",
});

// Q11. Find students who scored above 90 in at least one exam
// in the `grades` collection of the `sample_training` database.
db.grades.find({
  scores: {
    $elemMatch: {
      type: "exam",
      score: { $gt: 90 },
    },
  },
});

// ============================================================
// UPDATE
// ============================================================

// Q12. Set maximum_nights and cleaning_fee for a specific listing
// in the `listingsAndReviews` collection of the `sample_airbnb` database.
db.listingsAndReviews.updateOne(
  { name: "Ribeira Charming Duplex" },
  {
    $set: {
      maximum_nights: 60,
      cleaning_fee: 40,
    },
  },
);

// Q13. Add a new amenity to a listing's amenities array using $push
// in the `listingsAndReviews` collection of the `sample_airbnb` database.
db.listingsAndReviews.updateOne(
  { _id: "10006546" },
  {
    $push: {
      amenities: "Free WiFi",
    },
  },
);

// Q14. Set a nested host field only if the listing has fewer than 100 reviews
// in the `listingsAndReviews` collection of the `sample_airbnb` database.
db.listingsAndReviews.updateOne(
  {
    _id: "10006546",
    $expr: { $lt: [{ $size: "$reviews" }, 100] },
  },
  {
    $set: {
      "host.host_is_superhost": true,
    },
  },
);

// Q15. Add RealEstate to an account's products array without creating duplicates
// in the `accounts` collection of the `sample_analytics` database.
db.accounts.updateOne(
  { accountid: 371138 },
  {
    $addToSet: {
      products: "RealEstate",
    },
  },
);

// Q16. Add a new account ID to a customer's accounts array
// in the `customers` collection of the `sample_analytics` database.
db.customers.updateOne(
  { username: "fmiller" },
  {
    $push: {
      accounts: 111111,
    },
  },
);

// Q17. Update the transaction matching a specific symbol using the positional $ operator
// in the `transactions` collection of the `sample_analytics` database.
db.transactions.updateOne(
  {
    account_id: 316726,
    transactions: {
      $elemMatch: { symbol: "znga" },
    },
  },
  {
    $set: {
      "transactions.$.transaction_code": "buy",
      "transactions.$.amount": 5000,
    },
  },
);

// Q18. Increase the quantity of the pens item by 3 using $inc and the positional $ operator
// in the `sales` collection of the `sample_supplies` database.
db.sales.updateOne(
  {
    _id: ObjectId("5bd761dcae323e45a93ccfe8"),
    "items.name": "pens",
  },
  {
    $inc: {
      "items.$.quantity": 3,
    },
  },
);

// Q19. Remove items tagged as stationary from a sale using $pull
// in the `sales` collection of the `sample_supplies` database.
db.sales.updateOne(
  { _id: ObjectId("5bd761dcae323e45a93ccfe8") },
  {
    $pull: {
      items: { tags: "stationary" },
    },
  },
);

// Q20. Update visibility variability for all records where wind speed exceeds 10
// in the `data` collection of the `sample_weatherdata` database.
db.data.updateMany(
  { "wind.speed.rate": { $gt: 10 } },
  {
    $set: {
      "visibility.variability.value": "V",
    },
  },
);

// ============================================================
// DELETE
// ============================================================

// Q21. Delete a listing using its ID
// from the `listingsAndReviews` collection of the `sample_airbnb` database.
db.listingsAndReviews.deleteOne({
  _id: "10006546",
});

// Q22. Remove reviews dated before 2015 from a listing using $pull
// in the `listingsAndReviews` collection of the `sample_airbnb` database.
db.listingsAndReviews.updateOne(
  { _id: "1001265" },
  {
    $pull: {
      reviews: {
        date: { $lt: new Date("2015-01-01T00:00:00Z") },
      },
    },
  },
);

// Q23. Delete all transactions with a bucket end date before 2000-01-01
// from the `transactions` collection of the `sample_analytics` database.
db.transactions.deleteMany({
  bucket_end_date: {
    $lt: new Date("2000-01-01T00:00:00.000Z"),
  },
});

// Q24. Delete all shipwrecks with a depth below 50 meters
// from the `shipwrecks` collection of the `sample_geospatial` database.
db.shipwrecks.deleteMany({
  depth: { $lt: 50 },
});

// ============================================================
// CROSS-COLLECTION QUERY
// ============================================================

// Q25. Find customers associated with accounts whose product is Derivatives
// by querying the `accounts` and `customers` collections
// of the `sample_analytics` database.
const accountIds = db.accounts
  .find({ products: "Derivatives" })
  .map((account) => account.accountid);

db.customers.find({
  accounts: { $in: accountIds },
});

// ============================================================
// SORT
// ============================================================

// Q26. Find planets with mean surface temperature above 100°C
// and sort them by orderFromSun in descending order
// in the `planets` collection of the `sample_guides` database.
db.planets
  .find({
    "surfaceTemperatureC.mean": { $gt: 100 },
  })
  .sort({ orderFromSun: -1 });

// Q27. Update Venus's orderFromSun and retrieve all planets in ascending order
// in the `planets` collection of the `sample_guides` database.
db.planets.updateOne(
  { name: "Venus" },
  {
    $set: {
      orderFromSun: 3,
    },
  },
);

db.planets.find().sort({ orderFromSun: 1 });
