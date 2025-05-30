const Order = require("../models/orderModel");
const Product = require("../models/productModel")
const handleOrderUpdate = ("../Controllers/orderController")

const orderItems = async (req, resp) => {
  try {
    const { userId, items} = req.body;

    const enrichedItems = await Promise.all(items.map(async item => {
      const orderedItem = await Product.findOne(items.productId);

     if (!orderedItem || orderedItem.stock < item.quantity) {
        return resp.status(400).json({ message: `Not enough stock for ${orderedItem?.productName || 'orderedItem'}` });
      }

      if (!orderedItem){ 
      return resp.status(404).json({message:"item not found" })
    };
    }));

    const newOrder = new Order({ userId, items: enrichedItems });
    await newOrder.save();

    

    resp.status(201).json({ message: 'Order placed', newOrder });
  } catch (error) {
     resp.status(500).json({
            message:error.message
        })
  }
  


          const handleOrderUpdate = async (req, resp)=>{
    try {
      const {id} = req.params

      const{userId,items} =req.body

     updated = await Order.findByIdAndUpdate(id,userId,items.productId, { $inc: { stock: -items.quantity } },{ new:true})

      if(!updated){

        return resp.status(400).json({Message:"Update  Unsuccessful"})
      }

      resp.status(201).json({
        Message:"Update Successful",
        updated,
       })
    }
    
     
     catch (error) {
      resp.status(500).json({
            message:error.message
        })
    }
          
  }
}

const viewPastOrders = async (req, resp)=>{
  try {
     const pastOrders = await Order.find({userId: req.params.userId})

  resp.status(200).json({
            Message:"Orders found",
            pastOrders
        })
  } catch (error) {
     resp.status(500).json({ error: err.message })
  }
 
}

     module.exports ={
      orderItems,
      handleOrderUpdate,
      viewPastOrders
      
    }