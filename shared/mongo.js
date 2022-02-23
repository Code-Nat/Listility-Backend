/**
 * Arquivo: mongo.js
 * Data: 01/25/2021
 * Descrição: file responsible for handling the database connection locally
 * Author: Glaucia Lemos – (Twitter: @glaucia_lemos86)
 */

 const MongoClient = require('mongoose');

 const config = {
   url: process.env["DBAddress"],
   dbName: process.env["DBName"]
 };
 
 async function createConnection() {
   const connection = await MongoClient.connect(process.env["DBAddress"]);
   //const db = connection.db(config.dbName);
   
  //const schema = connection.model('user', Schema);
   return {
     connection//,
     //db,
     //schema
   };
 }
 
 module.exports = createConnection;