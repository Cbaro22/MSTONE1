const User = require("../models/userModel")


const findUserService = async ()=>{
    const allUsers = await User.find()

    return allUsers
}

module.exports = {
    findUserService
}