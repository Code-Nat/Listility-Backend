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

    const shareUserId = (req.query.userId || (req.body && req.body.userId));
    const isEdit = (req.query.isEdit || (req.body && req.body.isEdit));
    const listId = context.bindingData.listId;
    
    if (!shareUserId)
    {
        context.log.info (`user ${userID} was missing isEdit on share update`);
        context.res = {
            status:400,
            body:{
                err:"Missing userId field",
                msg:"Missing parmters in the reqrest"
            }
        }
    }
    if (!isEdit)
    {
        context.log.info (`user ${userID} was missing isEdit on share update`);
        context.res = {
            status:400,
            body:{
                err:"Missing isEdit field",
                msg:"Missing parmters in the reqrest"
            }
        }
        return;
    }

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        result = await DB.list.findOne({
            _id:listId,
            owningUser:userID
        });

        if (!result)
        {
            context.log.info (`Failed: user ${userID} try to access ${listId} to update share of ${shareUserId}`);
            context.res = {
                status:403,
                body:{
                    err:`failed to find list`,
                    msg:`There was a problem access resources`
                }
            }
            return;
        }

        result = result.updateShare({
            userId:shareUserId,
            isEdit:isEdit
        });

        result.save();

        context.log.info(`share updated by user ${userID} in list ${listId} for user ${hareUserId}`);

        context.res = {
            status:202,
            body: result
        };
        return;
    }
    catch (err)
    {
        context.log.warn (`Error on update share ${err}`);
        context.res = {
            status:400,
            body: {
                err:err.message,
                msg:"There was an error with the reqrest"
            }
        };
        return;
    }
}