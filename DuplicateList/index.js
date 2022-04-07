const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");
const mongoose = require("mongoose");

module.exports = async function (context, req) {
    const listID = (req.query.listId || (req.body && req.body.listId));
    //const listTitle = (req.query.listTitle || (req.body && req.body.listTitle));

    if (!listID)
    {
        context.res = {
            status:400,
            body: "Missing list ID"
        };
        return;
    }

    userID = new mongoose.Types.ObjectId('623c79e8626d52f11c600b5c');

    const list_ID = new mongoose.Types.ObjectId(listID);

    const connection = await mongoDB.connect();
    const list = await connection.model('lists',Schemas.list);

    try {
        let result = await list.findOne({_id:list_ID,owningUser:userID});

        if (!result)
            throw Error (`No list with such id was found`);

        result = await list.create({
            listTitle: (`${result.listTitle} (Duplicate)`),
            dateCreated:new Date(), 
            owningUser:userID,
            taskList:result.taskList
        });

        context.res = {
            status:200,
            body: result
        };
    }
    catch (err)
    {
        context.log (`error duplicating list: with listID=${listID} the error: ${err.message}`);
        context.res = {
            status:400,
            body: err.message
        };
        return;
    }
}