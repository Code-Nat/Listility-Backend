const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");

module.exports = async function (context, req) {
    const taskTitle = (req.query.taskTitle || (req.body && req.body.taskTitle));
    const isChecked = (req.query.isChecked || (req.body && req.body.isChecked));
    const taskId = (req.query.taskId || (req.body && req.body.taskId));
    const listId = context.bindingData.listId;
    
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
        result = await list.findById(listId);

        if (!result)
            throw Error("The list reqrested dose not exsist");

        result.updateTask({
            taskTitle:taskTitle,
            isChecked:isChecked,
            id:taskId
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