db.grades.insertOne({
  student_id: 654321,
  products: [
    {
      type: "exam",
      score: 90,
    },
    {
      type: "homework",
      score: 59,
    },
    {
      type: "quiz",
      score: 75,
    },
    {
      type: "homework",
      score: 88,
    },
  ],
  class_id: 550,
});

db.grades.insertMany([
  {
    student_id: 546789,
    products: [
      {
        type: "quiz",
        score: 50,
      },
      {
        type: "homework",
        score: 70,
      },
      {
        type: "quiz",
        score: 66,
      },
      {
        type: "exam",
        score: 70,
      },
    ],
    class_id: 551,
  },
  {
    student_id: 777777,
    products: [
      {
        type: "exam",
        score: 83,
      },
      {
        type: "quiz",
        score: 59,
      },
      {
        type: "quiz",
        score: 72,
      },
      {
        type: "quiz",
        score: 67,
      },
    ],
    class_id: 550,
  },
  {
    student_id: 223344,
    products: [
      {
        type: "exam",
        score: 45,
      },
      {
        type: "homework",
        score: 39,
      },
      {
        type: "quiz",
        score: 40,
      },
      {
        type: "homework",
        score: 88,
      },
    ],
    class_id: 551,
  },
]);

db.books.findOne({ title: { $eq: "Brave New World" } });
db.books.findOne({ title: "Brave New World" });
db.books.find({ publisher: "MongoDB Press" });
db.zips.find({ city: { $in: ["PHOENIX", "CHICAGO"] } });

db.podcasts.updateOne(
  {
    _id: ObjectId("5e8f8f8f8f8f8f8f8f8f8f8"),
  },

  {
    $set: {
      subscribers: 98562,
    },
  },
);

db.podcasts.updateOne(
  { title: "The Developer Hub" },
  { $set: { topics: ["databases", "MongoDB"] } },
  { upsert: true },
);

db.podcasts.updateOne(
  { _id: ObjectId("5e8f8f8f8f8f8f8f8f8f8f8") },
  { $push: { hosts: "Nic Raboy" } },
);

db.books.updateMany(
  { publishedDate: { $lt: new Date("2019-01-01") } },
  { $set: { status: "LEGACY" } },
);

db.podcasts.deleteOne({ _id: Objectid("6282c9862acb966e76bbf20a") });
db.podcasts.deleteMany({ category: "crime" });

db.sales.find({ "items.price": { $gt: 50 } });
db.sales.find({ "items.price": { $lt: 50 } });
db.sales.find({ "customer.age": { $lte: 65 } });
db.sales.find({ "customer.age": { $gte: 65 } });

db.routes.find({ "airline.name": "Southwest Airlines", stops: { $gte: 1 } });

db.routes.find({
  $or: [{ dst_airport: "SEA" }, { src_airport: "SEA" }],
});

db.routes.find({
  $and: [
    { $or: [{ dst_airport: "SEA" }, { src_airport: "SEA" }] },
    { $or: [{ "airline.name": "American Airlines" }, { airplane: 320 }] },
  ],
});

db.accounts.find({ products: "InvestmentFund" });

db.sales.find({
  items: {
    $elemMatch: { name: "laptop", price: { $gt: 800 }, quantity: { $gte: 1 } },
  },
});

// Return data on all music companies, sorted alphabetically from A to Z.
db.companies.find({ category_code: "music" }).sort({ name: 1 });

// Return data on all music companies, sorted alphabetically from A to Z. Ensure consistent sort order
db.companies.find({ category_code: "music" }).sort({ name: 1, _id: 1 });

// Return the three music companies with the highest number of employees. Ensure consistent sort order.
db.companies
  .find({ category_code: "music" })
  .sort({ number_of_employees: -1, _id: 1 })
  .limit(3);

// Return all restaurant inspections - business name, result, and _id fields only
db.inspections.find(
  { sector: "Restaurant - 818" },
  { business_name: 1, result: 1 },
);

// Return all inspections with result of "Pass" or "Warning" - exclude date and zip code
db.inspections.find(
  { result: { $in: ["Pass", "Warning"] } },
  { date: 0, "address.zip": 0 },
);

// Return all restaurant inspections - business name and result fields only
db.inspections.find(
  { sector: "Restaurant - 818" },
  { business_name: 1, result: 1, _id: 0 },
);

// Count number of docs in trip collection
db.trips.countDocuments({});

// Count number of trips over 120 minutes by subscribers
db.trips.countDocuments({ tripduration: { $gt: 120 }, usertype: "Subscriber" });

// db.collection.find(<query>).sort(<sort>) // Sorting Results
// db.companies.find(<query>).limit(<number>) // Limiting Results
// db.collection.find(<query>, <projection>) // Add a Projection Document
// db.collection.find(<query>, { <field> : 1 }) // Include a Field
// db.collection.find(query, { <field> : 0, <field>: 0 }) // Exclude a Field
// db.collection.countDocuments( <query>, <options> ) // Count Documents

// {
//     _id: ObjectId('650e1f291b8e4bcd7c9a9d54'),
//     date: ISODate('2024-04-19T12:30:00.000Z'),
//     customer: ObjectId('650e1f291b8e4bcd7c9a9d52'),
//     books: [
//       {
//         _id: ObjectId('650e1f291b8e4bcd7c9a9c02'),
//         title: 'The Little Prince',
//         author: { name: 'Antoine de Saint-Exupéry', nationality: 'French' },
//         original_language: 'French',
//         date_of_original_publication: '1943',
//         genre: "Fantasy, children's fiction",
//         price: 18
//       },
//       {
//         _id: ObjectId('650e1f291b8e4bcd7c9a9c03'),
//         title: 'The Alchemist',
//         author: { name: 'Paulo Coelho', nationality: 'Brazilian' },
//         original_language: 'Portuguese',
//         date_of_original_publication: '1988',
//         genre: 'Fantasy',
//         price: 21
//       }
//    ],
//     promo_code: null,
//     sales_tax: 0.07,
//     total: 41.55
//   }

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
  {
    $out: "analysis_report",
  },
]);

// {
//    _id: ObjectId('67bde3d8776fd7c1b5fce15b'),
//    book_id: ObjectId('67bde3d8776fd7c1b5fce093'),
//    customer_id: ObjectId('67bde3d8776fd7c1b5fce094'),
//    title: 'The Last Stand',
//    rating: 2,
//    review: "I found the book to be boring and unoriginal. It didn't live up to the hype.",
//    timestamp: ISODate('2019-02-23T23:57:22.150Z')
// }

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

// {
//     _id: ObjectId('650e1f291b8e4bcd7c9a9d54'),
//     date: ISODate('2024-04-19T12:30:00.000Z'),
//     customer: ObjectId('650e1f291b8e4bcd7c9a9d52'),
//     books: [
//       {
//         _id: ObjectId('650e1f291b8e4bcd7c9a9c02'),
//         title: 'The Little Prince',
//         author: { name: 'Antoine de Saint-Exupéry', nationality: 'French' },
//         original_language: 'French',
//         date_of_original_publication: '1943',
//         genre: "Fantasy, children's fiction",
//         price: 18
//       },
//       {
//         _id: ObjectId('650e1f291b8e4bcd7c9a9c03'),
//         title: 'The Alchemist',
//         author: { name: 'Paulo Coelho', nationality: 'Brazilian' },
//         original_language: 'Portuguese',
//         date_of_original_publication: '1988',
//         genre: 'Fantasy',
//         price: 21
//       }
//    ],
//     promo_code: null,
//     sales_tax: 0.07,
//     total: 41.55
//   }

// {
//     _id: ObjectId('650e1f291b8e4bcd7c9a9d45'),
//     name: { first: 'Liam', last: 'Miller' },
//     email: 'liam.miller@example.com',
//     address: { city: 'Denver', state: 'CO' },
//     sales: [
//       ObjectId('650e1f291b8e4bcd7c9a9d46'),
//       ObjectId('650e1f291b8e4bcd7c9a9d47'),
//       ObjectId('650e1f291b8e4bcd7c9a9d48'),
//       ObjectId('650e1f291b8e4bcd7c9a9d49')
//     ]
//   }

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

db.collection.explain().aggregate();

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
