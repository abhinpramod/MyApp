import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Home, ArrowLeft } from "lucide-react";

const Navbar = ({login}) => {
    const navigate = useNavigate();
  
    return (
      <nav className="flex items-center justify-between p-4 shadow-md">
      <div className="flex items-center">
        <IconButton onClick={() => window.history.back()}>
          <ArrowLeft size={20} />
        </IconButton>
        <span className="ml-2 text-gray-700 text-lg sm:text-xl">Back</span>
      </div>
      <h1 className="text-slate-600 text-xl sm:text-5xl md:text-6xl lg:text-4xl font-bold text-center">LocalFinder</h1>
      <div className="hidden sm:block">

        {login ? <a href="/contractor/registercontractorstep1" className="text-gray-700 text-sm sm:text-base hover:underline">
          Register as Contractor
        </a> : <a href="/contractor/login" className="text-gray-700 text-sm sm:text-base hover:underline">
          Login
        </a>}
        
      </div>
    </nav>
    );
  };

  export default Navbar