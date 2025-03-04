import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../lib/axios"; // Ensure the correct path
import { logincontractor, logoutcontractor } from "../redux/contractorslice";

const useAuthCheck = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/contractor/check");
        if (res.status === 200) {
          dispatch(logincontractor(res.data));
        } else {
          dispatch(logoutcontractor());
        }
      } catch (error) {
        console.error("Authentication error:", error);
        dispatch(logoutcontractor());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  return { loading };
};

export default useAuthCheck;
