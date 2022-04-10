const mongoDB = require("../shared/mongo");

module.exports = async function (context, req) {
    try
    {
        const { email, password } = req.body
        if (!email || !password) {
            throw new Error('Please provide all values')
        }

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
        context.res = {
            status:200,
            body:{ user, token }
        }
    }
    catch (err)
    {
        context.log (err);
        context.res = {
            status:400,
            body:{msg:err.message}
        }
    }
}