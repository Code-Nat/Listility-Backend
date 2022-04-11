const mongoDB = require("../shared/mongo");
const auth = require("../shared/auth");

module.exports = async function (context, req) {
    let authToken;
    try {
        authToken = await auth (context);
    }
    catch (err)
    {
        context.log (err);
        context.res = {
            status: 401,
            body: {
                message:err.message
            }
        }
        return;
    }
    //Auth passed fill ID contiue code
    const userID = await authToken.userId;

    let taskTitle = (req.query.taskTitle || (req.body && req.body.taskTitle));
    let isChecked = (req.query.isChecked || (req.body && req.body.isChecked));
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

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        result = await DB.list.findOne({
            _id:listId,
            owningUser:userID
        });

        if (!result)
            throw Error("The list reqrested dose not exsist");

        if (!(true.toString().equals(isChecked) || false.toString().equals(isChecked)))
            isChecked = result.isChecked;
        if (!taskTitle)
            taskTitle = result.taskTitle;

        await result.updateTask({
            taskTitle:taskTitle,
            isChecked:isChecked,
            _id:taskId
        });

        await result.save();

        context.res = {
            status:200,
            body: result
        };
    }
    catch (err)
    {
        context.log(`Error in updateTask: ${err}`);
        context.res = {
            status:400,
            body: err.message
        };
    }

}