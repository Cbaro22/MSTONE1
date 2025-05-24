const mongoose = require("mongoose")
 
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [productSchema],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }

})

const Order = new mongoose.model("Order", orderSchema)

module.exports = Order