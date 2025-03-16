import {useState, useEffect} from 'react'
import { Link } from 'react-router'
import { Box, Container, VStack, Heading } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import axios from 'axios'
import useRoom from './RoomHook'
const RoomList = () => {
  const {user, userInfo} = useSelector(state => state.auth)
  const {rooms} = useRoom(userInfo.id)
  // const accessToken = useAccessToken(user)

//   const [rooms, setRooms] = useState([])

//   const config = {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   };
// const url = import.meta.env.VITE_ROOM_LIST_URL
// const ListOwnerRooms = async () => {       
//   try {
//       const res = await axios.get(url, config);
//       console.log("Full API response:", res.data);
//       const roomFilter = res.data.filter(room => room.owner === userInfo?.id)
//       if (Array.isArray(res.data)) {
//           setRooms(roomFilter);
//       } else {
//           console.warn("API returned non-array data:", res.data);
//           setRooms([]);
//       }

//       // Log after a short delay to check async update
//       setTimeout(() => {
//           console.log("Updated rooms state after setting:", rooms);
//       }, 500);
//   } catch (error) {
//       console.error("Error fetching rooms:", error.response?.data || error.message);
//   }
// };


// useEffect(()=>{
//     if(accessToken && userInfo?.id){
//         ListOwnerRooms()
//     }
// },[accessToken, userInfo.id])


  return (
    <Container>
    <Box>
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <Box key={room.id} p={4}>
            <Heading fontSize={24}>Room: {room.name}</Heading>
            <Box>Floor: {room.floor}</Box>
            <Box>Building Name: {room.building_name || "N/A"}</Box>
          </Box>
        ))
      ) : (
        <Box>
          <Heading>No rooms found</Heading>
          <Link to="/room/create-room">Create rooms</Link>
        </Box>
      )}
    </Box>
  </Container>
  )
}

export default RoomList