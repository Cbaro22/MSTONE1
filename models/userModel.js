const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName:{type:String, default:""},
    lastName:{type:String, default:""},
    email:{type:String, require:true},
    password:{type:String, require:true},
    role:{type:String, default:"user"},
    state:{type:String, default:""},
    lga:{type:String, default:""}
}, {timestamps:true})

const User = new mongoose.model("User", userSchema)

module.exports = User
