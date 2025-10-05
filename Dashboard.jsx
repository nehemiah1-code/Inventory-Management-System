import React from "react"
import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router"

const Dashboard = () => {
    return (
        <div>
            <div className='flex'>
                <Sidebar />

                <div className='flex-1 ml-16 md:ml-64 bg-gray-100 min-h-screen'>
                    <Outlet />
                </div>
            </div>

         <div className="flex flex-col min-h-screen">
           <footer className="fixed bottom-0 left-0 bg-black bg-opacity-70 position: fixed text-white text-center p-4 w-full mt-auto">
              <p>&copy; 2025 SMN Tech Inventory Management System. All rights reserved.</p>
           </footer>
         </div>
        </div>
    )
}

export default Dashboard