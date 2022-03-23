const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");
const mongoose = require('mongoose')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    /*const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
    */

    const listId = (req.query.listid || (req.body && req.body.listid));

    const connection = await mongoDB.connect();
    const list = await connection.model('lists',Schemas.list);

    context.res = await list.findByIdAndDelete(listId, function (err) {
        if(err) 
        {
            return context.res = {
                // status: 200, /* Defaults to 200 */
                status:404,
                body: err
            };
            //console.log(err);
        }
        else
        {
            return context.res = {
                // status: 200, /* Defaults to 200 */
                status:204,
                body: ""
            };
        }
        console.log("Successful deletion");
      });

    
}