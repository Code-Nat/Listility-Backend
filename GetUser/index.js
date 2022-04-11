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

    const id = (req.query.id || (req.body && req.body.id));
    if (!id)
    {
        const responseMessage = {
            status:400,
            body: {
                reason: "missing ID"
            }
        };
        context.res = responseMessage;
        return;
    }

    const DB = await mongoDB.models();  //Connect to DB and get models
    try {
        const reply = await DB.user.findById(id);
        
        if (!reply)
        {
            context.res = {
                status: 400,
                body:"User with the ID was not found"
            };
            return;
        }
        context.res = {
            status:200,
            body: reply
        };
    }
    catch (err) {
        context.log (`Error getting user with ID ${id} from user ${userID} with error: ${err}`);
        context.res = {
            status:400,
            body: err.message
        };
    }
}