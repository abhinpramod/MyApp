import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Home } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
  
    return (
      <AppBar position="static" sx={{ bgcolor: "white", boxShadow: 3  }}>
        <Toolbar>
          
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#1e293b"  }}>
            Contractor Registration
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate("/")}
            startIcon={<Home size={24} color="#1e293b" />}
          />
        </Toolbar>
      </AppBar>
    );
  };

  export default Navbar