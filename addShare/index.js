const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");

module.exports = async function (context, req) {
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

    const connection = await mongoDB.connect();
    const list = await connection.model('lists',Schemas.list);
    const user = await connection.model('users', Schemas.user);

    try {
        const result = await list.findById(listId);
        if (!result)
            throw Error("The list reqrested dose not exsist");
        
        let userId = await user.findOne({email:userEmail});
        context.log(userId)
        userId = userId._id;
        if (!userId)
            throw Error("The user with such email dose not exsist")

        result.addShare({
            userId:userId,
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