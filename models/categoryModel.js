const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    catName:{type:String, require:true},
    
})

const Category = new mongoose.model("Category", categorySchema)

module.exports = Category