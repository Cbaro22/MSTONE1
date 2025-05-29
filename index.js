const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("./models/userModel")
const forgotPasswordMail = require("./sendMail")
const routes = require("./Routes")
dotenv.config()
const { body, validationResult } = require("express-validator")
app.use(express.json())

const PORT = process.env.PORT || 5000



mongoose.connect(process.env.MONGODB_URL)
.then(() =>{
    console.log("MongooseDB connected .....")

    app.listen(PORT,(req, res) => {
    console.log(`server is connect to port ${PORT}`)
})
})

app.use(routes)


