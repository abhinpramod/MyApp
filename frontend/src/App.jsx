import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Contractors from "./pages/Contractors";
import Stores from "./pages/Stores";
import About from "./pages/About";
import Loginuser from "./pages/Loginuser";
import Registeruser from "./pages/Registeruser";
import RegisterContractorStep1 from "./pages/Registercontractors1st";
import ContractorProfile from "./pages/contractorprofile";
import Logincontractors from "./pages/Logincontractors";
import { Toaster } from "react-hot-toast";
import ContractorregisterStep2 from "./pages/Registercontractors2nd";

function App() {
  return (
    <div>      <Toaster position="top-center" reverseOrder={false} />
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/contractors" element={<Contractors />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/about" element={<About />} />
        <Route path="/loginuser" element={<Loginuser />} />
        <Route path="/registeruser" element={<Registeruser />} />
        <Route path="/registercontractors1" element={<RegisterContractorStep1 />} />
        <Route path="/logincontractors" element={<Logincontractors />} />
        <Route path="/contractorregisterstep2" element={<ContractorregisterStep2 />} />
        <Route path="/ContractorProfile" element={<ContractorProfile/>}/>
        
      </Routes>
    </Router>
</div>
    
  );
}

export default App;
