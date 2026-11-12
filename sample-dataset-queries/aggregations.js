/*
MONGODB SAMPLE QUERIES — AGGREGATION
Condensed from the 9 original sample_* files.

An aggregation pipeline passes documents through ordered stages.
Keep only distinct pipeline patterns; collection names and literal values
have been consolidated where they do not add a new concept.
*/

// =============================================================================
// 1. $MATCH + $PROJECT
// =============================================================================

// Filter documents, then shape the output and calculate a field.
// Source pattern: sample_training.js.
db.posts.aggregate([
  {
    $match: {
      tags: "food",
      date: {
        $gte: new Date("2012-01-01T00:00:00.000Z"),
        $lt: new Date("2013-01-01T00:00:00.000Z"),
      },
    },
  },
  {
    $project: {
      _id: 0,
      title: 1,
      author: 1,
      commentCount: { $size: "$comments" },
    },
  },
]);

// =============================================================================
// 2. $UNWIND + $MATCH + $GROUP
// =============================================================================

// Turn array elements into separate pipeline documents, filter them,
// then calculate a total.
// Source pattern: sample_supplies.js.
db.sales.aggregate([
  { $unwind: "$items" },
  { $match: { "items.name": "notepad" } },
  {
    $group: {
      _id: "$items.name",
      totalQuantity: { $sum: "$items.quantity" },
    },
  },
]);

// =============================================================================
// 3. $GROUP WITH $MAX
// =============================================================================

// Group the unwound grade records back by restaurant and find the highest score.
// Source pattern: sample_restaurants.js (duplicate exercises 6 and 9 reduced to one).
db.restaurants.aggregate([
  { $unwind: "$grades" },
  { $match: { "address.coord.1": { $gt: 40.7 } } },
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      address: { $first: "$address.street" },
      highestScore: { $max: "$grades.score" },
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      address: 1,
      highestScore: 1,
    },
  },
]);

// =============================================================================
// 4. CALCULATE VALUES WITH $MULTIPLY
// =============================================================================

// Calculate total value across an array: price * quantity, summed per sale.
// Source pattern: sample_supplies.js.
db.sales.aggregate([
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
]);

// =============================================================================
// 5. $LOOKUP — JOIN TWO COLLECTIONS
// =============================================================================

// Join comments to movies using a matching field.
// $lookup places matching documents in an ARRAY.
// Source pattern: sample_mflix.js.
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  { $match: { "movie.imdb.rating": { $gt: 7.0 } } },
  {
    $project: {
      email: 1,
      movieTitle: { $arrayElemAt: ["$movie.title", 0] },
    },
  },
]);

// =============================================================================
// 6. MULTIPLE $LOOKUP STAGES
// =============================================================================

// Join comments to movies and users, then return fields from both joins.
// Source pattern: sample_mflix.js.
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "email",
      foreignField: "email",
      as: "user",
    },
  },
  {
    $project: {
      _id: 0,
      name: { $arrayElemAt: ["$user.name", 0] },
      title: { $arrayElemAt: ["$movie.title", 0] },
      email: 1,
    },
  },
]);

// =============================================================================
// 7. $LOOKUP + $GROUP
// =============================================================================

// Join comments to users and movies, then group comments by user.
// The joined fields are arrays because $lookup returns arrays.
// This follows the original sample_mflix.js pattern.
db.comments.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "email",
      foreignField: "email",
      as: "user",
    },
  },
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  {
    $group: {
      _id: "$email",
      name: { $first: "$user.name" },
      movies: { $push: "$movie.title" },
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      email: "$_id",
      movies: 1,
    },
  },
]);

// =============================================================================
// 8. $EXPR — COMPARE TWO FIELDS IN THE SAME DOCUMENT
// =============================================================================

// $expr allows aggregation expressions inside a query/pipeline match.
// Source pattern: sample_training.js.
db.trips.aggregate([
  {
    $match: {
      $expr: { $eq: ["$start station name", "$end station name"] },
    },
  },
  {
    $group: {
      _id: {
        start: "$start station name",
        end: "$end station name",
      },
      totalTrips: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      start_station: "$_id.start",
      end_station: "$_id.end",
      totalTrips: 1,
    },
  },
]);

// =============================================================================
// 9. $UNWIND + $MATCH + $SORT + $LIMIT
// =============================================================================

// Find top three companies after matching a nested relationship.
// Source pattern: sample_training.js.
db.companies.aggregate([
  { $unwind: "$relationships" },
  {
    $match: {
      "relationships.person.first_name": "Ben",
      "relationships.person.last_name": "Elowitz",
    },
  },
  {
    $project: {
      _id: 0,
      company: "$name",
      employees: "$number_of_employees",
      title: "$relationships.title",
    },
  },
  { $sort: { employees: -1 } },
  { $limit: 3 },
]);

// =============================================================================
// 10. $REGEX + $UNWIND + SECOND $MATCH + $PROJECT
// =============================================================================

// Filter a text field, unwind funding rounds, then filter each array element.
// Source pattern: sample_training.js.
db.companies.aggregate([
  { $match: { tag_list: { $regex: /media-platform/ } } },
  { $unwind: "$funding_rounds" },
  { $match: { "funding_rounds.raised_amount": { $gt: 10000000 } } },
  {
    $project: {
      _id: 0,
      name: 1,
      founded_year: 1,
      funding_amount: "$funding_rounds.raised_amount",
    },
  },
]);

// =============================================================================
// AGGREGATION STAGE / OPERATOR MAP
// =============================================================================

/*
Stages:
$match     — filter documents
$project   — shape output / compute fields
$unwind    — create one pipeline document per array element
$group     — group documents and calculate values
$lookup    — join another collection
$sort      — sort pipeline results
$limit     — cap the number of results

Expressions / accumulators used in these source files:
$sum, $max, $first, $addToSet, $multiply, $size, $arrayElemAt, $eq

Important:
- $lookup returns an array in its "as" field.
- $unwind on an array can increase the number of pipeline documents.
- $group changes the document shape; _id defines the grouping key.
- $project can rename fields using "$existingField".
*/
