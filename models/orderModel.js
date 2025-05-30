const mongoose = require("mongoose")
 
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:  [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now }

})

const Order = new mongoose.model("Order", orderSchema)

module.exports = Order