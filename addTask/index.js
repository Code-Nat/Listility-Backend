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
    const taskTitle = (req.query.taskTitle || (req.body && req.body.taskTitle));
    let isChecked = (req.query.isChecked || (req.body && req.body.isChecked));

    if (!taskTitle)
    {
        context.log.info ("Missing taskTitle for a new task opration canceled");
        context.res = {
            status:400,
            body: {
                err:"Missing taskTitle ID",
                msg:"Missing a title for the new task"
            }
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
            {
                context.log.info ("addTask no list found")
                context.res = {
                    status: 400,
                    body: {
                        err:`The list with id ${listId} was not found`,
                        msg:"Sorry there was an error finding the list"
                    }
                }
                return;
            }
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
        context.log.warn(err);
        context.res = {
            status:400,
            body: {
                msg:"There was an error with the reqrest",
                err:err.message
            }
        };
        return;
    }
}