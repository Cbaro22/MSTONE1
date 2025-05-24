const Product = require("../models/productModel")

const getProduct = async (req, resp)=>{
     
    const products = await Product.find()
     
    if(!products){
        return resp.status(404).json({message:"product not found"})
    }

    resp.status(200).json({message:"Product is Available"})
}

module.exports = getProduct

const proddetails  =async (req, resp)=>{
    const {productName} = req.body

    const product = await Product.findOne({productName});
    if (!product) return resp.status(404).json({ message: 'Product not found' });
    resp.json(product);
}
 
module.exports = proddetails