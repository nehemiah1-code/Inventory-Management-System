import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true,
    }, 
    quantity: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    payment_method:{ 
       type: String, 
       enum: ['Cash', 'Bank Transfer', 'USSD'], 
       default: 'Bank Transfer', 
       required: true
    },    
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    orderDate: {
        type: Date,
        default: Date.now,
    }
});

const OderModel = mongoose.model('Order', orderSchema);
export default OderModel;