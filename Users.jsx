import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () =>{
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "",
    });
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
  const fetchUsers = async () => {
        setLoading(false);
       try {
           const response = await axios.get("http://localhost:3000/api/users", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
           },
     });
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
      setLoading(false);
     } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
     }
   };

    useEffect( () =>{
    fetchUsers();
   }, []);

   const handleSearch = (e) => {
    setFilteredUsers(
      users.filter((user) => 
      user.name.toLowerCase().includes(e.target.value.toLowerCase()))
    )
   }

    const handleSubmit = async (e) =>{
        e.preventDefault();        
        const response = await axios.post(
          "http://localhost:3000/api/users/add",
           formData,
             {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
                },
             }
            );
        if (response.data.success){
          alert("User added successfully!");
          setFormData({
            name: "",
            email: "",
            password: "",
            address: "",
            role: "",
          });
          fetchUsers();
        }else{
            console.error("Error adding user:");
            alert("Error adding user, please try again!")
        }
      };

    const handleDelete = async (id) =>{
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if(confirmDelete ){
        try {
        const response = await axios.delete( `http://localhost:3000/api/users/${id}`, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("inventory-token")}`,
            },
        });
        if(response.data.success){
          alert("User deleted successfully!");
          fetchUsers(); //Refresh users list after deletion
        } else{
          console.error("Error deleting user:");
          alert("Error deleting a user. Please try again.");
        }
        } catch(error){
          console.error("Error deleting user:", error);
          alert("Error deleting user. Please try again.");
        }
      }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }) );
    };

    if(loading) return <div>Loading....</div>
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-8">USERS MANAGEMENT</h1>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="lg:w-1/3">
                  <div className="bg-orange-100 shadow-md rounded-lg p-4">
                    <h2 className="text-center text-xl font-bold mb-4">
                     Add User
                     </h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                          <input 
                            type="text" 
                            placeholder="Enter Name"
                            name="name"
                            className="border rounded p-2 w-full"
                            onChange={handleChange} 
                          />
                        </div>
                        <div>
                          <input 
                           type="email" 
                           placeholder="Enter Email"
                           name="email"
                           className="border w-full p-2 rounded-md"
                           onChange={handleChange} 
                          />
                        </div>
                        <div>
                          <input 
                           type="password" 
                           placeholder="Enter Password"
                           name="password"
                           className="border w-full p-2 rounded-md"
                           onChange={handleChange} 
                          />
                        </div>
                        <div>
                          <input 
                           type="text" 
                           placeholder="Enter Address"
                           name="address"
                           className="border w-full p-2 rounded-md"
                           onChange={handleChange} 
                          />
                        </div>
                        <div>
                          <select name="role" className="border w-full p-2 rounded-md"
                          onChange={handleChange}>
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="customer">Customer</option>
                          </select>
                        </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="w-1/3 rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600"
                          >
                           Add User
                        </button>
                      </div>
                    </form>
                   </div> 
                </div>  

                <div className="lg:w-2/3">
                <input type="text" placeholder="Search.." className="p-2 bg-gray-300 w-full mb-4 rounded" 
                onChange={handleSearch}/>
                  <div className="bg-white shadow-md rounded-lg p-4">
                      <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-200 p-2">S/No</th>
                          <th className="border border-gray-200 p-2">Name</th>
                          <th className="border border-gray-200 p-2">Email</th>
                          <th className="border border-gray-200 p-2">Address</th>
                          <th className="border border-gray-200 p-2">Role</th>
                          <th className="border border-gray-200 p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers && filteredUsers.map((user, index) =>(
                          <tr key={user._id}>
                            <td className="border border-gray-200 p-2">{index + 1}</td>
                            <td className="border border-gray-200 p-2">{user.name}</td>
                            <td className="border border-gray-200 p-2">{user.email}</td>
                            <td className="border border-gray-200 p-2">{user.address}</td>
                            <td className="border border-gray-200 p-2">{user.role}</td>
                            <td className="border border-gray-200 p-2">
                              <button className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                              onClick={ () => handleDelete(user._id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredUsers.length === 0 && <div>No Users Record</div> }
                  </div>
                </div>
            </div>

        </div>
    )
}

export default Users;