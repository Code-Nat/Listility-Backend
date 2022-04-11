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

    const listId = (req.query.listid || (req.body && req.body.listid));

    if (!listId)
    {
        context.log ("Delete list failed on missing list ID");
        context.res = {
            status:400,
            body: {
                err:"Missing list ID",
                msg:"Missing list ID"
            }
        };
        return;
    }


    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        const result = await DB.list.findOneAndDelete({
            _id:listId,
            owningUser:userID
        });

        if (!result)
        {
            context.log ()
            context.res = {
                status:400,
                body: {
                    err:`No list with the ID ${listId} was found`,
                    msg:"No list with this ID was found "
                }
            };
            return;
        }

        context.log.info (`list deleted: ${result}`);

        context.res = {
            status:204,
            body: ""
        };
    }
    catch (err) {
        context.log (`error to delete list: ${err}`)
        context.res = {
            status: 500,
            body: {
                err:err.message,
                msg:`Sorry something went wrong on the server side`
            }
        }
    }
}