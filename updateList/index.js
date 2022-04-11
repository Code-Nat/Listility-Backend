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
    const listTitle = (req.query.listTitle || (req.body && req.body.listTitle));

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        result = await DB.list.findOneAndUpdate({_id:listId,owningUser:userID},{
            listTitle:listTitle
        });

        result = await DB.list.find({_id:listId,owningUser:userID});

        context.log.info (`updated list ${listId} by user ${userID}`);
        
        context.res = {
            status:200,
            body: result
        };
    }
    catch (err)
    {
        context.log (`error updating list: with listId=${listId} and listTitle=${listTitle} the error: ${err.message}`);
        context.res = {
            status:400,
            body: {
                err:err.message,
                msg:"There was an error with the reqrest"
            }
        };
        return;
    }
}