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

    const id = (req.query.id || (req.body && req.body.id));
    if (!id)
    {
        const responseMessage = {
            status:400,
            body: {
                err: "missing ID",
                msg:`the reqrest missing parmters`
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
                body:{
                    msg:"User with the ID was not found",
                    err:`no user with id ${userId} was found`
                }
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
            body: {
                err:err.message,
                msg:"There was an error with the reqrest"
            }
        };
    }
}