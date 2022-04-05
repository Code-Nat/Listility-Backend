const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");

module.exports = async function (context, req) {
    const listId = context.bindingData.listId;
    const userId = (req.query.userId || (req.body && req.body.userId));

    if (!userId)
    {
        context.res = {
            status:400,
            body: "Missing user ID"
        };
        return;
    }

    const connection = await mongoDB.connect();
    const list = await connection.model('lists',Schemas.list);

    try {
        let result = await list.findById(listId);

        if (!result)
            throw Error ("The list reqrested dose not exsist");

        result.removeShare(userId);

        result.save();

        context.res = {
            status:202,
            body: result
        };
        return;
    }
    catch (err)
    {
        context.log(err.message);
        context.res = {
            status:400,
            body: err.message
        };
        return;
    }
}