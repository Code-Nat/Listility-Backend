const mongoDB = require("../shared/mongo");
const auth = require("../shared/auth");

module.exports = async function (context, req) {
    //Check auth
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

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        let result = await DB.list.findOne({
            _id:listId,
            owningUser:userID
        });

        if (!result)
        {
            result = await DB.list.findOne({
                _id:listId,
                "shares._id":userID
            });
            if (!result)
                throw Error ("The list reqrested dose not exsist");
        }

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
        context.log(err.message);
        context.res = {
            status:400,
            body: err.message
        };
        return;
    }
}