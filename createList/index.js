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

    const title = (req.query.listTitle || (req.body && req.body.listTitle));

    //check if ID exsist before procceding
    if (!title)
    {
        context.log.info("createList call missing title");
        const responseMessage = {
            status:400,
            body: {
                err:"missing title for list",
                msg:"missing title for list"
            }
        };
        context.res = responseMessage;
        return;
    }

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        result = await DB.list.create({
            listTitle: title, 
            dateCreated:new Date(), 
            owningUser:userID
        });

        context.log.info (`new list ${listId} created for user ${userID}`)

        context.res = {
            status:201,
            body: result
        };
    }
    catch (err)
    {
        context.log.warn (err)
        context.res = {
            status:400,
            body: {
                err:err.message,
                msg:`There was an error in creating the list`
            }
        };
    }
}