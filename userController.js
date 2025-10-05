import User from '../model/user.js'
import bcrypt from 'bcrypt';

//API of Adding User
const addUser = async (req, res) =>{
    try {
        const { name, email, password, address, role } = req.body;

    //checking if user already exist
    const exUser = await User.findOne({ email });
    if(exUser){
        return res.status(400).json({ success: false, message: "User already exists!"});
    }
    
    const hashedPassword = await bcrypt.hash(password, 10); 
    //create a new user
    const newUser = new User({
       name,
       email,
       password: hashedPassword,
       address,
       role,
    });
    
    await newUser.save();
    return res.status(201).json({ success: true, message: 'User added successfully'});
    }catch(error) {
        console.error("Error addding user:", error);
        return res.status(500).json({ success: false, message: "server error"});
    }
}
//API for getting users
const getUsers = async (req, res) =>{
    try {
        const users = await User.find();
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ success: false, message: 'Serever error in getting users'});
    }
}

const getUser = async (req, res) =>{
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select('-password'); //exclude the password
        if(!user){
            return res.status(404).json({ sucess: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.eror("Error fetching user profile", error);
        return res.status(500).json({ success: false, message: "Server error in fetching user profile" });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.Id;
        const {name, email, address, password} = req.body;

        const updateData = {name, email, address};
        if(password && password.trim() !=='') {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const user = await User.findByIdAndUpdate(userId, updateData, {new: true}).select('-password');
        if(!user){
            return res.status(404).json({ success: false, message: "user not found" });
        }

        return res.status(200).json({ success: true, message: "Profile updated successfully", user});
    } catch (error) {
        console.error("Error updating profile");
        return res.staus(500).json({ success: false, message: "Server error in updating profile" });
    }
}

//API for deleting users
const deleteUser = async(req, res) =>{
    try {
        const { id } = req.params;

        //check if category exist first
        const exUser = await User.findById(id);
        if(!exUser){
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await User.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ success: false, message: "Server Error"});
    }
}


export {addUser, getUsers, deleteUser, getUser, updateUserProfile};