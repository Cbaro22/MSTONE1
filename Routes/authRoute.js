const express = require("express")
const { handleLogin, handleForgotPassword, handleResetPassword, getAllUsers } = require("../Controllers/userController")
const register = require("../Controllers/authController")
const { validateRegister, auth } = require("../Middlewares/authindex")
const { getProduct, proddetails, addProducts } = require("../Controllers/productController")
const orderItems = require("../Controllers/orderController")
const addCategory = require("../Controllers/cateController")
const handleOrderUpdate = require("../Controllers/orderController")

const router = express.Router()

router.post('/login',handleLogin )
router.post('/registration',validateRegister, register)
router.post('/forgot-password',handleForgotPassword )
router.patch('/reset-password', auth, handleResetPassword)
router.get('/get-products', getProduct)
router.get('/product-details', proddetails)
router.post('/add-product', addProducts)
router.post('/add-category', addCategory)
router.get('/all-Users',auth, getAllUsers)



module.exports = router
