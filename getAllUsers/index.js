const mongoDB = require("../shared/mongo");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));

    const { db, connection } = await createMongoClient();

    const Users = db.collection('users');

    await Users.find({id:1}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        context.res = {
            status:200,
            body: result
        };
        Users.clode();
    });

    /*const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        /*body: responseMessage
    };*/
}