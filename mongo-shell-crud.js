// ============================================================
// CREATE
// ============================================================

// Q1. Insert a new customer with nested objects and arrays into
// the customers collection of the sample_analytics database.
db.customers.insertOne({
  username: "jdoe",
  name: "John Doe",
  address: "1234 Elm St, Springfield, IL 62701",
  birthdate: new Date("1985-12-15T00:00:00Z"),
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

// Q2. Insert a transaction containing an embedded array of transaction
// documents into the transactions collection of the sample_analytics database.
db.transactions.insertOne({
  account_id: 371138,
  transaction_count: 1,
  bucket_start_date: new Date("2023-01-01T00:00:00Z"),
  bucket_end_date: new Date("2023-01-02T00:00:00Z"),
  transactions: [
    {
      date: new Date("2023-01-01T12:00:00Z"),
      amount: 1000,
      transaction_code: "buy",
      symbol: "aapl",
      price: "150.00",
      total: "150000",
    },
  ],
});

// Q3. Insert a shipwreck document containing coordinate arrays
// into the shipwrecks collection of the sample_geospatial database.
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

// Q4. Insert a planet document containing nested temperature details
// and an atmosphere array into the planets collection of the sample_guides database.
db.planets.insertOne({
  name: "Pluto",
  orderFromSun: 9,
  hasRings: false,
  mainAtmosphere: ["Methane", "Hydrogen"],
  surfaceTemperatureC: {
    min: -465,
    max: -470,
    mean: -467,
  },
});

// Q5. Insert a sale containing an items array and nested customer details
// into the sales collection of the sample_supplies database.
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

// Q6. Insert a weather record containing deeply nested objects and
// GeoJSON coordinates into the data collection of the sample_weatherdata database.
db.data.insertOne({
  st: "x+12345-001234",
  ts: new Date("2024-01-01T08:00:00Z"),
  position: {
    type: "Point",
    coordinates: [-34.5, 45.3],
  },
  elevation: 500,
  callLetters: "XY123",
  qualityControlProcess: "V021",
  dataSource: "3",
  type: "FM-11",
  airTemperature: { value: 15.4, quality: "1" },
  dewPoint: { value: 8.2, quality: "1" },
  pressure: { value: 1013.5, quality: "1" },
  wind: {
    direction: { angle: 90, quality: "1" },
    type: "8",
    speed: { rate: 12.5, quality: "1" },
  },
  visibility: {
    distance: { value: 5000, quality: "1" },
    variability: { value: "V", quality: "1" },
  },
  skyCondition: {
    ceilingHeight: {
      value: 5000,
      quality: "1",
      determination: "1",
    },
    cavok: "Y",
  },
  sections: ["AG2"],
  precipitationEstimatedObservation: {
    discrepancy: "1",
    estimatedWaterDepth: 20,
  },
});

// Q7. Insert a new Airbnb listing containing nested host, address,
// availability and review-score details into the listingsAndReviews
// collection of the sample_airbnb database.
db.listingsAndReviews.insertOne({
  name: "Charming Beachfront Studio",
  location: "Lisbon, Portugal",
  price: { $numberDecimal: "100.00" },
  accommodates: 2,
  bedrooms: 1,
  review_scores: {
    review_scores_cleanliness: 10,
    review_scores_communication: 9,
    review_scores_location: 9,
  },
  listing_url: "https://www.airbnb.com/rooms/newlisting",
  summary: "Beautiful beachfront studio with modern amenities in Lisbon.",
  property_type: "Apartment",
  room_type: "Entire home/apt",
  minimum_nights: 2,
  maximum_nights: 30,
  amenities: ["TV", "Air conditioning", "WiFi"],
  security_deposit: { $numberDecimal: "150.00" },
  cleaning_fee: { $numberDecimal: "25.00" },
  extra_people: { $numberDecimal: "20.00" },
  host: {
    host_id: "newhost123",
    host_name: "John Doe",
  },
  address: {
    street: "Lisbon, Portugal",
    country: "Portugal",
    location: {
      type: "Point",
      coordinates: [-9.1395, 38.7223],
    },
  },
  availability: {
    availability_30: 28,
    availability_365: 200,
  },
});

// ============================================================
// READ — FILTERING
// ============================================================

// Q8. Find active customers with account ID 371138 in the customers
// collection of the sample_analytics database.
db.customers.find({
  active: true,
  accounts: 371138,
});

// Q9. Find transactions with symbol "ibm" and transaction code "sell"
// in the transactions collection of the sample_analytics database.
db.transactions.find({
  "transactions.symbol": "ibm",
  "transactions.transaction_code": "sell",
});

// Q10. Find accounts containing the product "Derivatives"
// in the accounts collection of the sample_analytics database.
db.accounts.find({
  products: "Derivatives",
});

// Q11. Find customers whose tier is Bronze in the customers
// collection of the sample_analytics database.
db.customers.find({
  "tier_and_details.Bronze.tier": "Bronze",
});

// Q12. Find listings with property type House and price below 100
// in the listingsAndReviews collection of the sample_airbnb database.
db.listingsAndReviews.find({
  property_type: "House",
  price: { $lt: 100 },
});

// Q13. Find listings hosted by Ana&Gonçalo that have more than
// 50 reviews in the listingsAndReviews collection of the sample_airbnb database.
db.listingsAndReviews.find({
  "host.host_name": "Ana&Gonçalo",
  $expr: { $gt: [{ $size: "$reviews" }, 50] },
});

// Q14. Find listings whose review score is above 85
// in the listingsAndReviews collection of the sample_airbnb database.
db.listingsAndReviews.find({
  "review_scores.review_scores_rating": { $gt: 85 },
});

// Q15. Find visible shipwrecks deeper than 100 metres and always submerged
// in the shipwrecks collection of the sample_geospatial database.
db.shipwrecks.find({
  feature_type: "Wrecks - Visible",
  depth: { $gt: 100 },
  watlev: "always submerged",
});

// Q16. Find shipwrecks with longitude below -80
// in the shipwrecks collection of the sample_geospatial database.
db.shipwrecks.find({
  "coordinates.0": { $lt: -80 },
});

// Q17. Find planets that do not have rings
// in the planets collection of the sample_guides database.
db.planets.find({
  hasRings: false,
});

// Q18. Find planets with mean surface temperature above 100
// in the planets collection of the sample_guides database.
db.planets.find({
  "surfaceTemperatureC.mean": { $gt: 100 },
});

// Q19. Find trips taken by users born before 1970
// in the trips collection of the sample_training database.
db.trips.find({
  "birth year": { $lt: 1970 },
});

// Q20. Find routes operated by Aerocondor
// in the routes collection of the sample_training database.
db.routes.find({
  "airline.name": "Aerocondor",
});

// Q21. Find companies whose tag_list contains "media-platform"
// in the companies collection of the sample_training database.
db.companies.find({
  tag_list: { $regex: /media-platform/ },
});

// Q22. Find students having an exam score above 90
// in the grades collection of the sample_training database.
// Both conditions must match the same embedded array element.
db.grades.find({
  scores: {
    $elemMatch: {
      type: "exam",
      score: { $gt: 90 },
    },
  },
});

// Q23. Find companies with acquisition prices above 25 million
// in the companies collection of the sample_training database.
db.companies.find({
  "acquisition.price_amount": { $gt: 25000000 },
});

// Q24. Find cities with population above 40,000
// in the zips collection of the sample_training database.
db.zips.find({
  pop: { $gt: 40000 },
});

// Q25. Find weather records with timestamp after January 1, 2023
// in the data collection of the sample_weatherdata database.
db.data.find({
  ts: { $gt: new Date("2023-01-01T00:00:00Z") },
});

// Q26. Find weather records with visibility above 10,000 and wind
// speed below 5 in the data collection of the sample_weatherdata database.
db.data.find({
  "visibility.distance.value": { $gt: 10000 },
  "wind.speed.rate": { $lt: 5 },
});

// Q27. Find sales containing items tagged "office" in Denver
// in the sales collection of the sample_supplies database.
db.sales.find({
  "items.tags": "office",
  storeLocation: "Denver",
});

// Q28. Find movies directed by John Ford with an allowed rating
// in the movies collection of the sample_mflix database.
db.movies.find({
  directors: "John Ford",
  rated: { $in: ["PASSED", "G", "PG", "PG-13", "R", "NC-17"] },
});

// Q29. Find movies with runtime above 90 minutes, excluding the Short genre
// in the movies collection of the sample_mflix database.
db.movies.find({
  runtime: { $gt: 90 },
  genres: { $ne: "Short" },
});

// ============================================================
// UPDATE
// ============================================================

// Q30. Add "RealEstate" to the products array of account 371138
// in the accounts collection of the sample_analytics database,
// without adding duplicates.
db.accounts.updateOne(
  { accountid: 371138 },
  { $addToSet: { products: "RealEstate" } },
);

// Q31. Add account ID 111111 to the accounts array of customer fmiller
// in the customers collection of the sample_analytics database.
db.customers.updateOne(
  { username: "fmiller" },
  { $push: { accounts: 111111 } },
);

// Q32. Update the transaction with symbol "znga" for account 316726
// in the transactions collection of the sample_analytics database.
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

// Q33. Update maximum nights and cleaning fee for Ribeira Charming Duplex
// in the listingsAndReviews collection of the sample_airbnb database.
db.listingsAndReviews.updateOne(
  { name: "Ribeira Charming Duplex" },
  {
    $set: {
      maximum_nights: 60,
      cleaning_fee: 40,
    },
  },
);

// Q34. Add Free WiFi to the amenities array of listing 10006546
// in the listingsAndReviews collection of the sample_airbnb database.
db.listingsAndReviews.updateOne(
  { _id: "10006546" },
  { $push: { amenities: "Free WiFi" } },
);

// Q35. Set host_is_superhost to true when listing 10006546 has
// fewer than 100 reviews in the listingsAndReviews collection
// of the sample_airbnb database.
db.listingsAndReviews.updateOne(
  {
    _id: "10006546",
    $expr: { $lt: [{ $size: "$reviews" }, 100] },
  },
  {
    $set: { "host.host_is_superhost": true },
  },
);

// Q36. Update the depth and water level of Record 101
// in the shipwrecks collection of the sample_geospatial database.
db.shipwrecks.updateOne(
  { recrd: "Record 101" },
  {
    $set: {
      depth: 120,
      watlev: "partially submerged",
    },
  },
);

// Q37. Update history and GPS quality of Record 102
// in the shipwrecks collection of the sample_geospatial database.
db.shipwrecks.updateOne(
  { recrd: "Record 102" },
  {
    $set: {
      history: "Discovered in 2005",
      gp_quality: "High",
    },
  },
);

// Q38. Replace the nested surfaceTemperatureC object for Mercury
// in the planets collection of the sample_guides database.
db.planets.updateOne(
  { name: "Mercury" },
  {
    $set: {
      surfaceTemperatureC: {
        min: -160,
        max: 450,
        mean: 65,
      },
    },
  },
);

// Q39. Add Oxygen to the mainAtmosphere array of Venus
// in the planets collection of the sample_guides database.
db.planets.updateOne(
  { name: "Venus" },
  { $push: { mainAtmosphere: "Oxygen" } },
);

// Q40. Update Venus's order from the Sun to 3
// in the planets collection of the sample_guides database.
db.planets.updateOne({ name: "Venus" }, { $set: { orderFromSun: 3 } });

// Q41. Change the store location to Los Angeles for a specific sale
// in the sales collection of the sample_supplies database.
db.sales.updateOne(
  { _id: ObjectId("5bd761dcae323e45a93ccfe8") },
  { $set: { storeLocation: "Los Angeles" } },
);

// Q42. Increase the quantity of pens by 3 in a specific sale
// in the sales collection of the sample_supplies database.
db.sales.updateOne(
  {
    _id: ObjectId("5bd761dcae323e45a93ccfe8"),
    "items.name": "pens",
  },
  { $inc: { "items.$.quantity": 3 } },
);

// Q43. Change the customer's email for a specific sale
// in the sales collection of the sample_supplies database.
db.sales.updateOne(
  { _id: ObjectId("5bd761dcae323e45a93ccfe8") },
  { $set: { "customer.email": "newemail@example.com" } },
);

// Q44. Remove items tagged "stationary" from a specific sale
// in the sales collection of the sample_supplies database.
db.sales.updateOne(
  { _id: ObjectId("5bd761dcae323e45a93ccfe8") },
  { $pull: { items: { tags: "stationary" } } },
);

// Q45. Update air temperature, pressure and call letters
// for a weather record in the data collection of the sample_weatherdata database.
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

// Q46. Set visibility variability to V for all weather records
// where wind speed is above 10 in the data collection
// of the sample_weatherdata database.
db.data.updateMany(
  { "wind.speed.rate": { $gt: 10 } },
  { $set: { "visibility.variability.value": "V" } },
);

// ============================================================
// DELETE
// ============================================================

// Q47. Delete transactions ending before January 1, 2000
// from the transactions collection of the sample_analytics database.
db.transactions.deleteMany({
  bucket_end_date: { $lt: new Date("2000-01-01T00:00:00Z") },
});

// Q48. Delete listing 10006546
// from the listingsAndReviews collection of the sample_airbnb database.
db.listingsAndReviews.deleteOne({
  _id: "10006546",
});

// Q49. Delete reviews dated before January 1, 2015 from listing 1001265
// in the listingsAndReviews collection of the sample_airbnb database.
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

// Q50. Delete shipwreck Record 101
// from the shipwrecks collection of the sample_geospatial database.
db.shipwrecks.deleteOne({
  recrd: "Record 101",
});

// Q51. Delete shipwrecks with depth below 50 metres
// from the shipwrecks collection of the sample_geospatial database.
db.shipwrecks.deleteMany({
  depth: { $lt: 50 },
});

// Q52. Delete visible shipwrecks with latitude above 20
// from the shipwrecks collection of the sample_geospatial database.
db.shipwrecks.deleteMany({
  feature_type: "Wrecks - Visible",
  latdec: { $gt: 20 },
});

// Q53. Delete Pluto
// from the planets collection of the sample_guides database.
db.planets.deleteOne({
  name: "Pluto",
});

// Q54. Delete a sale belonging to a specified customer email
// from the sales collection of the sample_supplies database.
db.sales.deleteOne({
  "customer.email": "cauho@witwuta.sv",
});

// Q55. Delete weather records with elevation above 8000
// from the data collection of the sample_weatherdata database.
db.data.deleteMany({
  elevation: { $gt: 8000 },
});

// Q56. Delete weather records with air temperature above 25
// from the data collection of the sample_weatherdata database.
db.data.deleteMany({
  "airTemperature.value": { $gt: 25 },
});

// Q57. Find sales whose total item value is below 100 and delete them
// from the sales collection of the sample_supplies database.
const salesToDelete = db.sales
  .aggregate([
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
  ])
  .toArray();

salesToDelete.forEach((sale) => {
  db.sales.deleteOne({ _id: sale._id });
});

// ============================================================
// SORTING AND CURSOR ITERATION
// ============================================================

// Q58. Find planets with mean surface temperature above 100 and sort
// by order from the Sun descending in the planets collection
// of the sample_guides database.
db.planets
  .find({
    "surfaceTemperatureC.mean": { $gt: 100 },
  })
  .sort({
    orderFromSun: -1,
  });

// Q59. Find all planets and sort by order from the Sun ascending
// in the planets collection of the sample_guides database.
db.planets.find().sort({
  orderFromSun: 1,
});

// Q60. Find movies with runtime above 90 minutes, excluding Short,
// and print their titles, cast and genres from the movies collection
// of the sample_mflix database.
db.movies
  .find({
    runtime: { $gt: 90 },
    genres: { $ne: "Short" },
  })
  .forEach((movie) => {
    print(`${movie.title}: ${movie.cast.join(", ")} - ${movie.genres}`);
  });

// Q61. Find John Ford movies with allowed ratings and print title,
// year, plot and Rotten Tomatoes viewer rating from the movies collection
// of the sample_mflix database.
db.movies
  .find({
    directors: "John Ford",
    rated: { $in: ["PASSED", "G", "PG", "PG-13", "R", "NC-17"] },
  })
  .forEach((movie) => {
    print(
      `${movie.title} (${movie.year}): ${movie.plot} - RT: ${movie.tomatoes.viewer.rating}`,
    );
  });
