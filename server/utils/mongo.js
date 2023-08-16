/*
============================================
; Title:  app.js
; Author: Professor Krasso
; Modified By: Yakut Ahmedin
; Date:   14 Aug 2023
; Description: Database Connection
;===========================================
*/
"use strict";

const { MongoClient } = require("mongodb");

const MONGO_URL =
  "mongodb+srv://nodebucket_user:s3cret@cluster0.pbxmoid.mongodb.net/nodebucket?retryWrites=true&w=majority";

const mongo = async (operations, next) => {
  try {
    console.log("Connecting to MongoDB Atlas...");

    // Connect to MongoDB cluster
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // select the database
    const db = client.db("nodebucket");
    console.log("Connected to MongoDB Atlas");

    //Excute the operation
    await operations(db);
    console.log("operation was successful");

    // Exccute the operations
    client.close();
    console.log("Closing Connection to MongoDB Atlas...");
  } catch (err) {
    const error = new Error("Error connecting to db", err);
    err.status = 500;
    console.log("Error connecting to db", err);
    next(error);
  }
};

module.exports = { mongo };
