const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("./userModel")
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

app.post('/registration', async (req, resp) =>{
    try{
     const { firstName,lastName,email,password, role,state,lga} = req.body

     if(!email){
        return resp.status(400).json({ message:"please enter your email"})
     }

    if(!password){
        return resp.status(400).json({message:"Please enter password"})
    }

     const existingUser = await User.findOne({email})

     if(existingUser){
        return resp.status(400).json({message:"User already exist"})
     }

     if(password.length < 5){
        return resp.status(400).json({message:"Password should be a minimum of 6 characters"})
     }

     const hashedpwd = await bcryptjs.hash(password, 14)
     const newUser = new User({ firstName,lastName,email,password:hashedpwd, role,state,lga})
      await newUser.save()
      resp.status(201).json({
        message:"Account registration Successful",
        newUser: {firstName,lastName,email,password, role,state,lga}
      })
    } catch (error){
        resp.status(500).json({
            message:error.message
        })
    }
   
})

app.post('/login', async (req, resp) =>{
    const {email, password} = req.body

    const registeredUser = await User.findOne({email})
    if(!registeredUser){
        return resp.status(400).json({message:"User not Registered"})
    }

    const isMatch = await bcryptjs.compare(password, registeredUser?.password)
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

    })
})