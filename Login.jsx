import React, {useState} from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router';
import axios from 'axios';
// import bg from '../images/background.jpg';

const Login = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {login} = useAuth();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError(null);
        try{

            const response = await axios.post("http://localhost:3000/api/auth/login", {
               email, password});

               if(response.data.success){
                await login(response.data.user, response.data.token);
                //to check role
                if(response.data.user.role === "admin"){
                    navigate("/admin-dashboard");
                }else{
                    navigate("/customer-dashboard");
                }
               }else{
                  alert(response.data.message);
               }
        } catch(error){
            if(error.response){
              setError(error.response.data.message);
            }else{
                setError("An unexpected error occurred!");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center min-h-screen justify-center
        bg-gradient-to-b from-blue-200 from-30% to-gray-200 to 70% space-y-6">
           <h2><p className="text-3xl text-white font-bold mb-4">Welcome to SMN TECH Plc. Inventory Management System</p></h2>
            <div className="border border-gray-500 shadow-lg p-6 w-80 bg-white rounded">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                {error && (
                    <div className="big-red-200 text-red-700 p-2 mb-4 rounded">
                       {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input 
                        type="email"
                        className="w-full px-3 py-2 border"
                        name="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email" 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input 
                        type="password"
                        className="w-full px-3 py-2 border"
                        name="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password" 
                        />
                    </div>
                    <div className="mb-4">
                        <button type="submit"
                        className="w-full bg-orange-400 text-white py-2">
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="shadow-lg p-1 w-200 bg-white-200 rounded">
                
                <p className="text-1xl text-black font-semibold mb-2">Manage your stock efficiently, track sales, and monitor your business in real time.</p>
                <p className="text-1xl text-black font-semibold mb-2">Please log in to access your dashboard and keep your inventory up to date.</p>
                
            </div>

            <footer className="bg-black bg-opacity-70 text-white text-center p-4 w-full mt-auto">
              <p>&copy; 2025 SMN Tech Inventory Management System. All rights reserved.</p>
           </footer>

        </div>
    )
}

export default Login;