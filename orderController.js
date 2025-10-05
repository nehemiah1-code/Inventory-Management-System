import Product from "../model/Product.js";
import Order from "../model/Order.js";
import mongoose from "mongoose";



const addOrder = async (req,res) => {
    try {
        const {productId, quantity, total, paymentMethod } = req.body;
        const userId = req.user._id;

            // Validate payment method
        const validMethods = ["USSD", "Bank_Transfer", "Cash"];
         if (!validMethods.includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: "Invalid payment method" });
         }
         // Example: Database or payment gateway logic
    if (paymentMethod === "bank_transfer") {
      // Process bank transfer
      console.log("Processing bank transfer");
      // ... logic
    } else if (paymentMethod === "ussd") {
      // Process USSD
      console.log("Processing USSD");
      // ... logic (is this implemented?)
    } else if (paymentMethod === "cash") {
      // Process cash
      console.log("Processing cash");
      // ... logic (is this implemented?)
    }

        // console.log("REQ BODY:", req.body);
        // console.log("PRODUCT ID RECEIVED:", req.body.productId);

        if (!productId || typeof productId !== 'string' || !mongoose.isValidObjectId(productId)) {
          return res.status(400).json({ message: 'Invalid product ID' });
         }
//check if product exist
        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({error: "Product not found in order"});
        }
//check stock
        if(quantity > product.stock){
            return res.status(404).json({error: " Not enough stock"});
        }else{
            product.stock -= parseInt(quantity);
            await product.save();
        }
//creating order
        const orderObj = new Order({
            customer: userId,
            product: productId,
            quantity,
            totalPrice: total,
            payment_method: paymentMethod,
        });
        await orderObj.save();

        return res.status(200).json({success: true, message: "Order placed successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, error: "error in placing order"});
    }
}

const getOrder = async (req, res) =>{
    try {
        const userId = req.user._id;
        let query = {};
        if(req.user.role === "customer"){
            query = {customer: userId};
        }
        const orders = await Order.find(query).populate({path: "product", populate: {
            path: "categoryId",
            select: "categoryName"
        }, select: "name price"}).populate("customer", "name email");
        return res.status(200).json({success: true, orders});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, error: "server error in fetching orders"});
    }
    
}

export {addOrder, getOrder}