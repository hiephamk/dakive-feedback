import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAccessToken from "../services/token";

const useUsers = (userId) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [Owner, setOwner] = useState(null); // Start as null (unknown)

  const userDetail = async () => {
    if (!accessToken || !userInfo?.id) return;
    try {
      const url = `http://127.0.0.1:8000/api/userdetails/${userId}/`;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.get(url, config);
      setOwner(res.data.is_owner);

    } catch (error) {
      console.error("Error fetching user:", error.response || error);
    }
  };

  useEffect(() => {
    if (accessToken && userId) {
      userDetail();
    }
  }, [accessToken, userId]);

  return { Owner };
};

export default useUsers;
