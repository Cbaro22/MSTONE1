const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    productName:{type:String, require:true},
    productcategory:{type: mongoose.Schema.Types.ObjectId, ref: 'Category', require:true},
    prodescriptrion:{type:String, default:""},
    productPrice:{type:Number, require:true},
    prodQuantity:{ type: Number, required: true },
  
}, {timestamps: true})

const Product = new mongoose.model("Product", productSchema)

module.exports = Product