const jwtUtil = require('./util/jwtUtil');

const auth = async function auth (context) {
    try {
        const token = context.req.headers.authorization.split(' ')[1];
        return await jwtUtil.verify(token);
    }
    catch (err)
    {
        throw Error (err);
    }
}

const authUserID = function authUserID (context) {
    return (await auth(context))._id;
}

module.exports = {
    auth,
    authUserID
}