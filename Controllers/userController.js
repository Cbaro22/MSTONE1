const User = require("../models/userModel")
const bcrypt  = require("bcryptjs")
const jwt =  require("jsonwebtoken")
const forgotPasswordMail = require("../sendMail")
const handleOrderUpdate = require("../Controllers/orderController")

const getAllUsers = async (req, resp)=>{
    try {

        console.log(req.User)
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

const handleLogin = async (req, resp) =>{
    try{const {email, password} = req.body

    const registeredUser = await User.findOne({email})
    if(!registeredUser){
        return resp.status(400).json({message:"User not Registered"})
    }

    const isMatch = await bcrypt.compare(password, registeredUser?.password)
     if(!isMatch){
        return resp.status(400).json({message:"incorrect email or password"})
     }

     const accessToken = jwt.sign(
        {id:registeredUser?._id},
        process.env.ACCESS_TOKEN,
        {expiresIn: "3h"}
    )

    const refreshToken = jwt.sign(
        {id:registeredUser?._id},
        process.env.REFRESH_TOKEN,
        {expiresIn:"7d"}
    )

    resp.status(200).json({
        message:"Login Successful",
        accessToken,
        refreshToken,
        registeredUser:{
            email:registeredUser?.email,
            password:registeredUser?.password,
            firstName:registeredUser?.firstName,
            lastName:registeredUser?.lastName,
             role:registeredUser?.role,
             state:registeredUser?.state,
             lga:registeredUser?.lga

        }

    })
} catch (error){
    resp.status(500).json({
            message:error.message
        })}
    }

const handleForgotPassword = async (req, resp) =>{
    const {email} = req.body;

    const user = await User.findOne({email})

    if(!user){
        return resp.status(404).json({message:"User account not found"})
    }

    accessToken = await jwt.sign(
        {user},
        `${process.env.ACCESS_TOKEN}`,
        {expiresIn: "5m"}

    )

    await forgotPasswordMail(email, accessToken)
    //send OTP

    resp.status(200).json({
        message:"Please check your email"
    })
}

const handleResetPassword = async (req, resp) =>{
    const {email, password} = req.body

    const user = await User.findOne({email: req.User.email})

    if(!user){
        return resp.status(404).json({message:"user account not found"})
    }

    const hashedPassword =await bcrypt.hash(password, 14)

    user.password = hashedPassword

    await user.save()
     
    resp.status(200).json({message:"password reset successful"})
}
 

module.exports = {
    getAllUsers,
    handleLogin,
    handleForgotPassword,
    handleResetPassword
}