import axios from 'axios';
import React, { useState, useEffect } from 'react';


const CustomerProducts = () =>{

        const [categories, setCategories] = useState([]);
        const [products, setProducts] = useState([]);
        const [filteredProducts, setFilteredProducts] = useState([]);
        const [openModal, setOpenModal] = useState(false);
        const [orderData, setOrderData] = useState({
            productId: "",
            quantity: 1,
            total: 0,
            stock: 0,
            price: 0,
            paymentMethod: "", //no default, customer must pick a method of payment of his/her choice
        });

        const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/product", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
                },
            });
            if(response.data.success) { 
            setProducts(response.data.products);
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

        const handleSearch = (e) =>{
           setFilteredProducts(
           products.filter((product) =>
           product.name.toLowerCase().includes(e.target.value.toLowerCase()))
        )
        }

         const handleChangeCategory = (e) => {
           setFilteredProducts(
           products.filter((product) => product.category._id === e.target.value)
            )
         }

         const handleOrderChange = (product) => {
            setOrderData((prev) => ({
                ...prev,
                productId: product._id,
                quantity: 1,
                total: product.price,
                stock: product.stock,
                price: product.price,
                paymentMethod: prev.paymentMethod || "",
            }));
            setOpenModal(true);
         }

         const closeModal = () =>{
            setOpenModal(false);
         }

         const handleSubmit = async (e) =>{
            e.preventDefault();
            console.log("Submitting orderData:", orderData); // Debug line
            if (!orderData.paymentMethod || orderData.paymentMethod === "") {
               alert("Please select a payment method");
                return;
            }

            try {
                const response = await axios.post("http://localhost:3000/api/orders/add", orderData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("inventory-token")}`
                    },
                });
                if(response.data.success){
                    setOpenModal(false);
                    setOrderData({
                        productId: "",
                        quantity: 1,
                        stock: 0,
                        total: 0,
                        price: 0,
                        paymentMethod: "", 
                    });
                    alert("Order placed successfully");
                }
            } catch (error) {
                console.log(error);
                alert("Error: " + (error.response?.data?.message || error.message || "Unknown errror"));
            }
         }

         const increaseQuantity = (e) =>{
            if(e.target.value > orderData.stock){
                alert("Not enough stock");
            }else {
                setOrderData((prev) => ({
                    ...prev,
                    quantity: parseInt(e.target.value),
                    total: parseInt(e.target.value) * parseInt(orderData.price)
                }))
              }
          }

    return (
        <div>
            <div className='py-4 px-6'>
                <h2 className='font-bold text-xl'>PRODUCTS</h2>
            </div>
            <div className='py-4 px-6 flex justify-between'>
                <div>
                    <select name="category" id="" className='bg-white border p-2 rounded'
                    onChange = {handleChangeCategory}>
                        {categories && categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.categoryName}
                         </option>
                        ))}
                    </select>
                </div>
                <div>
                <input 
                   type="text"
                   placeholder="Search.."
                   className="border p-1 bg-white rounded px-4"
                   onChange = {handleSearch}
               />
                </div>
              </div>
             <div>
                <table className='w-full border-collapse border boder-gray-300 mt-4'>
                    <thead>
                        <tr className='bg-gray-200'>
                            <th className='border border-gray-300 p-2'>S/No</th>
                            <th className='border border-gray-300 p-2'>Name</th>
                            <th className='border border-gray-300 p-2'>Category</th>
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
                                    <button 
                                    onClick={() => handleOrderChange(product)}
                                    className="px-4 py-1 bg-green-400 hover:bg-green-700 text-white rounded cursor-pointer mr-2">
                                        Order
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length ===0 && <div>No Records</div> }
              </div>

    {openModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-20">
           <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
                <h1 className="text-xl font-bold">Place Order</h1>
                <button 
                    className="absolute top-4 right-4 font-bold text-lg cursor-pointer"
                    onClick={closeModal}
                    >
                      X
                </button>
                 <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
                     <input 
                        type="number"
                        name="quantity"
                        value={orderData.quantity}
                        onChange={increaseQuantity}
                        min="1" 
                        placeholder="Increase Quantity"
                        className="border p-1 bg-white rounded px-4"
                    />

                    <p>{orderData.quantity * orderData.price}</p>

                    {/* ✅ Payment Method Select */}
             <label className="font-semibold">Payment Method</label>
              <select
                value={orderData.paymentMethod}
                onChange={(e) =>
                  setOrderData((prev) => ({
                    ...prev,
                    paymentMethod: e.target.value,
                  }))
                }
                className="border p-2 bg-white rounded"
              >
                <option value="">--payment method--</option>
                <option value="USSD">USSD</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>


                    <div className="flex space-x-2">
                         <button
                            type="submit"
                            className="w-2/3 rounded-md bg-green-400 text-white p-3 cursor-pointer hover:bg-green-600"
                         >
                            Order
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


export default CustomerProducts;