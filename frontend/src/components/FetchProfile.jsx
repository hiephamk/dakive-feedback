import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAccessToken from "../services/token";
import axios from "axios";
import { Avatar, Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import UpdateProfile from "./UpdateProfile";
import { Link } from "react-router";

const FetchProfile = () => {
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
        const userProfile = res.data.find((profile) => profile.user === userInfo?.id);
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

  return (
    <Box boxSizing="border-box" p={10}>
      {accounts && accounts.length > 0 && (
        accounts.map((item) => (
          <Box key={item.id} >
            <HStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={10} rounded={8}>
              <Avatar.Root shape="full" size="lg">
                <Avatar.Fallback name="Random User" />
                <Avatar.Image src={item.profile_img} />
              </Avatar.Root>
              <Box pl="10px">
                <Box>
                  Full Name: {item.full_name}
                </Box>
                <Box>Email: {item.email}</Box>
                <Box>Phone: {item.phone_number}</Box>
                <Box>Bio: {item.bio}</Box>
              </Box>
            </HStack>
          </Box>
        ))
      )}
    <Box mt={5}>
      <Link to="/dashboard/update-profile">Update your information</Link>
    </Box>
</Box>
  );
};

export default FetchProfile;
