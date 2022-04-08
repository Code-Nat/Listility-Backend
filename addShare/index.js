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
    const userEmail = (req.query.userEmail || (req.body && req.body.userEmail));
    let isEdit = (req.query.isEdit || (req.body && req.body.isEdit));

    if (!userEmail)
    {
        context.res = {
            status:400,
            body: "Missing user email"
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
        
        let user = await DB.user.findOne({email:userEmail});

        if (!user)
            throw Error("The user with such email dose not exsist")

        result.addShare({
            userId:user._id,
            isEdit:isEdit
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
        context.log(err);
        context.res = {
            status:400,
            body: err.message
        };
        return;
    }
}