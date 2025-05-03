
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Box, Text, Container, VStack, Heading, HStack, Button, Flex, Dialog, Portal, Menu, CloseButton, Input } from '@chakra-ui/react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import { BsThreeDotsVertical } from "react-icons/bs"
import useRoom from './RoomHook'

const RoomList = () => {
  const { user, userInfo } = useSelector(state => state.auth)
  const accessToken = useAccessToken(user)
  const { buildingId } = useParams()
  const navigate = useNavigate()
  const { rooms } = useRoom(buildingId)

  const [fetchRooms, setRooms] = useState([])
  const [roomId, setRoomId] = useState('')
  const [floor, setFloor] = useState('')
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(false)
  const [room_size, setRoomSize] = useState('')

  const ListOwnerRooms = async () => {
    const url = import.meta.env.VITE_ROOM_LIST_URL;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      let fetchedRooms = Array.isArray(res.data) ? res.data : [];

      if (buildingId) {
        fetchedRooms = fetchedRooms.filter(item => item.building === Number(buildingId));
      }
      if (floor) {
        fetchedRooms = fetchedRooms.filter(item => item.floor === Number(floor));
      }
      if (room_size) {
        fetchedRooms = fetchedRooms.filter(item => item.room_size === room_size);
      }
      if (roomId) {
        fetchedRooms = fetchedRooms.filter(item => item.id === Number(roomId));
      }

      setRooms(fetchedRooms);
    } catch (error) {
      console.error("Cannot list user's room", error.response?.data || error.message);
      alert("Cannot list user's room");
    }
  };

  useEffect(() => {
    if (accessToken && buildingId) {
      ListOwnerRooms();
    }
  }, [accessToken, buildingId, roomId, floor, room_size]);

  const handlClickReport = (roomId) => {
    navigate(`/home/management/report/room/${roomId}`);
  };

  const handlClickQRCode = (roomId) => {
    navigate(`/home/management/feedback/create-form/${buildingId}/${roomId}`);
  };

  const handleUpdateRoom = (roomId) => {
    navigate(`/home/management/room/update/${roomId}`);
  };

  const handleDeleteRoom = (roomId) => {
    if (!accessToken || !userInfo?.id) return;
    const url = `${import.meta.env.VITE_ROOM_UPDATE_URL}${roomId}/`;

    axios.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
    }).then(() => {
      setRooms(prev => prev.filter(post => post.id !== roomId));
    }).catch((error) => {
      alert("Cannot delete room", error.response?.data || error.message);
    });
  };

  const handleDuplicateRoom = async (room) => {
    const url = import.meta.env.VITE_ROOM_CREATE_URL;
    const newRoom = {
      name: `${room.name} (Copy)`,
      room_size: room.room_size,
      floor: room.floor,
      building: room.building,
      description: room.description || "",
    };

    try {
      await axios.post(url, newRoom, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      alert("Room duplicated successfully!");
      ListOwnerRooms(); // refresh the list
    } catch (error) {
      console.error("Cannot duplicate room", error.response?.data || error.message);
      alert("Cannot duplicate room. Please try again.");
    }
  };

  const handleRoomChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleFloorChange = (e) => {
    setFloor(e.target.value);
    setRoomId("");
  };

  const handleRoomSizeChange = (e) => {
    setRoomSize(e.target.value);
    setRoomId("");
  };

  const handleRoomSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      alert("Please enter a keyword to search.");
      return;
    }
    setLoading(true);
    const url = `${import.meta.env.VITE_ROOM_SEARCH_URL}?keyword=${keyword}`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.get(url, config);
      let searchfilter = response.data;
      if (floor) {
        searchfilter = searchfilter.filter(item => item.floor === Number(floor));
      }
      setRooms(searchfilter);
    } catch (error) {
      console.error("Error searching room:", error);
      alert("Cannot search this room name. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event?.key === "Enter") {
      event.preventDefault();
      handleRoomSearch(event);
    }
  };
  const handleCreateRoom = (buildingId) => {
    buildingId = Number(buildingId)
    navigate(`/home/management/create-room/${buildingId}`)
  }
  return (
    <Container justifyContent="space-between">
      <HStack gap="20px" justifyContent={"space-evenly"}>
        <Box my={10} p={4} fontSize="18px" fontWeight="bold" border={"1px solid"} rounded={"7px"}>
          <select value={floor} onChange={handleFloorChange} disabled={!buildingId}>
            <option value="">All Floors</option>
            {[...new Set((Array.isArray(rooms) ? rooms : []).map(room => room.floor))].map((uniqueFloor, idx) => (
              <option key={idx} value={uniqueFloor}>{uniqueFloor}</option>
            ))}
          </select>
        </Box>
        <Box my={10} p={4} fontSize="18px" fontWeight="bold" border={"1px solid"} rounded={"7px"}>
          <select value={room_size} onChange={handleRoomSizeChange} disabled={!buildingId}>
            <option value="">All Size</option>
            {[...new Set((Array.isArray(rooms) ? rooms : [])
              .filter(room => !floor || room.floor === Number(floor))
              .map(room => room.room_size))].map((uniqueRoomSize, idx) => (
              <option key={idx} value={uniqueRoomSize}>{uniqueRoomSize ? `${uniqueRoomSize}` : "N/A"}</option>
            ))}
          </select>
        </Box>
        <Box my={10} p={4} fontSize="18px" fontWeight="bold" border={"1px solid"} rounded={"7px"}>
          <select value={roomId} onChange={handleRoomChange} disabled={!buildingId}>
            <option value="">All Rooms</option>
            {(Array.isArray(rooms) ? rooms : [])
              .filter(room => !floor || room.floor === Number(floor))
              .filter(room => !room_size || room.room_size === room_size)
              .map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
          </select>
        </Box>
        <HStack gap="10px">
          <form onSubmit={handleRoomSearch}>
            <label htmlFor="search">Search Room: </label>
            <input
              id='search'
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onkeydown={handleKeyDown}
              placeholder="Enter keyword to search"
              style={{ border: "1px solid", borderRadius: "7px", padding: "5px" }}
            />
            <Button type="submit" mx="10px">Search</Button>
          </form>
        </HStack>
      </HStack>

      <Flex wrap={"wrap"} justifyContent={"space-evenly"} alignItems={"center"}>
        {fetchRooms.length > 0 ? (
          fetchRooms.map((room) => (
              <Box key={room.id} shadow="1px 1px 15px 5px rgb(75, 75, 79)" p={4} my={4} w="300px" h={"270px"} mx="auto" rounded={6}>
                <Flex justifyContent="space-between">
                  <Box>
                    <Heading fontSize={24}>Room: {room.name}</Heading>
                    <Box>Room size: {room.room_size ? `${room.room_size}` : "N/A"}</Box>
                    <Box>Floor: {room.floor}</Box>
                    <Box>Building: {room.building_name || "N/A"}</Box>
                    <Box>Description: {room.description || "N/A"}</Box>
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
                              <Button variant="outline" size="xs" onClick={() => handleDuplicateRoom(room)}>Duplicate</Button>
                            </Menu.Item>
                            <Menu.Item>
                              <Dialog.Trigger asChild>
                                <Button variant="outline" size="xs">Delete</Button>
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
                              <Button onClick={() => { handleDeleteRoom(room.id) }}>Delete</Button>
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
                  <Button variant="outline" onClick={() => handlClickQRCode(room.id)}>Create QrCode</Button>
                  <Button variant="outline" onClick={() => handlClickReport(room.id)}>View reports</Button>
                </HStack>
              </Box>
          ))
        ) : (
          <Box>
            <Heading>No rooms found</Heading>
            {/* <Link to="/home/management/create-room/${buildingId}">Create rooms</Link> */}
            <Button onClick={() => handleCreateRoom(buildingId)}>Create New Rooms</Button>
          </Box>
        )}
      </Flex>
    </Container>
  );
};

export default RoomList;
