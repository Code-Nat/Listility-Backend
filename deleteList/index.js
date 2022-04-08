const mongoDB = require("../shared/mongo");
const auth = require("../shared/auth");

module.exports = async function (context, req) {
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

    const listId = (req.query.listid || (req.body && req.body.listid));


    /*if (!listId)
        listId = {listID};
    */
    if (!listId)
    {
        context.res = {
            status:400,
            body: "Missing list ID"
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
            context.res = {
                status:400,
                body: "No list with this ID was found "
            };
            return;
        }

        context.res = {
            status:204,
            body: ""
        };
    }
    catch (err) {
        context.log (`error to delete list: ${err}`)
        context.res = {
            status: 500,
            body: err.message
        }
    }
}