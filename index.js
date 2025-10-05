import express from 'express';
import cors from 'cors';
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
import categoryRoutes from './routes/category.js';
import supplierRoutes from './routes/supplier.js';
import productRoutes from './routes/product.js';
import userRoutes from './routes/user.js';
import orderRoutes from './routes/order.js';
import dashboardRouter from './routes/dashboard.js';

dotenv.config();

const app = express();
// Enable CORS for frontend (running on a different port, e.g., 5173)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

//Mount auth routes
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/product', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRouter);




const port = process.env.PORT;
app.listen(port, ()=>{
    connectDB();
    console.log(`Server Running on PORT ${port}`);
});