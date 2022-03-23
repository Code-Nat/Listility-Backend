const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");

module.exports = async function (context, req) 
{

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

    const connection = await mongoDB.connect();
    const user = await connection.model('users',Schemas.user);

    const reply = await user.findById(id);
    console.log(reply);
    if (reply == null)
    {
        const responseMessage = {status: 404};
        context.res = responseMessage;
    }
    else
    {
        const responseMessage = {
            status:200,
            body: reply
        };
        context.res = responseMessage;
    }
}