const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");

module.exports = async function (context, req) {
    const userId = (req.query.userId || (req.body && req.body.userId));
    const isChecked = (req.query.isEdit || (req.body && req.body.isEdit));
    const listId = context.bindingData.listId;
    
    if (!userId)
    {
        context.res = {
            status:400,
            body: "Missing user Id"
        };
        return;
    }

    const connection = await mongoDB.connect();
    const list = await connection.model('lists',Schemas.list);

    try {
        result = await list.findById(listId);

        if (!result)
            throw Error("The list reqrested dose not exsist");

        result.updateTask({
            userId:userId,
            isChecked:isisEdit
        });

        result.save();

        context.res = {
            status:200,
            body: result
        };
    }
    catch (err)
    {
        context.log(err.message);
        context.res = {
            status:400,
            body: err.message
        };
    }
}