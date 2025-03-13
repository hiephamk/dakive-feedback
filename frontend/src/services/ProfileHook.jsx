import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAccessToken from "../services/token";
import axios from "axios";


const useProfile = (userId) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccount = async () => {
    const url = import.meta.env.VITE_ACCOUNT_URL;
    console.log("url:", url);
  
    if (!accessToken) {
      setError("No access token available");
      return;
    }
  
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
  
    console.log("config:", config);
    console.log("userInfo:", userInfo?.id);
  
    setIsLoading(true);
    setError(null);
  
    try {
      const res = await axios.get(url, config);
      console.log("API Response Data:", res.data);
  
      if (Array.isArray(res.data) && res.data.length > 0) {
        const userProfile = res.data.find((profile) => profile.user === userId);
        console.log("profile.user:", userProfile)
        if (userProfile) {
          console.log("User Profile Found:", userProfile);
          setAccounts([userProfile]); // Wrapping it in an array to match rendering logic
        } else {
          console.error("User profile not found");
        }
      }
    } catch (error) {
      console.error("Cannot get account:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(()=> {
    if(accessToken && userInfo?.id) {
      fetchAccount()
    }
  },[accessToken, userInfo?.id])

  return {accounts, isLoading, error}
};

export default useProfile;
