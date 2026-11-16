// ============================================================
// FIELD INCLUSION
// ============================================================

// Q1. Find listings with review scores above 85 and return their names, prices and review scores from the listingsAndReviews collection of the sample_airbnb database.
db.listingsAndReviews.find(
  {
    "review_scores.review_scores_rating": { $gt: 85 },
  },
  {
    name: 1,
    price: 1,
    review_scores: 1,
  },
);

// Q2. Find visible shipwrecks and return only record number, vessel terms and coordinates from the shipwrecks collection of the sample_geospatial database.
db.shipwrecks.find(
  { feature_type: "Wrecks - Visible" },
  {
    recrd: 1,
    vesslterms: 1,
    coordinates: 1,
  },
);

// Q3. Find transactions involving IBM sells and return only their transaction details from the transactions collection of the sample_analytics database.
db.transactions.find(
  {
    "transactions.symbol": "ibm",
    "transactions.transaction_code": "sell",
  },
  {
    transactions: 1,
  },
);

// Q4. Find trips taken by users born before 1970 and return trip duration, start station, end station and user type, excluding _id, from the trips collection of the sample_training database.
db.trips.find(
  {
    "birth year": { $lt: 1970 },
  },
  {
    _id: 0,
    tripduration: 1,
    "start station name": 1,
    "end station name": 1,
    usertype: 1,
  },
);

// Q5. Find Aerocondor routes and return source airport, destination airport and number of stops from the routes collection of the sample_training database.
db.routes.find(
  {
    "airline.name": "Aerocondor",
  },
  {
    _id: 0,
    src_airport: 1,
    dst_airport: 1,
    stops: 1,
  },
);

// Q6. Find students with an exam score above 90 and return student ID and scores from the grades collection of the sample_training database.
db.grades.find(
  {
    scores: {
      $elemMatch: {
        type: "exam",
        score: { $gt: 90 },
      },
    },
  },
  {
    _id: 0,
    student_id: 1,
    scores: 1,
  },
);

// Q7. Find companies acquired for more than 25 million and return company name, acquisition price and acquiring company name from the companies collection of the sample_training database.
db.companies.find(
  {
    "acquisition.price_amount": { $gt: 25000000 },
  },
  {
    _id: 0,
    name: 1,
    "acquisition.price_amount": 1,
    "acquisition.acquiring_company.name": 1,
  },
);

// Q8. Find cities with population above 40,000 and return city, state and population from the zips collection of the sample_training database.
db.zips.find(
  {
    pop: { $gt: 40000 },
  },
  {
    _id: 0,
    city: 1,
    state: 1,
    pop: 1,
  },
);

// Q9. Find a weather record by ID and return air temperature and pressure from the data collection of the sample_weatherdata database.
db.data.find(
  {
    _id: ObjectId("5553a998e4b02cf7151190b8"),
  },
  {
    airTemperature: 1,
    pressure: 1,
  },
);

// Q10. Find a sale by ID and return only item names and prices from the sales collection of the sample_supplies database.
db.sales.find(
  {
    _id: ObjectId("5bd761dcae323e45a93ccfe8"),
  },
  {
    "items.name": 1,
    "items.price": 1,
  },
);

// Q11. Find California theatres and return theatre ID, street, city and coordinates from the theaters collection of the sample_mflix database.
db.theaters.find(
  {
    "location.address.state": "CA",
  },
  {
    theaterId: 1,
    "location.address.street": 1,
    "location.address.city": 1,
    "location.coordinates": 1,
  },
);

// ============================================================
// FIELD EXCLUSION
// ============================================================

// Q12. Find inspections with result "No Violation Issued" in 2015 and exclude the _id field from the inspections collection of the sample_training database.
db.inspections.find(
  {
    result: "No Violation Issued",
    date: { $regex: /2015/ },
  },
  {
    _id: 0,
    business_name: 1,
    "address.street": 1,
    "address.number": 1,
    "address.city": 1,
    date: 1,
  },
);

// Q13. Find Brooklyn restaurants within the specified longitude range and return only their names from the restaurants collection of the sample_restaurants database.
db.restaurants.find(
  {
    borough: "Brooklyn",
    "address.coord.0": {
      $gte: -73.95,
      $lte: -73.9,
    },
  },
  {
    _id: 0,
    name: 1,
  },
);
