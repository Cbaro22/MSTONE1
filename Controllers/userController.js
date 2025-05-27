const User = require("../models/userModel")

const getAllUsers = async (req, resp)=>{
    try {
        const allUsers = await User.find()

        resp.status(200).json({
            Message:"User account found",
            allUsers
        })
    } catch (error) {
         resp.status(500).json({
            message:error.message
        })
    }

}

module.exports = getAllUsers