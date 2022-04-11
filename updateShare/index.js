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

    const shareUserId = (req.query.userId || (req.body && req.body.userId));
    const isEdit = (req.query.isEdit || (req.body && req.body.isEdit));
    const listId = context.bindingData.listId;
    
    if (!shareUserId)
    {
        context.res = {
            status:400,
            body: "Missing user Id"
        };
        return;
    }
    if (!isEdit)
    {
        context.res = {
            status:400,
            body:"Missing isEdit field"
        }
    }

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        result = await DB.list.findOne({
            _id:listId,
            owningUser:userID
        });

        if (!result)
            throw Error("The list requested dose not exsist");

        result = result.updateShare({
            userId:shareUserId,
            isEdit:isEdit
        });

        result.save();

        context.res = {
            status:202,
            body: result
        };
        return;
    }
    catch (err)
    {
        context.log(`Error on update share ${err}`);
        context.res = {
            status:400,
            body: err.message
        };
        return;
    }
}