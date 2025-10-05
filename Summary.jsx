import axios from "axios";
import React, { useEffect, useState } from "react";

const Summary = () =>{
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalStock: 0,
        ordersToday: 0,
        revenue: 0,
        outOfStock: [],
        highestSaleProduct: null,
        lowStock: [],
    })
    const [loading, setLoading] = useState(false);
    //To fetch the data from the DB
    const fetchDashboardData = async () =>{
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/api/dashboard", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("inventory-token")}`
                }
            });
           // console.log(response.data.dashboardData);
            setDashboardData(response.data.dashboardData);
        } catch (error) {
           alert(error.message);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-3">
            <h1 className="text-3xl font-bold ">DASHBOARD</h1>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
                <p className="text-lg font-semibold">Total Products</p>
                <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
                <p className="text-lg font-semibold">Total stock</p>
                <p className="text-2xl font-bold">{dashboardData.totalStock}</p>
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
                <p className="text-lg font-semibold">Orders Today</p>
                <p className="text-2xl font-bold">{dashboardData.ordersToday}</p>
            </div>
            <div className="bg-orange-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
                <p className="text-lg font-semibold">Revenue</p>
                <p className="text-2xl font-bold">#{dashboardData.revenue}</p>
            </div>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white p-4 rounded shadow-md">
               <h3 className="text-xl font-semibold shadow-md text-gray-800 mb-3">
                    Out of stock Products
               </h3>
               {dashboardData.outOfStock.length > 0 ? (
                <ul className="space-y-2">
                    {dashboardData.outOfStock.map((product, index) => (
                        <li key={index} className="text-gray-600">
                            {product.name}{" "}
                            <span className="text-gray-400">({product.category.name})</span>
                        </li>
                    ) )}
                </ul>
               ) : (
                <p className="text-gray-500">No products, out of stock</p>
               )}
             </div>

             <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-xl font-semibold shadow-md text-gray-800 mb-3">
               Highest Sale Products
             </h3>
             {dashboardData.highestSaleProduct?.name ? (
                <div className="text-gray-600">
                    <p><strong>Name:</strong> {dashboardData.highestSaleProduct.name}</p>
                    <p><strong>Category:</strong> {dashboardData.highestSaleProduct.category}</p>
                    <p><strong>Total units sold:</strong>{dashboardData.highestSaleProduct.totalQuantity}</p>
                </div>
             ) : (
                <p className="text-gray-500">{dashboardData.highestSaleProduct?.message || 'Loading...'}</p>
             )}
             </div>

             <div className="bg-white p-4 rounded shadow-md">
               <h3 className="text-xl font-semibold shadow-md text-gray-800 mb-3">
               Low Stock Products
               </h3>
               {dashboardData.lowStock?.length > 0 ? (
                <ul className="space-y-2">
                    {dashboardData.lowStock.map((product, index) => (
                        <li key={index} className="text-gray-600">
                            <strong>{product.name}</strong> - {product.stock} left{" "}
                            <span className="text-gray-400">{product.categoryId.categoryName}</span>
                        </li>
                    ))}
                </ul>
               ) : (
                <p className="text-gray-500">No low stock products.</p>
               )}
              </div> 
           
            </div>
        </div>
    )
}

export default Summary;