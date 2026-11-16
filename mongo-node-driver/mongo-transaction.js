const { MongoClient } = require("mongodb");

// DATABASE CONFIGURATION
const dbname = "bank";
const accounts_collection_name = "accounts";
const transfers_collection_name = "transfers";

// DATABASE CONNECTION
const client = new MongoClient(process.env.MONGODB_URI);

const connectToDatabase = async () => {
  await client.connect();
  console.log("Connected to MongoDB");
};

// COLLECTIONS
const database = client.db(dbname);
const accounts = database.collection(accounts_collection_name);
const transfers = database.collection(transfers_collection_name);

// TRANSACTION DETAILS
const account_id_sender = "MDB574189300";
const account_id_receiver = "MDB343652528";
const transaction_amount = 100;

const transfer = {
  transfer_id: "TR21872187",
  amount: transaction_amount,
  from_account: account_id_sender,
  to_account: account_id_receiver,
};

// MAIN
const main = async () => {
  const session = client.startSession();

  try {
    await connectToDatabase();

    // TRANSACTION
    const transactionResults = await session.withTransaction(async () => {
      // 1. UPDATE SENDER BALANCE
      const senderUpdate = await accounts.updateOne(
        {
          account_id: account_id_sender,
          balance: { $gte: transaction_amount },
        },
        {
          $inc: { balance: -transaction_amount },
        },
        { session },
      );

      if (senderUpdate.modifiedCount !== 1) {
        throw new Error("Sender not found or insufficient balance");
      }

      // 2. UPDATE RECEIVER BALANCE
      const receiverUpdate = await accounts.updateOne(
        { account_id: account_id_receiver },
        {
          $inc: { balance: transaction_amount },
        },
        { session },
      );

      if (receiverUpdate.modifiedCount !== 1) {
        throw new Error("Receiver account not found");
      }

      // 3. INSERT TRANSFER RECORD
      await transfers.insertOne(transfer, { session });

      // 4. UPDATE SENDER TRANSFER HISTORY
      await accounts.updateOne(
        { account_id: account_id_sender },
        {
          $push: { transfers_complete: transfer.transfer_id },
        },
        { session },
      );

      // 5. UPDATE RECEIVER TRANSFER HISTORY
      await accounts.updateOne(
        { account_id: account_id_receiver },
        {
          $push: { transfers_complete: transfer.transfer_id },
        },
        { session },
      );
    });

    // TRANSACTION RESULT
    if (transactionResults) {
      console.log("Transaction completed successfully.");
    } else {
      console.log("Transaction failed.");
    }
  } catch (err) {
    console.error(`Transaction aborted: ${err.message}`);
  } finally {
    await session.endSession();
    await client.close();
  }
};

main();
