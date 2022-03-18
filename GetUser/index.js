const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");
const mongoose = require('mongoose')

module.exports = async function (context, req) 
{
    context.log('JavaScript HTTP trigger function processed a request.');

    const id = (req.query.id || (req.body && req.body.id));
    /*const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
    */

    const connection = await mongoDB.connect();
    const user = await connection.model('users',Schemas.user);

    const reply = await user.findById( id);
        console.log(reply);
        const responseMessage = {
            status:200,
            body: reply
        };
        context.res = {
            body: responseMessage
        };
    
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}