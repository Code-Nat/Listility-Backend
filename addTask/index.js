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

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        let result = await DB.list.findOne(
            {
                _id:listId, 
                owningUser:userID
            })
        if (!result)
        {
            result = await DB.list.findOne(
            {
                _id:listId,
                shares:{_id:userID, isEdit:true}
            })

            
            if (!result)
                throw Error("The list reqrested dose not exsist");
        }

        result.addTask({
            taskTitle,
            isChecked
        });

        await result.save();

        context.res = {
            status:201,
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