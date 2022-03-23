const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");
const mongoose = require("mongoose");

module.exports = async function (context, req) {
    const title = (req.query.title || (req.body && req.body.title));

    //check if ID exsist before procceding
    if (!title)
    {
        const responseMessage = {
            status:400,
            body: {
                reason: "missing title"
            }
        };
        context.res = responseMessage;
        return;
    }

    const connection = await mongoDB.connect();
    const list = await connection.model('lists',Schemas.list);

    let userID = new mongoose.Types.ObjectId('6227983a17c55fc267eb0547');
    try {
        result = await list.create({
            listTitle: title, 
            dateCreated:new Date(), 
            owningUser:userID
        });

        context.res = {
            status:201,
            body: result
        };
    }
    catch (err)
    {
        context.res = {
            status:400,
            body: err
        };
    }
}

