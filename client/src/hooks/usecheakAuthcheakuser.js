import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../lib/axios"; // Ensure the correct path
import { loginuser, logoutuser } from "../redux/userslice";
import toast from "react-hot-toast";

const useAuthCheckuser = () => {
  const [loadinguser, setLoadinguser] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/user/check");
        console.log(res);
        if (res.status === 200) {
          dispatch(loginuser(res.data));
        } else {
          
          dispatch(logoutuser());
          axiosInstance.post("/user/logout");
        }
      } catch (error) {


        console.error("Authentication error:", error);

        if(error.response.status===403){
          toast.error(error.response.data.msg);
        }
        // toast.error(error.response.data.msg);
        axiosInstance.post("/user/logout");


        dispatch(logoutuser());
      } finally {
        setLoadinguser(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  return { loadinguser };
};

export default useAuthCheckuser;
