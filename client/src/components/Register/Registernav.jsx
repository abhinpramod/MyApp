import { useNavigate } from "react-router-dom";
import { IconButton, Button } from "@mui/material";
import { ArrowLeft } from "lucide-react";

const Navbar = ({ type, login }) => {
  const navigate = useNavigate();
  // Determine the paths and labels based on the `type` prop
  const getNavbarDetails = () => {
    switch (type) {
      case "store":
        return {
          registerPath: "/storeregistration",
          loginPath: "/storeLogin",
          registerLabel: "Register as Store",
          loginLabel: "Login as Store",
        };
      case "contractor":
        return {
          registerPath: "/contractor/registercontractorstep1",
          loginPath: "/contractor/Logincontractors",
          registerLabel: "Register as Contractor",
          loginLabel: "Login as Contractor",
        };
      default:
        return {
          registerPath: "/",
          loginPath: "/",
          registerLabel: "Register",
          loginLabel: "Login",
        };
    }
  };

  const { registerPath, loginPath, registerLabel, loginLabel } = getNavbarDetails();

  // Handle navigation for Register/Login buttons
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="flex items-center justify-between p-4 shadow-md">
      {/* Back Button */}
      <div className="flex items-center">
        <IconButton onClick={() => window.history.back()}>
          <ArrowLeft size={20} />
        </IconButton>
        <span className="ml-2 text-gray-700 text-lg sm:text-xl">Back</span>
      </div>

      {/* Logo or Title */}
      <button onClick={() => navigate("/")}> <h1 className="text-slate-600 text-xl sm:text-5xl md:text-6xl lg:text-4xl font-bold text-center">
        LocalFinder
      </h1></button>
     

      {/* Conditional Buttons for Register/Login */}
      <div className="hidden sm:block">
        {login === "login" ? (
          <Button
            onClick={() => handleNavigation(registerPath)}
            className="text-black text-sm sm:text-base hover:underline"
          >
            {registerLabel}
          </Button>
        ) : login === "register" ? (
          <Button
            onClick={() => handleNavigation(loginPath)}
            className="text-black text-sm sm:text-base hover:underline"
            sx={{color:"black"}}
          >
            {loginLabel}
          </Button>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;