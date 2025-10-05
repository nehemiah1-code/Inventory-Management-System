import Supplier from '../model/Supplier.js';
import Category from '../model/Category.js';
import Product from '../model/Product.js';

//API of Adding Product
const addProduct = async (req, res) =>{
    try {
        const {name, description, price, stock, categoryId, supplierId } = req.body;

     //create a new product
     const newProduct = new Product({
       name,
       description,
       price,
       stock,
       categoryId,
       supplierId
     });
    
     await newProduct.save();
     return res.status(201).json({ success: true, message: 'Product added successfully'});
     }catch(error) {
       console.error("Error addding product:", error);
        return res.status(500).json({ success: false, message: "server error"});
  }
}

//API for fetch Products
const getProducts = async (req, res) =>{
    try {
        const products = await Product.find({isDeleted: false}).populate('categoryId').populate('supplierId');
        const suppliers = await Supplier.find();
        const categories = await Category.find();
        return res.status(200).json({ success: true, products, suppliers, categories });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        return res.status(500).json({ success: false, message: 'Serever error in getting suppliers'});
    }
}

//API for editing the products
const updateProduct = async (req, res) =>{
    try {
        const { id } = req.params;
        const { name, description, price, stock, categoryId, supplierId} = req.body;

        //update the product
        const updatedProduct= await Product.findByIdAndUpdate(
            id,
            { name, description, price, stock, categoryId, supplierId },
            { new: true});
        
        if(!updatedProduct){
            return res.status(400).json({ success: false, message: "Product not found"})
        }
        return res.status(200).json({ success: true, message: "Product updated successfully", product: updateProduct });
    } catch (error) {
        console.error("Error updating product", error);
        return res.status(500).json({ success: false, message: "Sever error"});
    }
}

//API for deleting the product
const deleteProduct = async (req, res) =>{
    try {
        const { id } = req.params;
        //check if supplier exist 
        const existingProduct = await Product.findById(id);
        if(!existingProduct){
            return res.status(404).json({ success: false, message: "Product not found" });
        }
      if(existingProduct.isDeleted){
        return res.status(400).json({ success: false, message: "Product already deleted"});
      }
        await Product.findByIdAndUpdate(id, { isDeleted: true}, { new: true});

        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ success: false, message: "Server Error"});
    }
}


export {getProducts, addProduct, updateProduct, deleteProduct};