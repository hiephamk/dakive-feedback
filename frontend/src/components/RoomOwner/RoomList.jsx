import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Box,Text, Container, VStack, Heading, HStack, Button, Flex, Dialog, Portal, Menu} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import { BsThreeDotsVertical } from "react-icons/bs"
import { CloseButton } from '@chakra-ui/react'


const RoomList = () => {
  const {user, userInfo} = useSelector(state => state.auth)
  const accessToken = useAccessToken(user)
  
  const { buildingId } = useParams()
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
    navigate(`/home/management/report/room/${roomId}`)
  }
  const handlClickQRCode = (roomId) => {
    navigate(`/home/management/feedback/create-form/${buildingId}/${roomId}`)
  }
//update and delete room

  const handleUpdateRoom = (room) => {
    navigate(`/home/management/room/update/${room}`)
  }
  const handleDeleteRoom = (room) => {
    if(!accessToken || !userInfo?.id) return
    const url = `${import.meta.env.VITE_ROOM_UPDATE_URL}${room}/`
    try {
        axios.delete(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
        })
        .then(() =>{
            setRooms(rooms.filter(post => post.id !== room))
        })
        setRooms(rooms)
    }catch(error){
        alert("Cannot delete building", error.response?.data || error.message)
    }
  }

  return (
    <Container  justifyContent="space-between">
    <HStack maxW="300px">
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <VStack key={room.id} p={4}>
            <Box shadow="1px 1px 15px 5px rgb(75, 75, 79)" p={4} my={4} minW="100%" mx="auto" rounded={6}>
              <Flex justifyContent="space-between">
                <Box>
                  <Heading fontSize={24}>Room: {room.name}</Heading>
                  <Box>Floor: {room.floor}</Box>
                  <Box>Building: {room.building_name || "N/A"}</Box>
                </Box>
                <Box mx="18px">
                  <Dialog.Root size="xs">
                  <Menu.Root>
                      <Menu.Trigger asChild>
                          <Button variant="ghost" size="xs">
                              <BsThreeDotsVertical />
                          </Button>
                      </Menu.Trigger>
                      <Portal>
                          <Menu.Positioner>
                              <Menu.Item>
                                  <Button variant="outline" size="xs" onClick={() => handleUpdateRoom(room.id)}>Update</Button>
                              </Menu.Item>
                              <Menu.Item>
                              <Dialog.Trigger asChild>
                          <Button variant="outline" size="xs">
                              Delete
                          </Button>
                      </Dialog.Trigger>
                              </Menu.Item>
                          </Menu.Positioner>
                      </Portal>
                  </Menu.Root>
                  <Portal>
                      <Dialog.Backdrop />
                      <Dialog.Positioner>
                      <Dialog.Content>
                          <Dialog.Header>
                          <Dialog.Title>Delete Room</Dialog.Title>
                          </Dialog.Header>
                          <Dialog.Body>
                              <Text>Do you really want to delete the room?</Text>
                          </Dialog.Body>
                          <Dialog.Footer>
                          <Dialog.ActionTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                          </Dialog.ActionTrigger>
                          <Button onClick={()=>{handleDeleteRoom(room.id)}}>Delete</Button>
                          </Dialog.Footer>
                          <Dialog.CloseTrigger asChild>
                          <CloseButton size="sm" />
                          </Dialog.CloseTrigger>
                      </Dialog.Content>
                      </Dialog.Positioner>
                  </Portal>
                  </Dialog.Root>
              </Box>
              </Flex>
              <HStack my={4} mx="auto">
                <Button variant="outline" onClick={()=> handlClickQRCode(room.id)}>Create QrCode</Button>
                <Button variant="outline" onClick={()=> handlClickReport(room.id)}>View reports</Button>
              </HStack>
            </Box>
          </VStack>
        ))
      ) : (
        <Box>
          <Heading>No rooms found</Heading>
          <Link to="/management/create-room">Create rooms</Link>
        </Box>
      )}
    </HStack>
  </Container>
  )
}

export default RoomList