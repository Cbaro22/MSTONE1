const orderItems = async (req, resp) => {
  
    const { userId, items } = req.body;

    const enrichedItems = await Promise.all(items.map(async item => {
      const ordereditem = await Product.findOne({productName});
      if (!ordereditem){ 
      return resp.status(404).json({message:"item not found" })
    };
    }));

    const newOrder = new Order({ userId, items: enrichedItems });
    await newOrder.save();

    resp.status(201).json(newOrder);
  
}

     module.exports = orderItems