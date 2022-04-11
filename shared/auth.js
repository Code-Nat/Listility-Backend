const jwtUtil = require('./util/jwtUtil');

module.exports = async function (context) {
    try {
        const token = context.req.headers.authorization.split(' ')[1];
        return await jwtUtil.verify(token);
    }
    catch (err)
    {
        throw Error (err);
    }
}