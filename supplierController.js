import Suppliers from '../model/Supplier.js';
import ProductModel from '../model/Product.js';


//API of Adding Supplier
const addSupplier = async (req, res) =>{
    try {
        const {name, email, phone, address } = req.body;

     //checking if supplier already exist
     const existingSupplier = await Suppliers.findOne({ name });
     if(existingSupplier){
        return res.status(400).json({ success: false, message: "Supplier already exists!"});
     }

     //create a new supplier
     const newSupplier = new Suppliers({
       name,
       email,
       phone,
       address
     });
    
     await newSupplier.save();
     return res.status(201).json({ success: true, message: 'Supplier added successfully'});
     }catch(error) {
       // console.error("Error addding supplier:", error);
        return res.status(500).json({ success: false, message: "server error"});
   m }
}

//API of Adding Supplier
const getSuppliers = async (req, res) =>{
    try {
        const suppliers = await Suppliers.find();
        return res.status(200).json({ success: true, suppliers });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        return res.status(500).json({ success: false, message: 'Serever error in getting suppliers'});
    }
}

//API for editing the categories
const updateSupplier = async (req, res) =>{
    try {
        const { id } = req.params;
        const { name, email, phone, address} = req.body;

        //check if supplier exist
        const existingSupplier = await Suppliers.findById(id);
        if(!existingSupplier){
            return res.status(404).json({ success: false, message: "Supplier not found"});
        }
        //update the category
        const updateSupplier = await Suppliers.findByIdAndUpdate(
            id,
            { name, email, phone, address},
            { new: true}
        );
        return res.status(200).json({ success: true, message: "Supplier updated successfully" });
    } catch (error) {
        console.error("Error updating supplier", error);
        return res.status(500).json({ success: false, message: "Sever error"});
    }
}

//API for deleting the supplier
const deleteSupplier = async(req, res) =>{
    try {
        const { id } = req.params;

        const productCount = await ProductModel.countDocuments({supplierId: id});
        
        if(productCount > 0) {
           return res.status(400).json({success: false, message: "Cannot delete supplier associated with product"});
        }

        //check if supplier exist 
        const existingSupplier = await Suppliers.findById(id);
        if(!existingSupplier){
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }

        await Suppliers.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Supplier deleted successfully" });
    } catch (error) {
        console.error("Error deleting supplier:", error);
        return res.status(500).json({ success: false, message: "Server Error"});
    }
}

export {addSupplier, getSuppliers, updateSupplier, deleteSupplier};