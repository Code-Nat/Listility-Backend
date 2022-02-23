const createMongoClinet = require("../shared/mongo");

module.exports = async function (context, req) 
{
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    const { db, connection } = await createMongoClient();

    const Dishes = db.collection('users');
/*
    try 
    {
        const user = await Dishes.insert(dish);
        connection.close();
    
        context.res = {
          status: 201,
          body: dishes.ops[0]
        }
      } catch (error) {
        context.res = {
          status: 500,
          body: 'Error creating a new Dish'
        }
      }
    */
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}