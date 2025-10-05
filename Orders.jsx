import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
        const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
                },
            });
            if(response.data.success) { 
                setOrders(response.data.orders);
           }else{
            console.error("Error fetching orders:", response.data.message);
            alert("Errror fetching orders. Please try again later")
           }
        } catch (error) {
            console.error("Error fetching orders:", error);
            console.log("Error in orders", error);
        }
    }

    useEffect(() =>{
        fetchOrders();
    }, []);


      return(
        <div className="w-full h-full flex flex-col gap-4 p-4">
          <h1 className="text-2xl font-bold">General Report of Orders</h1>
             <div>
                <table className='w-full border-collapse border boder-gray-300 mt-4'>
                    <thead>
                        <tr className='bg-gray-200'>
                            <th className='border border-gray-300 p-2'>S/No</th>
                            <th className='border border-gray-300 p-2'>Product Name</th>
                            <th className='border border-gray-300 p-2'>Category</th>
                            <th className='border border-gray-300 p-2'>Quantity</th>
                            <th className='border border-gray-300 p-2'>Total Price</th>
                            <th className='border border-gray-300 p-2'>Payment Method</th>
                            <th className='border border-gray-300 p-2'>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        { orders && orders.map((order, index) =>(
                            <tr key={(order._id)}>
                                <td className='border border-gray-300 p-2'>{index + 1}</td>
                                <td className='border border-gray-300 p-2'>{order.product.name}</td>
                                <td className='border border-gray-300 p-2'>{order.product.categoryId.categoryName}</td>
                                <td className='border border-gray-300 p-2'>
                                   {order.quantity}
                                </td>
                                <td className='border border-gray-300 p-2'>{order.totalPrice}</td>
                                <td className='border border-gray-300 p-2'>{order.payment_method}</td>   
                                <td className="border border-gray-300">{new Date(order.orderDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* {filteredOrders.length ===0 && <div>No Records</div> } */}
            </div>
         </div>   
    )
}

export default Orders;