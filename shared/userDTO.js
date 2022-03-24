class userDTO
{
    static toDTO(user)
    {
        return {
        id:user._id,
        name:user.name,
        lastName:user.lastName,
        email:user.email
        }
    }
}

module.exports = {
    userDTO
};