import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user.js';

//to handle the logins logic
const login = async (req, res) =>{
    try {
        const {email, password} = req.body;
        //console.log("Login Request:", {email, password});
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({success: false, message: "User not found!"});
        }
       // console.log("User Found:", user);
        
        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({success: false, message: "Invalid credentials"});
        }
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '600h'});
        return res.status(200).json({success: true, message: "Login successful", token, user: {id: user._id, name: user.name, email: user.email, role: user.role}});
    } catch (error) {
        //console.log("Login error:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export {login};