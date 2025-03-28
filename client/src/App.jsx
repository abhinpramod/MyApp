import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Contractors from "./pages/user.pages/Contractors";
import Stores from "./pages/Stores";
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
import ContractorNotifications from "./pages/contractor.pages/contractornotifications";
import UserProfile from "./pages/user.pages/Userprofile";
import InterestSentHistory from "./pages/user.pages/Interesthistory";
import StoreRegistration from "./pages/Store.pages/Storeregistration";
import StoreLoginPage from "./pages/Store.pages/StoreLogin";
import StoreLayout from "./pages/Store.pages/storeLayout";
import StoreDashboard from "./pages/Store.pages/storedashboard";
import AddProduct from "./pages/Store.pages/addproduct";
import StoreProfile from "./pages/Store.pages/storeprofile";
import Storesettings from "./pages/Store.pages/storesettings";
import Order from "./pages/Store.pages/order";
import Orderhistory from "./pages/Store.pages/orderhistory";
import { useSelector } from "react-redux";

function App() {
  const { loading } = useAuthCheckcontractor();
  const { loadingstore } = useAuthCheckstore();
  const { loadinguser } = useAuthCheckuser();
  const { user } = useSelector((state) => state.user);
  const { contractor } = useSelector((state) => state.contractor);
  const { store } = useSelector((state) => state.store);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/about" element={<About />} />
          
          {/* User Routes */}
          <Route path="/userprofile" element={user ? <UserProfile /> : <Loginuser />} />
          <Route path="/InterestSentHistory" element={user ? <InterestSentHistory /> : <Loginuser />} />
          <Route path="/loginuser" element={user ? <UserProfile /> : <Loginuser />} />
          <Route path="/registeruser" element={user ? <Navigate to="/" /> : <Registeruser />} />
          <Route path="/contractors" element={user ? <Contractors /> : <Loginuser />} />
          
          {/* Store Routes */}
          <Route path="/storeregistration" element={store ? <Navigate to="/" /> : <StoreRegistration />} />
          <Route path="/storeLogin" element={store ? <Navigate to="/" /> : <StoreLoginPage />} />
          
          {/* Contractor Auth Routes */}
          <Route path="/contractor/registercontractorstep2" element={contractor?.verified ? <Contractordashboard /> : <ContractorregisterStep2 />} />
          <Route path="/contractor/registercontractorstep1" element={contractor?.verified ? <Contractordashboard /> : <RegisterContractorStep1 />} />
          <Route path="/contractor/Logincontractors" element={contractor?.verified ? <Navigate to="/contractor/dashboard" /> : <Logincontractors />} />
          <Route path="/contractor/contractorprofileforuser/:contractorId" element={user ? <ContractorProfile /> : <Loginuser />} />
          
          {/* Contractor Dashboard Routes */}
          <Route path="/contractor" element={contractor?.verified ? <Contractordashboard /> : <Logincontractors />}>
            <Route path="ContractorProfile" element={contractor?.verified ? <ContractorProfile /> : <Logincontractors />} />
            <Route path="project" element={contractor?.verified ? <ContractorProject /> : <Logincontractors />} />
            <Route path="settings" element={contractor?.verified ? <ContractorSettings /> : <Logincontractors />} />
            <Route path="dashboard" element={contractor?.verified ? <Dashboard /> : <Logincontractors />} />
            <Route path="notifications" element={contractor?.verified ? <ContractorNotifications /> : <Logincontractors />} />
          </Route>

          <Route path="/store" element={ <StoreLayout /> }>
            <Route path="storeDashboard" element={ <StoreDashboard /> } />
            <Route path="addProduct" element={ <AddProduct /> } />
            <Route path="storeProfile" element={ <StoreProfile /> } />
            <Route path="storesettings" element={ <Storesettings /> } />
            <Route path="orders" element={ <Order /> } />
            <Route path="orderhistory" element={ <Orderhistory /> } />

          </Route>
          
          {/* Fallback Route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;