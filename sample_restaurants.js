// 1.Retrieve the names of all restaurants in Brooklyn that are located in neighborhoods with coordinates containing longitude values between -73.95 and -73.90.
db.restaurants.find(
  {
    borough: "Brooklyn",
    "address.coord.0": { $gte: -73.95, $lte: -73.9 },
  },
  {
    _id: 0,
    name: 1,
  }
);

// 2.Find all restaurants that serve American cuisine and have a grade score of 7 or higher. Also, return the names and addresses of the neighborhoods where these restaurants are located.
db.restaurants.aggregate([
  { $unwind: "$grades" },
  {
    $match: {
      cuisine: "American",
      "grades.score": { $gte: 7 },
    },
  },
  {
    $lookup: {
      from: "neighbourhoods",
      let: { lng: { $arrayElemAt: ["$address.coord", 0] } },
      pipeline: [
        {
          $match: {
            "geometry.coordinates.0.0.0": { $lte: -73.9 },
          },
        },
      ],
      as: "neighbourhood",
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      address: "$address.street",
      neighbourhood: { $arrayElemAt: ["$neighbourhood.name", 0] },
    },
  },
]);

// 3.List the names and addresses of restaurants in the "Bedford" neighborhood that have a grade of "A" and a score greater than 5.
db.restaurants.aggregate([
  { $unwind: "$grades" },
  {
    $match: {
      "grades.grade": "A",
      "grades.score": { $gt: 5 },
    },
  },
  {
    $lookup: {
      from: "neighbourhoods",
      pipeline: [{ $match: { name: "Bedford" } }],
      as: "neighbourhood",
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      address: "$address.street",
    },
  },
]);

// 4.Retrieve the restaurant names, their grades, and the neighborhood names where the restaurants are located, for restaurants in neighborhoods with a latitude coordinate greater than 40.7.
db.restaurants.aggregate([
  {
    $match: {
      "address.coord.1": { $gt: 40.7 },
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      grades: "$grades.grade",
      neighbourhood: "Unknown",
    },
  },
]);

// 5.Find all neighborhoods that have restaurant(s) with a grade of "A" and a score of 10 or higher. Return the names of these neighborhoods.
db.restaurants.aggregate([
  { $unwind: "$grades" },
  {
    $match: {
      "grades.grade": "A",
      "grades.score": { $gte: 10 },
    },
  },
  {
    $lookup: {
      from: "neighbourhoods",
      pipeline: [],
      as: "neighbourhood",
    },
  },
  {
    $group: {
      _id: "$neighbourhood.name",
    },
  },
  {
    $project: {
      _id: 0,
      neighbourhood: "$_id",
    },
  },
]);

// 6.List the names and addresses of restaurants that are located within the neighborhood boundaries of "Bedford" and have a grade score between 5 and 10.
db.restaurants.aggregate([
  { $unwind: "$grades" },
  {
    $match: {
      "grades.score": { $gte: 5, $lte: 10 },
    },
  },
  {
    $lookup: {
      from: "neighbourhoods",
      pipeline: [{ $match: { name: "Bedford" } }],
      as: "neighbourhood",
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      address: "$address.street",
    },
  },
]);

// 7.Retrieve all restaurant names and their boroughs where the grade score is at least 7, and return the names of the neighborhoods where these restaurants are located.
db.restaurants.aggregate([
  { $unwind: "$grades" },
  {
    $match: {
      "grades.score": { $gte: 7 },
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      borough: 1,
      neighbourhood: "Unknown",
    },
  },
]);

// 8.Find all restaurants in neighborhoods whose coordinates include longitude values between -73.94 and -73.92, and return their names and grade details.
db.restaurants.aggregate([
  {
    $match: {
      "address.coord.0": { $gte: -73.94, $lte: -73.92 },
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      grades: 1,
    },
  },
]);

// 9.List the names and addresses of restaurants located in neighborhoods with a latitude value greater than 40.70, and return the highest grade score for each restaurant.
db.restaurants.aggregate([
  {
    $match: {
      "address.coord.1": { $gt: 40.7 },
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      address: "$address.street",
      highestScore: { $max: "$grades.score" },
    },
  },
]);

// 10.Retrieve all restaurants in the "Brooklyn" borough that serve "American" cuisine and have a grade of "A". Return their names, grades, and the neighborhood they are located in.
db.restaurants.aggregate([
  { $unwind: "$grades" },
  {
    $match: {
      borough: "Brooklyn",
      cuisine: "American",
      "grades.grade": "A",
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      grade: "$grades.grade",
      neighbourhood: "Unknown",
    },
  },
]);
