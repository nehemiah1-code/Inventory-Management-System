import axios from "axios";
import React, { useEffect, useState } from "react";

const Products = () => {
    const [openModal, setOpenModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        supplierId: "",
    });
    
    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/product", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
                },
            });
            if(response.data.success) { 
            setProducts(response.data.products);
            setSuppliers(response.data.suppliers);
            setCategories(response.data.categories);
            setFilteredProducts(response.data.products);
           }else{
            console.error("Error fetching products:", response.data.message);
            alert("Errror fetching products. Please try again later")
           }
        } catch (error) {
            console.error("Error fetching products:", error);
            console.log("Error in fetching", error);
        }
    }

    useEffect(() =>{
        fetchProducts();
    }, []);

     const handleChange = (e) =>{
      const { name, value } = e.target;
       setFormData((prevData) => ({
          ...prevData,
           [name]: value,
        }));
     }
    
     const handleEdit = (product) =>{
         setOpenModal(true);
         setEditProduct(product._id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId._id,
            supplierId: product.supplierId._id,
        });
     }

    const handleDelete = async (id) =>{
      const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if(confirmDelete){
            try {
                const response = axios.delete(
                    `http://localhost:3000/api/product/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
                        },
                    }
                );
                if(response.data.success){
                    alert("Product deleted successfully");
                    fetchProducts();
                }else{
                   // console.error("Error deleting product.", data);
                   // alert("Error deleting product");
                }
            } catch (error) {
               // console.error("Error deleting product:", error);
               // alert("Error deleting product. Please try again later");
            }
        }
     }

     const closeModal = () =>{
        setOpenModal(false);
        setEditProduct(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
        })
     }

      const handleSubmit =  async (e) =>{
        e.preventDefault();

        if(editProduct){
          try {
         const response = await axios.post(
          `http://localhost:3000/api/product/${editProduct}`, 
            formData,
            {
                 headers: {
                 Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
                 },
            }
            );
            if(response.data.success){
                alert("Product added successfully");
                fetchProducts();
                setOpenModal(false);
                setEditProduct(null);
                setFormData({
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                    categoryId: "",
                    supplierId: "",
                });
            }else{
             alert("Error adding product. Please try again later!");
            }
        } catch (error) {
            alert("Error adding product. Please try again later!");    
        }
      }else{
               try {
            const response = await axios.post(
            "http://localhost:3000/api/product/add", 
               formData,
               {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
                }
               }
            );
            if(response.data.success){
                alert("Products added successfully");
                fetchProducts();
                setOpenModal(false);
                setFormData({
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                    categoryId: "",
                    supplierId: "",
                });
            }else{
                console.error("Error adding product");
                alert("Error adding product. Please try again later!");
            }
           } catch (error) {
            // console.error("Error adding product", error);
            alert("Error adding product. Please try again later!");
            console.log("Error adding product.", error.message);
          }
        }
     }

     const handleSearch = (e) =>{
        setFilteredProducts(
            products.filter((product) =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase()))
        )
     }

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Product Management</h1>
            <div className="flex justify-between items-center">
                <input 
                type="text"
                placeholder="Search.."
                className="border p-1 bg-white rounded px-4"
                 onChange = {handleSearch}
               />
               <button className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer"
               onClick={() => setOpenModal(true)}
               >
                Add Product
               </button>
            </div>

             <div>
                <table className='w-full border-collapse border boder-gray-300 mt-4'>
                    <thead>
                        <tr className='bg-gray-200'>
                            <th className='border border-gray-300 p-2'>S/No</th>
                            <th className='border border-gray-300 p-2'>Product Name</th>
                            <th className='border border-gray-300 p-2'>Category</th>
                            <th className='border border-gray-300 p-2'>Supplier</th>
                            <th className='border border-gray-300 p-2'>Price</th>
                            <th className='border border-gray-300 p-2'>Stock</th>
                            <th className='border border-gray-300 p-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { filteredProducts.map((product, index) =>(
                            <tr key={(product._id)}>
                                <td className='border border-gray-300 p-2'>{index + 1}</td>
                                <td className='border border-gray-300 p-2'>{product.name}</td>
                                <td className='border border-gray-300 p-2'>{product.categoryId.categoryName}</td>
                                <td className='border border-gray-300 p-2'>{product.supplierId.name}</td>
                                <td className='border border-gray-300 p-2'>
                                   {product.price}
                                </td>
                                <td className='border border-gray-300 p-2'>
                                   <span className="rounded-full font-semibold">
                                    {product.stock == 0 ? (
                                        <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full">{product.stock}</span>
                                    ) :product.stock < 5 ? (
                                        <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">{product.stock}</span>
                                    ) : ( <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full">{product.stock}</span> )}
                                   </span>
                                </td>
   
                                <td className="border border-gray-300">
                                    <button className="px-4 py-1 bg-blue-500 text-white rounded cursor-pointer mr-2"
                                      onClick = {() => handleEdit(product)}
                                    >
                                        Edit
                                    </button>
                                    <button className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
                                    onClick={() => handleDelete(product._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length ===0 && <div>No Records</div> }
              </div>

         {openModal && (
              <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
                <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
                    <h1 className="text-xl font-bold">Add Product</h1>
                    <button 
                    className="absolute top-4 right-4 font-bold text-lg cursor-pointer"
                    onClick={closeModal}
                    >
                      X
                    </button>
                    <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
                        <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange} 
                        placeholder="Product Name"
                        className="border p-1 bg-white rounded px-4"
                        />
                        <input 
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}  
                        placeholder="Description"
                        className="border p-1 bg-white rounded px-4"
                        />
                        <input 
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}  
                        placeholder="Enter Price"
                        className="border p-1 bg-white rounded px-4"
                        />
                        <input 
                        type="number"
                        name="stock"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}  
                        placeholder="Enter Stock"
                        className="border p-1 bg-white rounded px-4"
                        />

                        <div className="w-full border">
                            <select name="categoryId" 
                            value={formData.categoryId} 
                            onChange={handleChange} 
                            className="w-full p-2">
                               <option value="">Select Category</option>
                               {categories && categories.map((category) => (
                                  <option key={category._id} value={category._id}>
                                    {category.categoryName}
                                  </option>
                               ))}
                            </select>
                        </div>
                        <div className="w-full border">
                            <select name="supplierId" 
                             className="w-full p-2"
                             value={formData.supplierId}
                             onChange={handleChange}>
                               <option value="">Select Supplier</option>
                               {suppliers && suppliers.map((supplier) => (
                                  <option key={supplier._id} value={supplier._id}>
                                    {supplier.name}
                                  </option>
                               ))}
                            </select>
                        </div>

                        <div className="flex space-x-2">
                            <button
                            type="submit"
                            className="w-2/3 rounded-md bg-green-400 text-white p-3 cursor-pointer hover:bg-green-600"
                            >
                              {editProduct ? "Save Changes" : "Add Product"}
                            </button>
                            <button
                            type="button"
                            className="w-2/3 rounded-md bg-red-400 text-white p-3 cursor-pointer hover:bg-red-600"
                            onClick={closeModal}
                            >
                               Cancel
                            </button>
                        </div>
                    </form>
                </div>
             </div>
            )}

        </div>
    )
}

export default Products;