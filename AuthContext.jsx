import { createContext, useState, useContext } from "react";

const authContext = createContext();

export const AuthProvider = ({ children }) =>{
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("inventory-user");
        return storedUser ? JSON.parse(storedUser) : null;
    })

    const login = (userData, token) =>{
        setUser(userData);
        localStorage.setItem("inventory-user", JSON.stringify(userData));
        localStorage.setItem("inventory-token", token);
    }

    const logout = () =>{
        setUser(null);
        localStorage.removeItem("inventory-user");
        localStorage.removeItem("inventory-token")
    }
    return (
        <authContext.Provider value={{ user, login, logout}}>
            {children}
        </authContext.Provider>
    )
}
export const useAuth =() => useContext(authContext);
export default AuthProvider;