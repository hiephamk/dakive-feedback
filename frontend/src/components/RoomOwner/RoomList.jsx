import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Box, Container, VStack, Heading, HStack, Button, Flex} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'


const RoomList = () => {
  const {user, userInfo} = useSelector(state => state.auth)
  const accessToken = useAccessToken(user)
  
  const {buildingId, roomId} = useParams()
  // const {roomName, rooms} = useRoom(buildingId, roomId)
  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])

  const ListOwnerRooms = async () => {       
    const url = import.meta.env.VITE_ROOM_LIST_URL
    try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        const filterItem = response.data.filter((room) => room.building === Number(buildingId))
        if(filterItem.length > 0){

          setRooms(filterItem)
        }else {
          setRooms("")
        }
    }catch(error) {
        console.error("Cannot list user's room", error.response?.data || error.message);
        alert("Cannot list user's room");
    }
  }

  useEffect(()=>{
    if(accessToken && buildingId){
        ListOwnerRooms()
    }
  },[accessToken, buildingId])

const handlClickReport = (roomId) => {
  navigate(`/management/report/room/${roomId}`)
}
const handlClickQRCode = (roomId) => {
  navigate(`/management/feedback/create-form/${buildingId}/${roomId}`)
}
  return (
    <Container  justifyContent="space-between">
    <HStack maxW="300px">
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <VStack key={room.id} p={4}>
            <Box shadow="1px 1px 15px 5px rgb(75, 75, 79)" p={4} my={4} minW="100%" mx="auto" rounded={6}>
              <Heading fontSize={24}>Room: {room.name}</Heading>
              <Box>Floor: {room.floor}</Box>
              <Box>Building Name: {room.building_name || "N/A"}</Box>
              <HStack my={4} mx="auto">
                <Button onClick={()=> handlClickQRCode(room.id)}>Create QrCode</Button>
                <Button onClick={()=> handlClickReport(room.id)}>View reports</Button>
              </HStack>
            </Box>
          </VStack>
        ))
      ) : (
        <Box>
          <Heading>No rooms found</Heading>
          <Link to="/room/create-room">Create rooms</Link>
        </Box>
      )}
    </HStack>
  </Container>
  )
}

export default RoomList