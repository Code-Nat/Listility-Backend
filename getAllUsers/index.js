const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));

    /*const { db, connection } = await mongoDB();

    connection.Schema({
        name: String,
        email: String,
        password: String,
        lastName: String,
        location: String
      });

    const users = connection.model('listility_users', Schema);
      */
    const connection = await mongoDB.connect();
    const user = await connection.model('users',Schemas.user);
    const reply = await user.find();
        console.log(reply);
        const responseMessage = {
            status:200,
            body: reply
        };
        context.res = {
            body: responseMessage
        };

    /*const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
    */
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}