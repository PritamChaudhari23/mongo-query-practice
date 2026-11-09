const { MongoClient, ObjectId } = require("mongodb");

const connectToDatabase = async () => {
  await client.connect();
  console.log("Connected to MongoDB");
};

// DATABASE CONFIGURATION
const dbname = "bank";
const collection_name = "accounts";

// DATABASE CONNECTION
const client = new MongoClient(process.env.MONGODB_URI);

// COLLECTION
const database = client.db(dbname);
const accountsCollection = database.collection(collection_name);

// INSERT
const sampleAccount = {
  account_holder: "Linus Torvalds",
  account_id: "MDB829001337",
  account_type: "checking",
  balance: 50352434,
};

const sampleAccounts = [
  {
    account_id: "MDB011235813",
    account_holder: "Ada Lovelace",
    account_type: "checking",
    balance: 60218,
  },
  {
    account_id: "MDB829000001",
    account_holder: "Muhammad ibn Musa al-Khwarizmi",
    account_type: "savings",
    balance: 267914296,
  },
];

// FIND
const documentToFind = { _id: ObjectId("62a3638521a9ad028fdf77a3") };
const documentsToFind = { balance: { $gt: 4700 } };

// UPDATE
const documentToUpdate = { _id: ObjectId("62d6e04ecab6d8e130497482") };
const update = { $inc: { balance: 100 } };

const documentsToUpdate = { account_type: "checking" };
const update02 = { $push: { transfers_complete: "TR413308000" } };

// DELETE
const documentToDelete = { _id: ObjectId("62d6e04ecab6d8e13049749c") };
const documentsToDelete = { balance: { $lt: 500 } };

const main = async () => {
  try {
    await connectToDatabase();

    // INSERT ONE
    // const result = await accountsCollection.insertOne(sampleAccount);
    // console.log(`Inserted document: ${result.insertedId}`);

    // INSERT MANY
    // const result = await accountsCollection.insertMany(sampleAccounts);
    // console.log(`Inserted ${result.insertedCount} documents`);

    // FIND
    // const result = accountsCollection.find(documentsToFind);
    // const docCount = await accountsCollection.countDocuments(documentsToFind);
    // await result.forEach((doc) => console.log(doc));
    // console.log(`Found ${docCount} documents`);

    // FIND ONE
    // const result = await accountsCollection.findOne(documentToFind);
    // console.log("Found one document");
    // console.log(result);

    // UPDATE ONE
    // const result = await accountsCollection.updateOne(documentToUpdate, update);
    // console.log(
    //   result.modifiedCount === 1
    //     ? "Updated one document"
    //     : "No documents updated",
    // );

    // UPDATE MANY
    // const result = await accountsCollection.updateMany(documentsToUpdate, update02);
    // console.log(
    //   result.modifiedCount > 0
    //     ? `Updated ${result.modifiedCount} documents`
    //     : "No documents updated"
    // );

    // DELETE ONE
    // const result = await accountsCollection.deleteOne(documentToDelete);
    // console.log(
    //   result.deletedCount === 1
    //     ? "Deleted one document"
    //     : "No documents deleted"
    // );

    // DELETE MANY
    // const result = await accountsCollection.deleteMany(documentsToDelete);
    // console.log(
    //   result.deletedCount > 0
    //     ? `Deleted ${result.deletedCount} documents`
    //     : "No documents deleted"
    // );
  } catch (err) {
    console.error(`Error in operation: ${err}`);
  } finally {
    await client.close();
  }
};

main();

// -------------------------------------------------------------------------------------------------------------------------------
