const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("./userModel")
const Product = require("./productModel")
const forgotPasswordMail = require("./sendMail")
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

app.patch('/reset-password', async (req, resp) =>{
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(!user){
        return resp.status(404).json({message:"user account not found"})
    }

    const hashedPassword =await bcrypt.hash(password, 12)

    user.password = hashedPassword

    await user.save()
     
    resp.status(200).json({message:"password reset successful"})
})

app.get('/get-products', async (req, resp)=>{
     
    const products = await Product.find()
     
    if(!product){
        return resp.status(404).json({message:"product not found"})
    }

    resp.status(200).json({message:"Product is Available"})
})

app.get('/product-details', async (req, resp)=>{
    const {productName} = req.body

    const product = await Product.findOne({productName});
    if (!product) return resp.status(404).json({ message: 'Product not found' });
    resp.json(product);
})

app.post('/order-items', async (req, resp) => {
  
    const { userId, items } = req.body;

    const enrichedItems = await Promise.all(items.map(async item => {
      const ordereditem = await Product.findOne({productName});
      if (!ordereditem){ 
      return resp.status(404).json({message:"item not found" })
    };
    }));

    const newOrder = new Order({ userId, items: enrichedItems });
    await newOrder.save();

    resp.status(201).json(newOrder);
  
});


