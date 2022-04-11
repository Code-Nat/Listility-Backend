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
    const userEmail = (req.query.userEmail || (req.body && req.body.userEmail));
    let isEdit = (req.query.isEdit || (req.body && req.body.isEdit));

    if (!userEmail)
    {
        context.log.info ("add share missing email to share with");
        context.res = {
            status:400,
            body: {
                msg:"Missing user email",
                err:"And error reqrest missing paramters"
            }

        };
        return;
    }
    if (!isEdit)
    {
        isEdit = false;
    }

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        const result = await DB.list.findOne({
            "_id":listId,
            "owningUser":userID
        });
        if (!result)
            throw Error("The list reqrested dose not exsist");
        
        const user = await DB.user.findOne({email:userEmail});

        if (!user)
            throw Error("The user with such email dose not exsist")

        result.addShare({
            userId:user._id,
            isEdit:isEdit
        });

        result.save();

        context.log.info (`New share added to list ${listId} for user ${user._id}`);

        context.res = {
            status:201,
            body: result
        };
        return;
    }
    catch (err)
    {
        context.log.warn(err);
        context.res = {
            status:400,
            body: {
                err:err.message,
                msg:"There was an error on creating share"
            } 
        };
        return;
    }
}