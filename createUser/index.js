const mongoDB = require("../shared/mongo");
const Schemas = require("../shared/DBSchemas");
const mongoose = require('mongoose');
const userDTO = require("../shared/userDTO");
const toDTO = require("../shared/DTO/userDTO");

module.exports = async function (context, req) {
    const name = (req.query.name || (req.body && req.body.name));
    const lastName = (req.query.lastname || (req.body && req.body.lastname));
    const email = (req.query.email || (req.body && req.body.email));
    const password = (req.query.password || (req.body && req.body.password));

    let result = "";
    let issue = false;

    //verify before creating user
    if (!name)
    {
        reply += "name is missing\n";
        issue = true;
    }
    if (!email)
    {
        reply += "email is missing\n";
        issue = true;
    }
    if (!password)
    {
        reply += "password is missing\n";
        issue = true;
    }

    if (issue)
    {
        const responseMessage = {
            status:400,
            body: {
                reason: reply
            }
        };
        context.res = responseMessage;
        return;
    }

    const connection = await mongoDB.connect();
    const user = await connection.model('users',Schemas.user);

    try {
        result = await user.create({
            name: name,
            lastName:lastName,
            email:email,
            password:password
        });

        let UserDTO = toDTO(result);

        context.res = {
            status:201,
            body: toDTO(result)
        };
    }
    catch (err)
    {
        console.log(err.message);
        context.res = {
            status:400,
            body: err.message
        };
    }
}