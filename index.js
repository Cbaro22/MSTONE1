const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("./models/userModel")
const Product = require("../productModel")
const forgotPasswordMail = require("../sendMail")
const register = require("./Controllers/authController")
const getProduct = require("./Controllers/productController")
const proddetails = require("./Controllers/productController")
const orderItems = require("./Controllers/orderController")
dotenv.config()

app.use(express.json())

const PORT = process.env.PORT || 5000



mongoose.connect(process.env.MONGODB_URL)
.then(() =>{
    console.log("MongooseDB connected .....")

    app.listen(PORT,(req, res) => {
    console.log(`server is connect to port ${PORT}`)
})
})

app.post('/registration', register)

app.post('/login', async (req, resp) =>{
    const {email, password} = req.body

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
        {expiresIn: "5m"}
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

    })})

app.post('/forgot-password', async (req, resp) =>{
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
})

app.patch('/reset-password',async (req, resp) =>{
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(!user){
        return resp.status(404).json({message:"user account not found"})
    }

    const hashedPassword =await bcrypt.hash(password, 14)

    user.password = hashedPassword

    await user.save()
     
    resp.status(200).json({message:"password reset successful"})
}
 )

app.get('/get-products', getProduct)

app.get('/product-details', proddetails)

app.post('/order-items', orderItems);


