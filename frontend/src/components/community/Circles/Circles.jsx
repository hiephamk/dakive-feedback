import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useAccessToken from "../../../services/token";
import { Box, Text, List, VStack } from "@chakra-ui/react";

const Circles = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [circles, setCircles] = useState([])

const fetchCircles = async () => {
  if (!accessToken) return;

  try {
    const url = import.meta.env.VITE_COMMUNITY_CIRCLES_LIST_URL
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userCircles = response.data.filter(
      (circle) => circle.owner === userInfo.id
    );

    setCircles(userCircles);
  } catch (error) {
    console.error('Error fetching circles:', error);
  }
};
useEffect(()=>{
  if(accessToken){
    fetchCircles()
  }
},[accessToken])

  return (
    <Box>
        {circles.length > 0 ? (
        circles.map((member) => (
      <VStack key={member.id} align="start">
        <List.Root>
            <List.Item >{member.member_name}</List.Item>
        </List.Root>
      </VStack>

        ))
      ): (null)}
    </Box>
  );
};

export default Circles;

