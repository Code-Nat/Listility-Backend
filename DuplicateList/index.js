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

    const listID = (req.query.listId || (req.body && req.body.listId));

    if (!listID)
    {
        context.res = {
            status:400,
            body: "Missing list ID"
        };
        return;
    }

    //const list_ID = new mongoose.Types.ObjectId(listID);

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        let result = await DB.list.findOne({
            _id:listID,
            owningUser:userID
        });

        if (!result)
            throw Error (`No list with such id was found`);

        result = await DB.list.create({
            listTitle: (`${result.listTitle} (Copy)`),
            dateCreated:new Date(),
            owningUser:userID,
            taskList:result.taskList
        });

        context.res = {
            status:200,
            body: result
        };
    }
    catch (err)
    {
        context.log (`error duplicating list: with listID=${listID} the error: ${err.message}`);
        context.res = {
            status:400,
            body: err.message
        };
        return;
    }
}