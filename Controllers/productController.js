const Category = require("../models/categoryModel")
const Product = require("../models/productModel")

const getProduct = async (req, resp)=>{
    try {
        const products = await Product.find()
     
    if(!products){
        return resp.status(404).json({message:"product not found"})
    }

    resp.status(200).json({message:"Product is Available"})
}
     catch (error) {
        resp.status(500).json({
            message:error.message
        })
    }
} 
    



    const proddetails  =async (req, resp)=>{
        try {
            const {productName} = req.body

    const product = await Product.findOne({productName});
    if (!product) return resp.status(404).json({ message: 'Product not found' });
    resp.json(product);
}
         catch (error) {
            resp.status(500).json({
            message:error.message
        })
        }
    }
 

      const addProducts = async (req, resp)=>{
       try {
    const {  productName, productcategory, prodescriptrion,productPrice, prodQuantity,user} = req.body
      
    const userId = req.user?._id
     
    const categoryExist = await Category.findById(productcategory)

    if(!categoryExist){
       return resp.status(400).json({Message:"category does not exist"})}
   // if(!productName){
       // return resp.status(400).json({message:"please fill field"}) }
    //if(!productcategory){
       // return  resp.status(400).json({message:"Enter category of item"})}
    //if(!productPrice){
    //return  resp.status(400).json({message:"Enter price"})}
    //if(!prodQuantity){
        //return  resp.status(400).json({message:"Enter quantity of item"}) }

   //const  existingProduct = await Product.findOne({productName})
    //if(existingProduct){
        //return resp.status(400).json({message:"Product already exist"})}
     

    const newProduct = new Product({
        productName, productcategory, prodescriptrion,productPrice, prodQuantity,user:userId
    })

    await newProduct.save()

    resp.status(201).json({
        message:"Product Successfully Added",
        newProduct:{ productName, productcategory, prodescriptrion,productPrice, prodQuantity,user}
    })
}

 catch (error) {
    resp.status(500).json({
            message:error.message
        })
}
    }

module.exports = {
    addProducts,
    proddetails,
    getProduct

}