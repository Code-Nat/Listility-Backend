const mongoDB = require("../shared/mongo");
const toDTO = require("../shared/DTO/userDTO");
const VerifyEmailStarter = require("../VerifyEmailStarter");

module.exports = async function (context, req) {
    const name = (req.query.name || (req.body && req.body.name));
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
        let user = await DB.user.findOne({ email })
        if (result) {
            throw Error('Email already in use');
        }

        user = await DB.user.create({
            name: name,
            email:email,
            password:password,
            emailConfirm:verifyID
        });

        

        const token = user.createJWT();

        context.res = {
            status:201,
            body: {
                user: {
                    email: user.email,
                    name: user.name,
                },
                token
            }
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