const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");
const mongoose = require("mongoose");

module.exports = async function (context, req) {
    const listID = (req.query.listId || (req.body && req.body.listId));
    const listTitle = (req.query.listTitle || (req.body && req.body.listTitle));

    const connection = await mongoDB.connect();
    const list = await connection.model('lists',Schemas.list);

    userID = new mongoose.Types.ObjectId('623c79e8626d52f11c600b5c');

    const list_ID = new mongoose.Types.ObjectId(listID);

    try {
        result = await list.findOneAndUpdate({_id:list_ID,owningUser:userID},{
            listTitle:listTitle
        });

        result = await list.find({_id:list_ID,owningUser:userID});

        context.res = {
            status:200,
            body: result
        };
    }
    catch (err)
    {
        context.log (`error updating list: with listID=${listID} and listTitle=${listTitle} the error: ${err.message}`);
        context.res = {
            status:400,
            body: err
        };
        return;
    }
}