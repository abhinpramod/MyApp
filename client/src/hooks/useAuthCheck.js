// useAuthCheck.js
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../lib/axios";
import { 
  loginuser, logoutuser,
  logincontractor, logoutcontractor,
  loginstore, logoutstore
} from "../redux"; // adjust paths as needed
import toast from "react-hot-toast";

const useAuthCheck = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        if (res.status === 200) {
          // Dispatch based on user type
          switch(res.data.userType) {
            case 'user':
              dispatch(loginuser(res.data.user));
              break;
            case 'contractor':
              dispatch(logincontractor(res.data.user));
              break;
            case 'store':
              dispatch(loginstore(res.data.user));
              break;
            default:
              throw new Error("Unknown user type");
          }
        } else {
          logoutAll();
        }
      } catch (error) {
        console.error("Authentication error:", error);

        if(error.response?.status === 403) {
          toast.error(error.response.data.msg);
        }
        
        logoutAll();
      } finally {
        setLoading(false);
      }
    };

    const logoutAll = () => {
      dispatch(logoutuser());
      dispatch(logoutcontractor());
      dispatch(loginstore());
      axiosInstance.post("/auth/logout"); // create a unified logout endpoint
    };

    checkAuth();
  }, [dispatch]);

  return { loading };
};

export default useAuthCheck;