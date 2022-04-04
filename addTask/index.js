const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");

module.exports = async function (context, req) {
    const taskTitle = (req.query.taskTitle || (req.body && req.body.taskTitle));
    let isChecked = (req.query.isChecked || (req.body && req.body.isChecked));

    if (!taskTitle)
    {
        context.res = {
            status:400,
            body: "Missing taskTitle ID"
        };
        return;
    }
    if (!isChecked)
    {
        isChecked = false;
    }

    const connection = await mongoDB.connect();
    const list = await connection.model('lists',Schemas.list);

    try {
        let result = await list.findById(context.bindingData.listId);
        if (!result)
            throw Error("The list reqrested dose not exsist")

        result.addTask({
            taskTitle,
            isChecked
        });

        result.save();

        context.res = {
            status:201,
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