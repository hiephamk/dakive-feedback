import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useAccessToken from "../../../services/token";

const useCircle = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

   const [circles, setCircle] = useState([]);

  const fetchCircles = async () => {
    const url = import.meta.env.VITE_COMMUNITY_CIRCLES_LIST_URL;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.get(url, config);
      const filteMember = response.data.filter(member => member.owner === userInfo.id)
      setCircle(filteMember);
    } catch (error) {
      console.error("Error fetching circles:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCircles();
    }
  }, [accessToken, setCircle]);

  return {
    circles,
    fetchCircles,}
};

export default useCircle;

