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

    const listId = (req.query.listId || (req.body && req.body.listId));

    if (!listId)
    {
        context.res = {
            status:400,
            body: {
                msg:"Missing list ID",
                err:"Missing list ID"
            }
        };
        return;
    }

    //const list_ID = new mongoose.Types.ObjectId(listId);

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        let result = await DB.list.findOne({
            _id:listId,
            owningUser:userID
        });

        if (!result)
        {
            context.log.info (`DupList failed, no listId for ${listId} was found`)
            context.res = {
                err:`No list with id:${listId} was found`,
                msg:`There was an error with the reqrest`
            }
            return;
        }

        result = await DB.list.create({
            listTitle: (`${result.listTitle} (Copy)`),
            dateCreated:new Date(),
            owningUser:userID,
            taskList:result.taskList
        });

        context.log.info (`List ${listId} as duplicated to ${result._id}`);

        context.res = {
            status:200,
            body: result
        };
    }
    catch (err)
    {
        context.log (`error duplicating list: with listId=${listId} the error: ${err.message}`);
        context.res = {
            status:400,
            body: {
                err:err.message,
                msg:`Failed to duplicate list`
            }
        };
        return;
    }
}