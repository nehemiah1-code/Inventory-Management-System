import React, { useState, useEffect } from "react";
import axios from "axios";

const Categories = () =>{
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editCategory, setEditCategory] = useState(null);
    
  const fetchCategories = async () => {
        setLoading(true);
       try {
           const response = await fetch("http://localhost:3000/api/category", {
            method: "GET",
            headers: {
            Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
           },
     });
      const data = await response.json();
      console.log(data.categories);
      // Assuming the response has a `categories` property, update state
      setCategories(data.categories);
      setLoading(false);
     } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
     }
   };

    useEffect( () =>{
    fetchCategories();
   }, []);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(editCategory) {
          const response = await axios.put(
          `http://localhost:3000/api/category/${editCategory}`,
           { categoryName, categoryDescription }, 
             {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
                },
             }
            );
         if (response.data.success){
           setEditCategory(null);
           setCategoryName("");
           setCategoryDescription("");
           alert("Category updated successfully!");
           fetchCategories();
         }else{
            console.error("Error editing category:", data);
            alert("Error adding category, please try again!")
        }
    }else{          
        const response = await axios.post(
          "http://localhost:3000/api/category/add",
           { categoryName, categoryDescription }, 
             {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
                },
             }
            );
        if (response.data.success){
          setCategoryName("");
          setCategoryDescription("");
          alert("Category added successfully!");
          fetchCategories();
        }else{
            console.error("Error adding category:", data);
            alert("Error adding category, please try again!")
        }
      }
    };

    const handleDelete = async (id) =>{
      const confirmDelete = window.confirm("Are you sure you want tot delete this category?");
      if(confirmDelete ){
        try {
        const response = await axios.delete( `http://localhost:3000/api/category/${id}`, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
            },
        });
        if(response.data.success){
          alert("Category deleted successfully!");
          fetchCategories(); //Refresh category list after deletion
        } else{
          console.error("Error deleting category:", response.data);
          alert("Error deleting a category. Please try again.");
        }
        } catch(error){
          if(error.response){
            alert(error.response.data.message);
          }else{
            alert("Error deleting category. Please try again.");
          }
        }
      }
    } 

    const handleEdit = async (category) =>{
      setEditCategory(category._id);
      setCategoryName(category.categoryName);
      setCategoryDescription(category.categoryDescription);
    };
    const handleCancel = async () =>{
      setEditCategory(null);
      setCategoryName("");
      setCategoryDescription("");
    };

    if(loading) return <div>Loading....</div>
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-8">CATEGORY MANAGEMENT</h1>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="lg:w-1/3">
                  <div className="bg-orange-100 shadow-md rounded-lg p-4">
                    <h2 className="text-center text-xl font-bold mb-4">{ editCategory ? "Edit Category" : "Add Category"}</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                          <input 
                            type="text" 
                            placeholder="category name"
                            value={categoryName}
                            className="border rounded p-2 w-full"
                            onChange={(e) => setCategoryName(e.target.value)} 
                          />
                        </div>
                        <div>
                          <input 
                           type="text" 
                           placeholder="category description"
                           value={categoryDescription}
                           className="border w-full p-2 rounded-md"
                           onChange={(e) => setCategoryDescription(e.target.value)} 
                          />
                        </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="w-1/3 rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600"
                          >
                           {editCategory? "Save Changes" : "Add"}
                        </button>
                        {
                          editCategory && (
                            <button
                            type="button"
                            className="w-full mt-2 rounded-md bg-red-500 tect-white p-3 cursor-ponter hover:bg-red-600"
                            onClick = {handleCancel}
                            >
                              Cancel
                            </button>
                          )
                        }
                      </div>
                    </form>
                   </div> 
                </div>  

                <div className="lg:w-2/3">
                  <div className="bg-white shadow-md rounded-lg p-4">
                      <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-200 p-2">S/No</th>
                          <th className="border border-gray-200 p-2">Category Name</th>
                          <th className="border border-gray-200 p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category, index) =>(
                          <tr key={category._id}>
                            <td className="border border-gray-200 p-2">{index + 1}</td>
                            <td className="border border-gray-200 p-2">{category.categoryName}</td>
                            <td className="border border-gray-200 p-2">
                              <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mr-2"
                              onClick={() => handleEdit(category)}>
                                Edit
                              </button>
                              <button className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                              onClick={ () => handleDelete(category._id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
          
          {/* <div className="flex flex-col min-h-screen">
              <footer className="fixed bottom-0 left-0 bg-black bg-opacity-70 position: fixed text-white text-center p-4 w-full mt-auto">
              <p>&copy; 2025 SMN Tech Inventory Management System. All rights reserved.</p>
           </footer>
          </div> */}
        </div>
    )
}

export default Categories