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

    let taskTitle = (req.query.taskTitle || (req.body && req.body.taskTitle));
    let isChecked = (req.query.isChecked || (req.body && req.body.isChecked));
    const taskId = (req.query.taskId || (req.body && req.body.taskId));
    const listId = context.bindingData.listId;
    
    if (!taskId)
    {
        context.log.info (`reqrest from user ${userID} to update task missing task ID`);
        context.res = {
            status:400,
            body: {
                err:"Missing taskId",
                msg:"Reqrest missing paramters"
            }
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
        {
            context.log.info (`Failed: user ${userID} try to access ${listId} to update task of ${taskId}`);
            context.res = {
                status:403,
                body:{
                    err:`failed to find list`,
                    msg:`There was a problem access resources`
                }
            }
        return;}

        if (!((true.toString() === isChecked.toString()) || (false.toString() === isChecked.toString())))
            isChecked = result.isChecked;
        if (!taskTitle)
            taskTitle = result.taskTitle;

        await result.updateTask({
            taskTitle:taskTitle,
            isChecked:isChecked,
            _id:taskId
        });

        context.log.info (`updated ${taskId} in list ${listId} by ${userID}`);

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
            body: {
                err:err.message,
                msg:"There was an  error with the reqrest"
            }
        };
    }

}