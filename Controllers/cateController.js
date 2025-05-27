const Category = require("../models/categoryModel")


const addCategory = async (req, resp)=>{
try {
     const {catName} = req.body

if(!catName){
    return resp.status(400).json({message:"Please add category"})
}

const existingCat = await Category.findOne({catName})

if(existingCat){
    return resp.status(400).json({message:"Category alraedy exist"})
}

const newCategory = new Category({catName})

await newCategory.save()

resp.status(201).json({
    message:"Category successfully added",
    newCategory:{catName}
})


} catch (error) {
    resp.status(500).json({
            message:error.message
        })
}
}
   

module.exports = addCategory