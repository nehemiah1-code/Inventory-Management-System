import Category from '../model/Category.js';
import ProductModel from '../model/Product.js'

//API of Adding Category
const addCategory = async (req, res) =>{
    try {
        const {categoryName, categoryDescription } = req.body;

    //checking if category already exist
    const existingCategory = await Category.findOne({ categoryName });
    if(existingCategory){
        return res.status(400).json({ success: false, message: "Category already exists!"});
    }

    //create a new category
    const newCategory = new Category({
       categoryName,
       categoryDescription,
    });
    
    await newCategory.save();
    return res.status(201).json({ success: true, message: 'Category added successfully'});
    }catch(error) {
        console.error("Error addding category:", error);
        return res.status(500).json({ success: false, message: "server error"});
    }
}
//API for getting the categories
const getCategories = async (req, res) =>{
    try {
        const categories = await Category.find();
        return res.status(200).json({ success: true, categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ success: false, message: 'Serever error in getting categories'});
    }
}
//API for editing the categories
const updateCategory = async (req, res) =>{
    try {
        const { id } = req.params;
        const { categoryName, categoryDescription} = req.body;

        //check if category exist
        const existingCategory = await Category.findById(id);
        if(!existingCategory){
            return res.status(404).json({ success: false, message: "Category not found"});
        }
        //update the category
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { categoryName, categoryDescription },
            { new: true}
        );
        return res.status(200).json({ success: true, message: "Category updated successfully" });
    } catch (error) {
        console.error("Error updating category", error);
        return res.status(500).json({ success: false, message: "Sever error"});
    }
}
//API for deleting the categories
const deleteCategory = async(req, res) =>{
    try {
        const { id } = req.params;

        const productCount = await ProductModel.countDocuments({categoryId: id});
        
        if(productCount > 0) {
            return res.status(400).json({success: false, message: "Cannot delete category associated with product"});
        }

        //check i fcategory exist first
        const existingCategory = await Category.findById(id);
        if(!existingCategory){
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        await Category.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ success: false, message: "Server Error"});
    }
}

export {addCategory, getCategories, updateCategory, deleteCategory};