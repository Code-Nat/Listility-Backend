const mongoDB = require("../shared/mongo");

module.exports = async function (context, req) {

    const { email, password } = req.body
    if (!email || !password) {
        context.res = {
            err:`not all valutes for login where provided`,
            msg:'Please provide all values'
        }
    }

    try
    {
        const DB = await mongoDB.models();  //Connect to DB and get models

        const user = await DB.user.findOne({ email }).select('+password')
        if (!user) {
            throw new Error('Invalid Credentials')
        }

        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) {
            throw new Error('Invalid Credentials')
        }
        const token = user.createJWT()
        user.password = undefined

        context.log.info (`user ${user._id} has login succesfully`);

        context.res = {
            status:200,
            body:{ user, token }
        }
    }
    catch (err)
    {
        if (err.code == "401")
        {
            context.res.info (`User try to login with ${email} and ${password} did not pass`);
            context.res = {
                status:401,
                body:{
                    err:err.message,
                    msg:err.message
                }
            }
            return;
        }

        context.log.warn (err);
        context.res = {
            status:400,
            body:{
                err:err.message,
                msg:"there was an error with the reqrest"
            }
        }
    }
}