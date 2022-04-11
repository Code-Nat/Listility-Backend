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
        context.log.warn (err);
        context.res = {
            status: 401,
            body: {
                err:err.response,
                msg:`Error with Auth`
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
        context.log.info (`failed: reqrest remove task from user ${userID} to remove task ${taskId} from list ${listId}`);
        context.res = {
            status:400,
            body: {
                err:"Missing taskId",
                msg:"The reqrest was missing parmters"
            }
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
            {
                context.log.info(`Failed remove task: user ${userID} reqrested remove task ${taskId} from ${listId}`);
                context.res = {
                    status:403,
                    body:{
                        err:`The list reqrested was not found`,
                        msg:`The list reqrested was not found`
                    }
                }
                return;
            }
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