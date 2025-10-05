import bcrypt from 'bcrypt';
import User from './model/user.js';
import connectDB from './db/connection.js';

//Automatic admin account creation
const register = async() =>{
    try {
        connectDB();
        const hashPassword = await bcrypt.hash("admin", 10);
        const newUser = User({
            name: "admin",
            email: "admin@gmail.com",
            password: hashPassword,
            address: "admin_address",
            role: "admin" 
        })
        await newUser.save();
        console.log("Admin User Created successfully");
        
    } catch (error) {
        console.log(error);    
    }
}

register();