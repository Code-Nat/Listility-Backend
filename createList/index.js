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

    const title = (req.query.listTitle || (req.body && req.body.listTitle));

    //check if ID exsist before procceding
    if (!title)
    {
        const responseMessage = {
            status:400,
            body: {
                reason: "missing title"
            }
        };
        context.res = responseMessage;
        return;
    }

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        result = await list.create({
            listTitle: title, 
            dateCreated:new Date(), 
            owningUser:userID
        });

        context.res = {
            status:201,
            body: result
        };
    }
    catch (err)
    {
        context.res = {
            status:400,
            body: err
        };
    }
}

