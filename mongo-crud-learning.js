// const dbname = "bank";
// const collection_name = "accounts";

// const accountsCollection = client.db(dbname).collection(collection_name);

// const sampleAccount = {
//   account_holder: "Linus Torvalds",
//   account_id: "MDB829001337",
//   account_type: "checking",
//   balance: 50352434,
// };

// const main = async () => {
//   try {
//     await connectToDatabase();
//     // insertOne method is used here to insert the sampleAccount document
//     let result = await accountsCollection.insertOne(sampleAccount);
//     console.log(`Inserted document: ${result.insertedId}`);
//   } catch (err) {
//     console.error(`Error inserting document: ${err}`);
//   } finally {
//     await client.close();
//   }
// };

// main();

// const dbname = "bank";
// const collection_name = "accounts";

// const accountsCollection = client.db(dbname).collection(collection_name);

// const sampleAccounts = [
//   {
//     account_id: "MDB011235813",
//     account_holder: "Ada Lovelace",
//     account_type: "checking",
//     balance: 60218,
//   },
//   {
//     account_id: "MDB829000001",
//     account_holder: "Muhammad ibn Musa al-Khwarizmi",
//     account_type: "savings",
//     balance: 267914296,
//   },
// ];

// const main = async () => {
//   try {
//     await connectToDatabase();
//     let result = await accountsCollection.insertMany(sampleAccounts);
//     console.log(`Inserted ${result.insertedCount} documents`);
//     console.log(result);
//   } catch (err) {
//     console.error(`Error inserting documents: ${err}`);
//   } finally {
//     await client.close();
//   }
// };

// main();

// ---------------------------------------------------------------------------------------------------------------
// const dbname = "bank";
// const collection_name = "accounts";

// const accountsCollection = client.db(dbname).collection(collection_name);

// // Document used as a filter for the find() method
// const documentsToFind = { balance: { $gt: 4700 } };

// const main = async () => {
//   try {
//     await connectToDatabase();
//     // find() method is used here to find documents that match the filter
//     let result = accountsCollection.find(documentsToFind);
//     let docCount = accountsCollection.countDocuments(documentsToFind);
//     await result.forEach((doc) => console.log(doc));
//     console.log(`Found ${await docCount} documents`);
//   } catch (err) {
//     console.error(`Error finding documents: ${err}`);
//   } finally {
//     await client.close();
//   }
// };

// main();

// const dbname = "bank";
// const collection_name = "accounts";

// const accountsCollection = client.db(dbname).collection(collection_name);

// // Document used as a filter for the findOne() method
// const documentToFind = { _id: ObjectId("62a3638521a9ad028fdf77a3") };

// const main = async () => {
//   try {
//     await connectToDatabase();
//     // findOne() method is used here to find a the first document that matches the filter
//     let result = await accountsCollection.findOne(documentToFind);
//     console.log(`Found one document`);
//     console.log(result);
//   } catch (err) {
//     console.error(`Error finding document: ${err}`);
//   } finally {
//     await client.close();
//   }
// };

// main();

// ---------------------------------------------------------------------------------------------------------------
// const dbname = "bank";
// const collection_name = "accounts";

// const accountsCollection = client.db(dbname).collection(collection_name);

// const documentToUpdate = { _id: ObjectId("62d6e04ecab6d8e130497482") };

// const update = { $inc: { balance: 100 } };

// const main = async () => {
//   try {
//     await connectToDatabase();
//     let result = await accountsCollection.updateOne(documentToUpdate, update);
//     result.modifiedCount === 1
//       ? console.log("Updated one document")
//       : console.log("No documents updated");
//   } catch (err) {
//     console.error(`Error updating document: ${err}`);
//   } finally {
//     await client.close();
//   }
// };

// main();

// const database = client.db(dbname);
// const bank = database.collection(collection_name);

// const documentsToUpdate = { account_type: "checking" };

// const update = { $push: { transfers_complete: "TR413308000" } };

// const main = async () => {
//   try {
//     await connectToDatabase();
//     let result = await accountsCollection.updateMany(documentsToUpdate, update);
//     result.modifiedCount > 0
//       ? console.log(`Updated ${result.modifiedCount} documents`)
//       : console.log("No documents updated");
//   } catch (err) {
//     console.error(`Error updating documents: ${err}`);
//   } finally {
//     await client.close();
//   }
// };

// main();

// ---------------------------------------------------------------------------------------------------------------
// const dbname = "bank";
// const collection_name = "accounts";

// const accountsCollection = client.db(dbname).collection(collection_name);

// const documentToDelete = { _id: ObjectId("62d6e04ecab6d8e13049749c") };

// const main = async () => {
//   try {
//     await connectToDatabase();
//     let result = await accountsCollection.deleteOne(documentToDelete);
//     result.deletedCount === 1
//       ? console.log("Deleted one document")
//       : console.log("No documents deleted");
//   } catch (err) {
//     console.error(`Error deleting documents: ${err}`);
//   } finally {
//     await client.close();
//   }
// };

// main();

// const dbname = "bank";
// const collection_name = "accounts";

// const accountsCollection = client.db(dbname).collection(collection_name);

// const documentsToDelete = { balance: { $lt: 500 } };

// const main = async () => {
//   try {
//     await connectToDatabase();
//     let result = await accountsCollection.deleteMany(documentsToDelete);
//     result.deletedCount > 0
//       ? console.log(`Deleted ${result.deletedCount} documents`)
//       : console.log("No documents deleted");
//   } catch (err) {
//     console.error(`Error deleting documents: ${err}`);
//   } finally {
//     await client.close();
//   }
// };

// main();
// ---------------------------------------------------------------------------------------------------------------
// // 1. Create variables used in the transaction.
// // Collections
// const accounts = client.db("bank").collection("accounts");
// const transfers = client.db("bank").collection("transfers");

// // Account information
// let account_id_sender = "MDB574189300";
// let account_id_receiver = "MDB343652528";
// let transaction_amount = 100;

// // 2. Start a new session.
// const session = client.startSession();

// // 3. Begin a transaction with the WithTransaction() method on the session.
// const transactionResults = await session.withTransaction(async () => {
//   // Operations will go here
// });

// // 4. Update the balance field of the sender’s account by decrementing the transaction_amount from the balance field.
// const senderUpdate = await accounts.updateOne(
//   { account_id: account_id_sender },
//   { $inc: { balance: -transaction_amount } },
//   { session },
// );

// // 5. Update the balance field of the receiver’s account by incrementing the transaction_amount to the balance field.
// const receiverUpdate = await accounts.updateOne(
//   { account_id: account_id_receiver },
//   { $inc: { balance: transaction_amount } },
//   { session },
// );

// // 6. Create a transfer document and insert it into the transfers collection.
// const transfer = {
//   transfer_id: "TR21872187",
//   amount: 100,
//   from_account: account_id_sender,
//   to_account: account_id_receiver,
// };

// const insertTransferResults = await transfers.insertOne(transfer, { session });

// // 7. Update the transfers_complete array of the sender’s account by adding the transfer_id to the array.
// const updateSenderTransferResults = await accounts.updateOne(
//   { account_id: account_id_sender },
//   { $push: { transfers_complete: transfer.transfer_id } },
//   { session },
// );

// // 8. Update the transfers_complete array of the receiver’s account by adding the transfer_id to the array.
// const updateReceiverTransferResults = await accounts.updateOne(
//   { account_id: account_id_receiver },
//   { $push: { transfers_complete: transfer.transfer_id } },
//   { session },
// );

// // 9. Log a message regarding the success or failure of the transaction.
// if (transactionResults) {
//   console.log("Transaction completed successfully.");
// } else {
//   console.log("Transaction failed.");
// }

// // 10. Catch any errors and close the session.
// try {
// } catch (err) {
//   console.error(`Transaction aborted: ${err}`);
//   process.exit(1);
// } finally {
//   await session.endSession();
//   await client.close();
// }
