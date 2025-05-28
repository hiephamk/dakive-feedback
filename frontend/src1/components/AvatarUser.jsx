import { useEffect, useState } from "react";
import axios from 'axios';
import { ImProfile } from "react-icons/im";
import { useSelector } from 'react-redux';
import { Link } from 'react-router'
import useAccessToken from "../services/token";
import { Box, Avatar } from "@chakra-ui/react";

const AvatarUser = () => {
  const [profileImg, setProfileImg] = useState('');
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user)

  useEffect(() => {
    const fetchProfileImg = async () => {
      if (!accessToken || !userInfo?.id) {
        console.error("Access token or user information is not available");
        return;
      }
      const url = import.meta.env.VITE_ACCOUNT_URL;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      try {
        const response = await axios.get(url, config);
        console.log("API Response:", response.data);
        const userProfile = response.data.find(
          (profile) => profile.user === userInfo.id
        );
        console.log("userId", userProfile);
        if (!userProfile) {
          console.error("No matching user profile found.");
          return;
        }
        if (userProfile && userProfile.profile_img) {
          setProfileImg(userProfile.profile_img);
        } else {
          console.warn("User profile found but no profile image set.");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };
    fetchProfileImg();
  }, [userInfo?.id, accessToken]);
  return (
    <>
    {user ?
      <Box>
        {profileImg ?
          (
            <Avatar.Root shape="full" size="lg">
                <Avatar.Fallback name={"Random User"} />
                <Avatar.Image src={profileImg} />
            </Avatar.Root>
          )
          :
          (
            <ImProfile />
        )}
      </Box>
      :
      <Link to='/login'>login</Link>
  }
    </>
  );
};

export default AvatarUser;
