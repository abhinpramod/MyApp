import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import PaymentSuccess from "./components/PaymentSuccess ";
import Contractors from "./pages/user.pages/Contractors";
import Stores from "./pages/user.pages/Stores";
import About from "./pages/About";
import Loginuser from "./pages/user.pages/Loginuser";
import Registeruser from "./pages/user.pages/Registeruser";
import RegisterContractorStep1 from "./pages/contractor.pages/Registercontractors1st";
import ContractorProfile from "./pages/contractor.pages/contractorprofile";
import toast, { Toaster } from "react-hot-toast";
import ContractorregisterStep2 from "./pages/contractor.pages/Registercontractors2nd";
import Logincontractors from "./pages/contractor.pages/Logincontractors";
import Contractordashboard from "./pages/contractor.pages/contractorlayout";
import ContractorProject from "./pages/contractor.pages/contractorproject";
import ContractorSettings from "./pages/contractor.pages/contractorsettings";
import Dashboard from "./pages/contractor.pages/contractordashboard";
import useAuthCheckcontractor from "./hooks/usecheakAuthcontractor";
import useAuthCheckuser from "./hooks/usecheakAuthcheakuser";
import useAuthCheckstore from "./hooks/usecheakAuthstore";
import useAuthCheck from "./hooks/useAuthCheck";
import ContractorNotifications from "./pages/contractor.pages/contractornotifications";
import UserProfile from "./pages/user.pages/Userprofile";
import InterestSentHistory from "./pages/user.pages/Interesthistory";
import StoreRegistration from "./pages/Store.pages/Storeregistration";
import OrderConfirmation from "./pages/user.pages/orderconfirmation";
import StoreLoginPage from "./pages/Store.pages/StoreLogin";
import StoreLayout from "./pages/Store.pages/StoreLayout";
import StoreDashboard from "./pages/Store.pages/Storedashboard";
import AddProduct from "./pages/Store.pages/Addproduct";
import StoreProfile from "./pages/Store.pages/Storeprofile";
import Storesettings from "./pages/Store.pages/storesettings";
import Order from "./pages/Store.pages/Order";
import Orderhistory from "./pages/Store.pages/Orderhistory";
import Cart from "./pages/user.pages/cart";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";

function App() {
  // const { loading } = useAuthCheckcontractor();
  // const { loadingstore } = useAuthCheckstore();
  // const { loadinguser } = useAuthCheckuser();
  const { loading } = useAuthCheck();
  const { user } = useSelector((state) => state.user);
  const { contractor } = useSelector((state) => state.contractor);
  const { store } = useSelector((state) => state.store);

  // if (loading || loadingstore || loadinguser) {
  //   return <div className="flex items-center justify-center h-screen"><Loader className="animate-spin" /></div>;
  // }


  if(loading){
    return <div className="flex items-center justify-center h-screen"><Loader className="animate-spin" /></div>;
  }
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          {/* User Routes */}
<Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/userprofile" element={user ? <UserProfile /> : <Loginuser />} />
          <Route path="/InterestSentHistory" element={user ? <InterestSentHistory /> : <Loginuser />} />
          <Route path="/stores" element={user ? <Stores /> : <Loginuser />} />
          <Route path="/loginuser" element={user ? <Navigate to="/userprofile" /> : <Loginuser />} />
          <Route path="/registeruser" element={user ? <Navigate to="/" /> : <Registeruser />} />
          <Route path="/contractors" element={<Contractors />} />
          <Route path="/contractors/:JOBTYPE" element={ <Contractors /> } />
          <Route path="/contractor/contractorprofileforuser/:contractorId" element={user ? <ContractorProfile /> : <Loginuser />} />
          <Route path="/store/:storeId" element={user ? <StoreProfile/>: <Loginuser />} />
          <Route path="/cart" element={user ? <Cart/>: <Loginuser />} /> 
          <Route path="/orders" element={user ? <OrderConfirmation/>: <Loginuser />} /> 
          
          {/* Store Routes */}
          <Route path="/storeregistration" element={store ? <Navigate to="/store/storeDashboard" /> : <StoreRegistration />} />
          <Route path="/storeLogin" element={store ? <Navigate to="/store/storeDashboard" /> : <StoreLoginPage />} />
          
          {/* Contractor Auth Routes */}
          <Route path="/contractor/registercontractorstep2" element={contractor?.verified ? <Navigate to="/contractor/dashboard" /> : <ContractorregisterStep2 />} />
          <Route path="/contractor/registercontractorstep1" element={contractor?.verified ? <Navigate to="/contractor/dashboard" /> : <RegisterContractorStep1 />} />
          <Route path="/contractor/Logincontractors" element={contractor?.verified ? <Navigate to="/contractor/dashboard" /> : <Logincontractors />} />
          
          {/* Contractor Dashboard Routes */}
          <Route path="/contractor" element={contractor?.verified ? <Contractordashboard /> : <Navigate to="/contractor/Logincontractors" />}>
            <Route path="ContractorProfile" element={<ContractorProfile />} />
            <Route path="project" element={<ContractorProject />} />
            <Route path="settings" element={<ContractorSettings />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notifications" element={<ContractorNotifications />} />
          </Route>

          {/* Store Dashboard Routes */}
          <Route path="/store" element={store ? <StoreLayout /> : <StoreLoginPage />}>
            <Route path="storeDashboard" element={<StoreDashboard />} />
            <Route path="addproduct" element={<AddProduct />} />
            <Route path="storeprofile" element={<StoreProfile />} />
            <Route path="storesettings" element={<Storesettings />} />
            <Route path="orders" element={<Order />} />
            <Route path="orderhistory" element={<Orderhistory />} />
          </Route>
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;