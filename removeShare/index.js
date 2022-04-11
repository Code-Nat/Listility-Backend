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
    const userId = (req.query.userId || (req.body && req.body.userId));

    if (!userId)
    {
        context.log.info (`Failed: removeShare reqrest from user ${userID} sent missing userId`);
        context.res = {
            status:400,
            body: {
                err:"Missing user ID",
                msg:"The reqrest was missing parmaters"
            }
        };
        return;
    }

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        const result = await DB.list.findOne({
            _id:listId, 
            owningUser:userID
        });

        if (!result)
        {
            context.log.info(`reqrest from user ${userID} failed on not finding list`);
            context.res = {
                status:403,
                body:{
                    err:`The list ${listId} reqrested was not found`,
                    msg:`The list reqrested was not found`
                }
            }
            return;
        }

        result.removeShare(userId);

        result.save();

        context.log.info (`remove share for user ${userId} by user ${userID} in list ${listId}`);

        context.res = {
            status:202,
            body: result
        };
        return;
    }
    catch (err)
    {
        context.log.warn(err.message);
        context.res = {
            status:400,
            body: {
                err:err.message,
                msg:"An error has ocured"
            }
        };
        return;
    }
}