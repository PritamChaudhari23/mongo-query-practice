const { MongoClient } = require("mongodb");

// DATABASE CONFIGURATION
const dbname = "bank";
const collection_name = "accounts";

// DATABASE CONNECTION
const client = new MongoClient(process.env.MONGODB_URI);

const connectToDatabase = async () => {
  await client.connect();
  console.log("Connected to MongoDB");
};

// COLLECTION
const database = client.db(dbname);
const accountsCollection = database.collection(collection_name);

// AGGREGATION PIPELINE 01
const pipeline01 = [
  // STAGE 1: MATCH
  { $match: { balance: { $lt: 1000 } } },

  // STAGE 2: GROUP
  {
    $group: {
      _id: "$account_type",
      total_balance: { $sum: "$balance" },
      avg_balance: { $avg: "$balance" },
    },
  },
];

// AGGREGATION PIPELINE 02
const pipeline02 = [
  // STAGE 1: MATCH
  {
    $match: {
      account_type: "checking",
      balance: { $gte: 1500 },
    },
  },

  // STAGE 2: SORT
  { $sort: { balance: -1 } },

  // STAGE 3: PROJECT
  {
    $project: {
      _id: 0,
      account_id: 1,
      account_type: 1,
      balance: 1,
      gbp_balance: { $divide: ["$balance", 1.3] },
    },
  },
];

// MAIN
const main = async () => {
  try {
    await connectToDatabase();

    // AGGREGATION 01
    // const result = accountsCollection.aggregate(pipeline01);
    // for await (const doc of result) {
    //   console.log(doc);
    // }

    // AGGREGATION 02
    // const result = accountsCollection.aggregate(pipeline02);
    // for await (const doc of result) {
    //   console.log(doc);
    // }
  } catch (err) {
    console.error(`Error in operation: ${err.message}`);
  } finally {
    await client.close();
  }
};

main();
