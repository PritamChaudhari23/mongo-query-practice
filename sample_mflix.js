// 1.Find all users who have commented on movies with a rating above 7.0, and list the titles of those movies.**
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  { $match: { "movie.imdb_rating": { $gt: 7.0 } } },
  {
    $lookup: {
      from: "users",
      localField: "email",
      foreignField: "email",
      as: "user",
    },
  },
  { $group: { _id: "$email", movies: { $push: "$movie.title" } } },
]);

// 2.List the names and email addresses of users who have watched movies of the genre "Action" and have posted a comment about these movies.**
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  { $match: { "movie.genres": "Action" } },
  { $group: { _id: "$email", count: { $sum: 1 } } },
  { $match: { count: { $gt: 0 } } },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "email",
      as: "user",
    },
  },
  { $project: { name: { $arrayElemAt: ["$user.name", 0] }, email: "$_id" } },
]);

// 3.Find all movies that were released before 1950 and have received an IMDb rating of 7.0 or higher. List the movie titles and the number of comments on each movie.**
db.movies.aggregate([
  { $match: { year: { $lt: 1950 }, imdb_rating: { $gte: 7.0 } } },
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "movie_id",
      as: "comments",
    },
  },
  { $project: { title: 1, comments_count: { $size: "$comments" } } },
]);

// 4.Find all the theatres that are located in California, and list their names along with their addresses and coordinates.**
db.theaters.find(
  { "location.address.state": "CA" },
  {
    theaterId: 1,
    "location.address.street": 1,
    "location.address.city": 1,
    "location.coordinates": 1,
  }
);

// 5.Retrieve all comments made on movies where the user's email address is "mercedes_tyler@fakegmail.com." Include the name of the user, movie title, and the comment text.**
db.comments.aggregate([
  { $match: { email: "mercedestyler@fakegmail.com" } },
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
      name: { $arrayElemAt: ["$user.name", 0] },
      title: { $arrayElemAt: ["$movie.title", 0] },
      text: 1,
    },
  },
]);

// 6.List all movies with a runtime greater than 90 minutes, and display the names of their cast members along with their genres. Exclude movies that belong to the "Short" genre.**
db.movies
  .find({
    runtime: { $gt: 90 },
    genres: { $ne: "Short" },
  })
  .forEach((movie) => {
    print(`${movie.title}: ${movie.cast.join(", ")} - ${movie.genres}`);
  });

// 7.Find all users who have posted comments on movies of the genre "Western" in 1903. Display the movie titles, the text of their comments, and the users' email addresses.**
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  { $match: { "movie.genres": "Western", "movie.year": 1903 } },
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
      title: { $arrayElemAt: ["$movie.title", 0] },
      text: 1,
      email: 1,
    },
  },
]);

// 8.List the names of the users who have an active session (i.e., whose session JWT token is not expired). For each user, display their name, email, and the movie titles they have commented on.**
db.sessions.aggregate([
  {
    $addFields: {
      exp: {
        $arrayElemAt: [
          { $split: [{ $arrayElemAt: [{ $split: ["$jwt", "."] }, 1] }, "."] },
          0,
        ],
      },
    },
  },
  {
    $addFields: {
      exp_num: { $toLong: { $base64ToString: "$exp" } },
      now: {
        $toLong: {
          $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: new Date() },
        },
      },
    },
  },
  { $match: { exp_num: { $gt: "$now" } } },
  {
    $lookup: {
      from: "users",
      localField: "userid",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $lookup: {
      from: "comments",
      let: { email: { $arrayElemAt: ["$user.email", 0] } },
      pipeline: [{ $match: { $expr: { $eq: ["$email", "$$email"] } } }],
      as: "comments",
    },
  },
]);

// 9.Find all movies directed by "John Ford" and display their plot, release year, and average viewer rating (from Rotten Tomatoes). Include only movies that are rated "PASSED" or higher.**
db.movies
  .find({
    directors: "John Ford",
    rated: { $in: ["PASSED", "G", "PG", "PG-13", "R", "NC-17"] },
  })
  .forEach((movie) => {
    print(
      `${movie.title} (${movie.year}): ${movie.plot} - RT: ${movie.tomatoes.viewerRating}`
    );
  });

// 10.Find all comments made on movies that are part of the "Drama" genre and were released after 2000. For each comment, display the user's name, movie title, and comment date.**
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  { $match: { "movie.genres": "Drama", "movie.year": { $gt: 2000 } } },
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
      name: { $arrayElemAt: ["$user.name", 0] },
      title: { $arrayElemAt: ["$movie.title", 0] },
      date: 1,
    },
  },
]);
