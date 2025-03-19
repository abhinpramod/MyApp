import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Contractors from "./pages/contractor.pages/Contractors";
import Stores from "./pages/Stores";
import About from "./pages/About";
import Loginuser from "./pages/Loginuser";
import Registeruser from "./pages/Registeruser";
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
import ContractorProfileforuser from "./pages/ContractorProfileforuser";

import { useSelector } from "react-redux";
function App() {
  const { loading } = useAuthCheckcontractor();
  const { loadinguser } = useAuthCheckuser();
  const { user } = useSelector((state) => state.user);
  const { contractor } = useSelector((state) => state.contractor);
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/loginuser"
            element={user && user ? <Navigate to="/" /> : <Loginuser />}
          />
          <Route
            path="/registeruser"
            element={user && user ? <Navigate to="/" /> : <Registeruser />}
          />
          <Route
            path="/contractors/contractors"
            element={user && user ? <Contractors /> : <Loginuser />}
          />
          <Route
            path="/contractor/registercontractorstep1"
            element={
              contractor && contractor.verified ? (
                <Contractordashboard />
              ) : (
                <RegisterContractorStep1 />
              )
            }
          />
          <Route
            path=" "
            element={
              contractor && contractor ? (
                <ContractorregisterStep2 />
              ) : (
                <RegisterContractorStep1 />
              )
            }
          />
          <Route
            path="/contractor/Logincontractors"
            element={
              contractor && contractor.verified ? (
                <Navigate to="/contractor/dashboard" />
              ) : (
                <Logincontractors />
              )
            }
          />
          <Route
            path="/contractor/contractorprofileforuser/:contractorId"
            element={
              user && user ? <ContractorProfileforuser /> : <Loginuser />
            }
          />

          {/* Contractor Dashboard Routes */}
          <Route
            path="/contractor"
            element={
              contractor && contractor.verified ? (
                <Contractordashboard />
              ) : (
                <Logincontractors />
              )
            }
          >
            {/* <Route path="contractorhome" element={contractor && contractor.verified ? <ContractorHome /> : <Logincontractors />} /> */}
            <Route
              path="ContractorProfile"
              element={
                contractor && contractor.verified ? (
                  <ContractorProfile />
                ) : (
                  <Logincontractors />
                )
              }
            />
            <Route
              path="project"
              element={
                contractor && contractor.verified ? (
                  <ContractorProject />
                ) : (
                  <Logincontractors />
                )
              }
            />
            <Route
              path="settings"
              element={
                contractor && contractor.verified ? (
                  <ContractorSettings />
                ) : (
                  <Logincontractors />
                )
              }
            />
            <Route
              path="dashboard"
              element={
                contractor && contractor.verified ? (
                  <Dashboard />
                ) : (
                  <Logincontractors />
                )
              }
            />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
