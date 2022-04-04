const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const listId = context.bindingData.listId;
    const taskId = (req.query.taskId || (req.body && req.body.taskId));

    if (!taskId)
    {
        context.res = {
            status:400,
            body: "Missing taskId"
        };
        return;
    }

    const connection = await mongoDB.connect();
    const list = await connection.model('lists',Schemas.list);

    try {
        let result = await list.findById(listId);

        if (!result)
            throw Error ("The list reqrested dose not exsist");

        result.removeTask(taskId);

        result.save();

        context.res = {
            status:202,
            body: result
        };
        return;
    }
    catch (err)
    {
        console.log(err.message);
        context.res = {
            status:400,
            body: err.message
        };
        return;
    }
}