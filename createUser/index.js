const mongoDB = require("../shared/mongo");
const toDTO = require("../shared/DTO/userDTO");

module.exports = async function (context, req) {
    const name = (req.query.name || (req.body && req.body.name));
    const lastName = (req.query.lastname || (req.body && req.body.lastname));
    const email = (req.query.email || (req.body && req.body.email));
    const password = (req.query.password || (req.body && req.body.password));

    let result = "";

    //verify before creating user
    if (!name)
        result += "name is missing\n";
    if (!email)
        result += "email is missing\n";
    if (!password)
        result += "password is missing\n";

    if (result)
    {
        const responseMessage = {
            status:400,
            body: {
                reason: result
            }
        };
        context.res = responseMessage;
        return;
    }

    const DB = await mongoDB.models();  //Connect to DB and get models

    try {
        result = await DB.user.create({
            name: name,
            lastName:lastName,
            email:email,
            password:password,
            emailConfirm:false
        });

        context.res = {
            status:201,
            body: toDTO(result)
        };
    }
    catch (err)
    {
        context.log(err.message);
        context.res = {
            status:400,
            body: err.message
        };
    }
}