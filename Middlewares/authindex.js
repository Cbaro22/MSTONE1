const jwt = require("jsonwebtoken")
const User = require("../models/userModel")


const validateRegister = async (req, resp,next)=>{
  const { firstName,lastName,email,password, role,state,lga} = req.body
 const errors =[]

 if(!email){
    errors.push("Please add Email")
 }
 if(!password){
    errors.push("Please add your password")
 }
 if(errors.length >0){
    return resp.status(400).json({message:errors})
 }

 next()

}

const auth = async (req, resp,next)=>{

    const token = req.header("Authorization")

    if(!token){
      return resp.status(401).json({message:"Please login!"})
    }

    const splitToken = token.split(" ")

    console.log(splitToken)

    const realToken = splitToken[1]
    console.log(realToken)

    const decodedToken = jwt.verify(realToken, `${process.env.ACCESS_TOKEN}`)

    if(!decodedToken){
      return resp.status(401).json({message:"Unauthorized User please login"})
    }

    const exUser = await User.findById(decodedToken.id)

    if(!exUser){
      return resp.status(404).json({Message:"User account does not exist"})
    }

    req.user = User

    next()
   

    
}

module.exports = {
    validateRegister,
    auth
}