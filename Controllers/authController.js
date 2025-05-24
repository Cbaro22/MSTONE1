const forgotPasswordMail = require("../models/sendMail")
const User = require("../models/userModel")

const register = async (req, resp) =>{
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

     const hashedpwd = await bcrypt.hash(password, 14)
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
   
} 

module.exports = register




