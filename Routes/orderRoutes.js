
const express = require("express")
const { orderItems, viewPastOrders } = require("../Controllers/orderController")
const handleOrderUpdate = require("../Controllers/orderController")
const router = express.Router()



router.post('/place-order',orderItems)
router.get('/past-order:userId',viewPastOrders)
router.put('/update-item',handleOrderUpdate)