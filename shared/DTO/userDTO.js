toDTO = function (user)
{
    return {
    _id:user._id,
    name:user.name,
    lastName:user.lastName,
    email:user.email
    }
}

module.exports = toDTO;