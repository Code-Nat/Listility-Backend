const mongoose = require('mongoose');
const Schema = require('../shared/DBSchemas')

 const config = {
   uri: process.env["DBAddress"],
   dbName: process.env["DBName"]
 };
 
 let conn = null;
 
 //exports.
 const connect = async function() {
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

 exports.models = async () => {
    const connection = await connect();
    const user = await connection.model ('user', Schema.user);
    const list = await connection.model('list', Schema.list);
    return {user, list};
}