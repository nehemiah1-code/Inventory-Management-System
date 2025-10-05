import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import Root from './security/Root.jsx'
import Login from './pages/Login.jsx'
import ProtectedRoutes from './security/ProtectedRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Categories from './components/Categories.jsx'
import Suppliers from './components/Suppliers.jsx'
import Products from './components/Products.jsx'
import Logout from './components/Logout.jsx'
import Users from './components/Users.jsx'
import CustomerProducts from './components/customerProducts.jsx'
import Orders from './components/Orders.jsx'
import Profile from './components/Profile.jsx'
import Summary from './components/Summary.jsx'

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element ={<Root /> } />
          <Route path="/admin-dashboard" element={<ProtectedRoutes requireRole={["admin"]}>
            <Dashboard />
            </ProtectedRoutes>} >
            <Route
              index 
              element={<Summary />}
            />
            <Route
              path="/admin-dashboard/categories"
              element={<Categories />}
            />
            <Route
              path="/admin-dashboard/products"
              element={<Products />}
            />
            <Route
              path="/admin-dashboard/suppliers"
              element={<Suppliers />}
            />
            <Route
              path="/admin-dashboard/users"
              element={<Users />}
            />
            <Route
              path="/admin-dashboard/orders"
              element={<Orders />}
            />
            <Route
              path="/admin-dashboard/profile"
              element={<Profile />}
            />
             <Route
              path="/admin-dashboard/logout"
             element={<Logout />}
            /> 
          </Route>
          <Route 
          path="/customer-dashboard" 
          element ={<Dashboard />}
          >
            <Route index element={<CustomerProducts />}></Route>
            <Route path="orders" element={<Orders />}></Route>
            <Route path="logout" element={<Logout />}></Route>
            <Route path="profile" element={<Profile />}></Route>
          </Route>

          <Route path="/login" element ={<Login />} />
          <Route path="/unauthorized" element = {<p className='font-bold text-3xl mt-20 ml-20'>Unauthorized!</p>} />         
        </Routes>
      </Router>
  )
}

export default App;