const mongoose = require('mongoose');

 const config = {
   uri: process.env["DBAddress"],
   dbName: process.env["DBName"]
 };
 
 let conn = null;
 
 exports.connect = async function() {
   if (conn == null) {
     conn = mongoose.connect(config.uri, {
       serverSelectionTimeoutMS: 5000
     }).then(() => mongoose);
     
     // `await`ing connection after assigning to the `conn` variable
     // to avoid multiple function calls creating new connections
     await conn;
   }
 
   return conn;
 };