import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../lib/axios"; // Ensure the correct path
import { loginstore, logoutstore } from "../redux/storeslice";
import toast from "react-hot-toast";

const useAuthCheckcontractor = () => {
  const [loadingstore, setLoadingstore] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/store/check");
        console.log(res);
        if (res.status === 200) {
          dispatch(loginstore(res.data));
        } else {
          
          dispatch(logoutstore());
          // axiosInstance.post("/store/logout");
        }
      } catch (error) {


        console.error("Authentication error:", error);

        if(error.response.status===403){
          toast.error(error.response.data.msg);
        }
        // toast.error(error.response.data.msg);
        // axiosInstance.post("/store/logout");


        dispatch(logoutstore());
      } finally {
        setLoadingstore(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  return { loading };
};

export default useAuthCheckstore;
