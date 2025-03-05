import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Contractors from "./pages/contractor.pages/Contractors";
import Stores from "./pages/Stores";
import About from "./pages/About";
import Loginuser from "./pages/Loginuser";
import Registeruser from "./pages/Registeruser";
import RegisterContractorStep1 from "./pages/contractor.pages/Registercontractors1st";
import ContractorProfile from "./pages/contractor.pages/contractorprofile";
import { Toaster } from "react-hot-toast";
import ContractorregisterStep2 from "./pages/contractor.pages/Registercontractors2nd";
import Logincontractors from "./pages/contractor.pages/Logincontractors";
import Contractordashboard from "./pages/contractor.pages/contractordashboard";
import ContractorHome from "./pages/contractor.pages/contractorhome";
import ContractorProject from "./pages/contractor.pages/contractorproject";
import ContractorSettings from "./pages/contractor.pages/contractorsettings";

function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/about" element={<About />} />
          <Route path="/loginuser" element={<Loginuser />} />
          <Route path="/registeruser" element={<Registeruser />} />
          <Route path="/contractors/contractors" element={<Contractors />} />
          <Route path="/contractor/registercontractorstep1" element={<RegisterContractorStep1 />} />
          <Route path="/contractor/registercontractorstep2" element={<ContractorregisterStep2 />} />
          <Route path="/contractor/Logincontractors" element={<Logincontractors />} />

          {/* Contractor Dashboard Routes */}
          <Route path="/contractor" element={<Contractordashboard />}>
            <Route path="contractorhome" element={<ContractorHome />} />
            <Route path="ContractorProfile" element={<ContractorProfile />} />
            <Route path="project" element={<ContractorProject />} />
            <Route path="settings" element={<ContractorSettings />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;               