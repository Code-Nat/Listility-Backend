const jwt = require('jsonwebtoken');

const verify = async function (jwtToken) {
        const secret = process.env["jwtSecret"];
        return await jwt.verify(jwtToken, secret, (err,decoded) => {
            if (err)
            {
                throw Error (err);
            }
            return decoded;
        });
}

module.exports = {verify}