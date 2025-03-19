import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../lib/axios"; // Ensure the correct path
import { logincontractor, logoutcontractor } from "../redux/contractorslice";
import toast from "react-hot-toast";

const useAuthCheckcontractor = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/contractor/check");
        console.log(res);
        if (res.status === 200) {
          dispatch(logincontractor(res.data));
        } else {
          
          dispatch(logoutcontractor());
          axiosInstance.post("/contractor/logout");
        }
      } catch (error) {


        console.error("Authentication error:", error);

        if(error.response.status===403){
          toast.error(error.response.data.msg);
        }
        // toast.error(error.response.data.msg);
        axiosInstance.post("/contractor/logout");


        dispatch(logoutcontractor());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  return { loading };
};

export default useAuthCheckcontractor;
