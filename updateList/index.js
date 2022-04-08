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
    const listTitle = (req.query.listTitle || (req.body && req.body.listTitle));

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        result = await DB.list.findOneAndUpdate({_id:listID,owningUser:userID},{
            listTitle:listTitle
        });

        result = await DB.list.find({_id:listID,owningUser:userID});

        context.res = {
            status:200,
            body: result
        };
    }
    catch (err)
    {
        context.log (`error updating list: with listID=${listID} and listTitle=${listTitle} the error: ${err.message}`);
        context.res = {
            status:400,
            body: err.message
        };
        return;
    }
}