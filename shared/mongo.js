/**
 * Arquivo: mongo.js
 * Data: 01/25/2021
 * Descrição: file responsible for handling the database connection locally
 * Author: Glaucia Lemos – (Twitter: @glaucia_lemos86)
 */

 const { MongoClient } = require("mongodb");

 const config = {
   url: Environment.GetEnvironmentVariable("mongoDB/address"),
   dbName: Environment.GetEnvironmentVariable("collectionName")
 };
 
 async function createConnection() {
   const connection = await MongoClient.connect(config.url, {
     useNewUrlParser: true
   });
   const db = connection.db(config.dbName);
   return {
     connection,
     db
   };
 }
 
 module.exports = createConnection;