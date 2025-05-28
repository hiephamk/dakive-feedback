import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAccessToken from "../services/token";

const useUsers = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [users, setUsers] = useState([]); // Start as null (unknown)

  const userDetail = async () => {
    if (!accessToken || !userInfo?.id) return;
    try {
      const url = import.meta.env.VITE_ACCOUNT_LIST_URL;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.get(url, config);
      setUsers(res.data);

    } catch (error) {
      console.error("Error fetching user:", error.response || error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      userDetail();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return { users };
};

export default useUsers;
