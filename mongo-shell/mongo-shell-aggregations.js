// ============================================================
// $MATCH + $PROJECT
// ============================================================

// Q1. Find food-related posts created during 2012 and return title, author and comment count from the posts collection of the sample_training database.
db.posts.aggregate([
  {
    $match: {
      tags: "food",
      date: {
        $gte: new Date("2012-01-01"),
        $lt: new Date("2013-01-01"),
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

// Q2. Find restaurants with longitude between -73.94 and -73.92 and return their names and grade details from the restaurants collection of the sample_restaurants database.
db.restaurants.aggregate([
  {
    $match: {
      "address.coord.0": {
        $gte: -73.94,
        $lte: -73.92,
      },
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

// ============================================================
// $UNWIND + $MATCH + $GROUP
// ============================================================

// Q3. Calculate the total quantity sold for the item "notepad" from the sales collection of the sample_supplies database.
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

// Q4. Find restaurants with latitude above 40.70 and calculate the highest grade score for each restaurant from the restaurants collection of the sample_restaurants database.
db.restaurants.aggregate([
  { $unwind: "$grades" },
  {
    $match: {
      "address.coord.1": { $gt: 40.7 },
    },
  },
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

// Q5. Find trips that started and ended at the same station and count the number of such trips from the trips collection of the sample_training database.
db.trips.aggregate([
  {
    $match: {
      $expr: {
        $eq: ["$start station name", "$end station name"],
      },
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

// Q6. Calculate the total price of each sale using item price multiplied by quantity, and return sales below 100 from the sales collection of the sample_supplies database.
db.sales.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$_id",
      totalPrice: {
        $sum: {
          $multiply: ["$items.price", "$items.quantity"],
        },
      },
    },
  },
  { $match: { totalPrice: { $lt: 100 } } },
]);

// ============================================================
// $SORT + $LIMIT
// ============================================================

// Q7. Find the top three companies associated with Ben Elowitz, sorted by employee count, from the companies collection of the sample_training database.
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

// ============================================================
// $LOOKUP — JOIN COLLECTIONS
// ============================================================

// Q8. Find users who commented on movies with IMDb ratings above 7 and return each user's name, email and movie titles. Use the comments, movies and users collections of the sample_mflix database.
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  { $unwind: "$movie" },
  {
    $match: {
      "movie.imdb.rating": { $gt: 7 },
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
    $group: {
      _id: "$email",
      name: { $first: { $arrayElemAt: ["$user.name", 0] } },
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

// Q9. Find users who commented on Action movies and return their names, email addresses and comment counts. Use the comments, movies and users collections of the sample_mflix database.
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  { $unwind: "$movie" },
  { $match: { "movie.genres": "Action" } },
  {
    $group: {
      _id: "$email",
      commentCount: { $sum: 1 },
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "email",
      as: "user",
    },
  },
  {
    $project: {
      _id: 0,
      name: { $arrayElemAt: ["$user.name", 0] },
      email: "$_id",
      commentCount: 1,
    },
  },
]);

// Q10. Find movies released before 1950 with IMDb ratings of at least 7 and calculate their comment counts using the movies and comments collections of the sample_mflix database.
db.movies.aggregate([
  {
    $match: {
      year: { $lt: 1950 },
      "imdb.rating": { $gte: 7 },
    },
  },
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "movie_id",
      as: "comments",
    },
  },
  {
    $project: {
      title: 1,
      comments_count: { $size: "$comments" },
    },
  },
]);

// Q11. Find comments made by a specific user and return the user's name, movie title and comment text. Use the comments, movies and users collections of the sample_mflix database.
db.comments.aggregate([
  {
    $match: {
      email: "mercedes_tyler@fakegmail.com",
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
      text: 1,
    },
  },
]);

// Q12. Find comments on Western movies released in 1903 and return movie title, comment text and user email. Use the comments, movies and users collections of the sample_mflix database.
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  { $unwind: "$movie" },
  {
    $match: {
      "movie.genres": "Western",
      "movie.year": 1903,
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
      title: "$movie.title",
      text: 1,
      email: 1,
    },
  },
]);

// Q13. Find comments on Drama movies released after 2000 and return the user's name, movie title and comment date. Use the comments, movies and users collections of the sample_mflix database.
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  { $unwind: "$movie" },
  {
    $match: {
      "movie.genres": "Drama",
      "movie.year": { $gt: 2000 },
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
      title: "$movie.title",
      date: 1,
    },
  },
]);

// ============================================================
// $REGEX + $UNWIND + MULTIPLE $MATCH
// ============================================================

// Q14. Find media-platform companies with funding rounds above 10 million and return company name, funding amount and founding year from the companies collection of the sample_training database.
db.companies.aggregate([
  {
    $match: {
      tag_list: { $regex: /media-platform/ },
    },
  },
  { $unwind: "$funding_rounds" },
  {
    $match: {
      "funding_rounds.raised_amount": { $gt: 10000000 },
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      founded_year: 1,
      funding_amount: "$funding_rounds.raised_amount",
    },
  },
]);

// Q15. Find American restaurants with a grade score of at least 7 and retrieve matching neighbourhood documents using a pipeline-based $lookup from the restaurants and neighbourhoods collections of the sample_restaurants database.
// SOURCE LIMITATION: The original query declares a let variable but never uses it. This preserves the lookup pattern, not a correct geographical match.

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
      let: {
        lng: { $arrayElemAt: ["$address.coord", 0] },
      },
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
      neighbourhood: {
        $arrayElemAt: ["$neighbourhood.name", 0],
      },
    },
  },
]);

// Q16. Calculate total revenue for each book genre during 2024
// in the `sales` collection (database not specified in source).
db.sales.aggregate([
  {
    $match: {
      date: {
        $gte: ISODate("2024-01-01T00:00:00.000Z"),
        $lt: ISODate("2025-01-01T00:00:00.000Z"),
      },
    },
  },
  { $unwind: { path: "$books" } },
  {
    $group: {
      _id: "$books.genre",
      totalRevenue: { $sum: "$books.price" },
    },
  },
  {
    $project: {
      _id: 0,
      genre: "$_id",
      totalRevenue: 1,
    },
  },
]);

// Q17. Calculate 2024 revenue by book genre and save the results
// in the `analysis_report` collection (database not specified in source).
db.sales.aggregate([
  {
    $match: {
      date: {
        $gte: ISODate("2024-01-01T00:00:00.000Z"),
        $lt: ISODate("2025-01-01T00:00:00.000Z"),
      },
    },
  },
  { $unwind: { path: "$books" } },
  {
    $group: {
      _id: "$books.genre",
      totalRevenue: { $sum: "$books.price" },
    },
  },
  {
    $project: {
      _id: 0,
      genre: "$_id",
      totalRevenue: 1,
    },
  },
  { $out: "analysis_report" },
]);

// Q18. Calculate the average rating per book for reviews after January 2018,
// sort by average rating descending, and return the top 10
// in the `reviews` collection (database not specified in source).
db.reviews.aggregate([
  {
    $match: {
      timestamp: {
        $gt: ISODate("2018-01-01T05:00:00.000Z"),
      },
    },
  },
  {
    $group: {
      _id: "$book_id",
      averageRating: { $avg: "$rating" },
    },
  },
  { $sort: { averageRating: -1 } },
  { $limit: 10 },
]);

// Q19. Calculate the top 10 books by average rating for reviews after January 2018
// and save the results in the `reviews_analysis` collection
// (database not specified in source).
db.reviews.aggregate([
  {
    $match: {
      timestamp: {
        $gt: ISODate("2018-01-01T05:00:00.000Z"),
      },
    },
  },
  {
    $group: {
      _id: "$book_id",
      averageRating: { $avg: "$rating" },
    },
  },
  { $sort: { averageRating: -1 } },
  { $limit: 10 },
  { $out: "reviews_analysis" },
]);

// Q20. Find customers who purchased books in Children's literature,
// and return their name, email, and matching book titles
// by joining the `sales` and `customers` collections (database not specified in source).
db.sales.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer",
      foreignField: "_id",
      as: "customer_details",
    },
  },
  {
    $unwind: {
      path: "$customer_details",
    },
  },
  {
    $set: {
      childrensBooks: {
        $filter: {
          input: "$books",
          as: "book",
          cond: {
            $eq: ["$$book.genre", "Children's literature"],
          },
        },
      },
    },
  },
  {
    $match: {
      childrensBooks: {
        $ne: [],
      },
    },
  },
  {
    $project: {
      _id: 0,
      customerName: {
        $concat: [
          "$customer_details.name.first",
          " ",
          "$customer_details.name.last",
        ],
      },
      email: "$customer_details.email",
      childrensBooks: "$childrensBooks.title",
    },
  },
]);

// Q21. Generate customer book recommendations and save them
// in the `book_recommendations` collection
// by joining the `sales` and `customers` collections (database not specified in source).
db.sales.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer",
      foreignField: "_id",
      as: "customer_details",
    },
  },
  {
    $unwind: {
      path: "$customer_details",
    },
  },
  {
    $set: {
      childrensBooks: {
        $filter: {
          input: "$books",
          as: "book",
          cond: {
            $eq: ["$$book.genre", "Children's literature"],
          },
        },
      },
    },
  },
  {
    $match: {
      childrensBooks: {
        $ne: [],
      },
    },
  },
  {
    $project: {
      _id: 0,
      customerName: {
        $concat: [
          "$customer_details.name.first",
          " ",
          "$customer_details.name.last",
        ],
      },
      email: "$customer_details.email",
      childrensBooks: "$childrensBooks.title",
    },
  },
  { $out: "book_recommendations" },
]);

// Q22. Explain the execution plan for grouping books by genre
// and calculating average ratings in the `books` collection
// (database not specified in source).
db.books.explain().aggregate([
  {
    $match: {
      date_of_original_publication: {
        $gte: "2020",
      },
    },
  },
  {
    $group: {
      _id: "$genre",
      genre_average_rating: {
        $avg: "$average_rating",
      },
    },
  },
  { $sort: { genre_average_rating: -1 } },
]);
