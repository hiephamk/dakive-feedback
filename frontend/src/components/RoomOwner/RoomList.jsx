
import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Box, Table, Center, Text, Container, VStack, Heading, HStack, InputGroup, Input, Button, Flex, Dialog, Portal, Menu, CloseButton, Tabs, List, Switch, Stack, Collapsible } from '@chakra-ui/react';
import { LuSearch } from "react-icons/lu";
import axios from 'axios';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaListUl } from 'react-icons/fa';
import { AiTwotoneAppstore } from 'react-icons/ai';
import useRoom from './RoomHook';
import useOrganization_Membership from '../Organization/Organization_Membership_Hook';
import useBuilding from '../BuildingManagement/BuildingHook';
import SyncRooms from '../Sensor-Data/SyncRooms';

const RoomList = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const { buildingId, externalId } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { rooms } = useRoom(buildingId);
  const { buildings } = useBuilding();
  const { members } = useOrganization_Membership();

  // const [external_id, setExternalId] = useState('')

  const [fetchRooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [floor, setFloor] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [room_size, setRoomSize] = useState('');
  // const [iotBuildings, setIotBuildings] = useState([]);
  // const [matchedIotBuildingId, setMatchedIotBuildingId] = useState(null);
  // const [matchedLocalBuildingId, setMatchedLocalBuildingId] = useState(null);

  const ListOwnerRooms = async () => {
    const url = import.meta.env.VITE_ROOM_LIST_URL;
    setLoading(true);
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      let fetchedRooms = Array.isArray(res.data) ? res.data : [];

      if (buildingId) {
        fetchedRooms = fetchedRooms.filter((item) => item.building === Number(buildingId));
      }
      if (floor) {
        fetchedRooms = fetchedRooms.filter((item) => item.floor === Number(floor));
      }
      if (room_size) {
        fetchedRooms = fetchedRooms.filter((item) => item.room_size === room_size);
      }
      if (roomId) {
        fetchedRooms = fetchedRooms.filter((item) => item.id === Number(roomId));
      }

      setRooms(fetchedRooms);
    } catch (error) {
      console.error("Cannot list user's room:", error.response?.data || error.message);
      alert("Cannot list user's room");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && buildingId) {
      ListOwnerRooms();
    }
  }, [accessToken, buildingId, roomId, floor, room_size]);

  const handleClickReport = (roomId) => {
    navigate(`/home/management/report/room/${roomId}`);
  };

  const handleClickQRCode = (roomId) => {
    navigate(`/home/management/feedback/create-form/${buildingId}/${roomId}`);
  };

  const handleUpdateRoom = (roomId) => {
    navigate(`/home/management/room/update/${roomId}`);
  };

  const handleDeleteRoom = (roomId) => {
    if (!accessToken || !userInfo?.id) return;
    const url = `${import.meta.env.VITE_ROOM_UPDATE_URL}${roomId}/`;

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setRooms((prev) => prev.filter((post) => post.id !== roomId));
      })
      .catch((error) => {
        alert("Cannot delete room: " + (error.response?.data || error.message));
      });
  };
  const generateRandom = (length = 8) => {
    const randomStr = Math.random().toString(36).substring(2, 2 + length)
    return randomStr
  }
  const handleDuplicateRoom = async (room) => {
    const url = import.meta.env.VITE_ROOM_CREATE_URL;
    const newRoom = {
      name: `${room.name} (Copy)`,
      room_size: room.room_size,
      floor: room.floor,
      building: room.building,
      description: room.description || "",
      external_id:generateRandom()
    };

    try {
      await axios.post(url, newRoom, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      alert("Room duplicated successfully!");
      ListOwnerRooms(); // Refresh the list
    } catch (error) {
      console.error("Cannot duplicate room:", error.response?.data || error.message);
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

  const handleClearFilter = () => {
    setRoomSize('');
    setRoomId('');
    setFloor('');
    ListOwnerRooms();
  };

  const handleRoomSearch = async (e) => {
    e.preventDefault();
    const searchKeyword = keyword.trim();
    if (!searchKeyword) {
      ListOwnerRooms();
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
      let searchFilter = Array.isArray(response.data) ? response.data : [];
      searchFilter = searchFilter.filter(item => item.building === Number(buildingId))
      setRooms(searchFilter);
    } catch (error) {
      console.error("Error searching room:", error.response?.data || error.message);
      alert("Cannot search this room name. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event?.key === "Enter") {
      // event.preventDefault();
      handleRoomSearch(event);
    }
  };

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (value.trim() === "") {
      ListOwnerRooms();
    }
  };
  useEffect(() => {
      if (keyword.trim() === '') {
        ListOwnerRooms();
      }
    }, [keyword]);

  const endElement = keyword ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setKeyword("");
        inputRef.current?.focus();
      }}
      me="-2"
    />
  ) : undefined;

  const handleCreateRoom = (buildingId) => {
    buildingId = Number(buildingId);
    navigate(`/home/management/create-room/${buildingId}/${externalId}`);
  };

  const editors = buildings
    .filter((item) => item.id === Number(buildingId))
    .flatMap((building) =>
      members.filter((m) => m.organization === building.organization && m.user === userInfo?.id)
    )
    .filter((item) => item.role === 'editor');


  return (
    <Box w="90%" maxW="100vw" justifyContent="space-between">
      <HStack gap={"10px"} justifyContent={"space-between"}>
        
        <Box>
          {members
            .filter(m => m.user === userInfo?.id && m.role === "editor")
            .flatMap(m => buildings
              .filter(b => b.organization === m.organization)
              .map(b => (
                <Box key={b.id} w={"100vw"} mt={"20px"}>
                  {b.id === Number(buildingId) ? (
                    <Center>
                      <Flex gap={"20px"}>
                        <Box>
                          <Button shadow="1px 1px 15px 5px rgb(75, 75, 79)" variant={"outline"} border={"1px solid"} py={'23px'} fontSize={"18px"} rounded={"5px"}  onClick={() => handleCreateRoom(buildingId)}>Create New Rooms</Button>
                        </Box>
                        <Collapsible.Root >
                          <Collapsible.Trigger shadow="1px 1px 15px 5px rgb(75, 75, 79)" border={"1px solid"} p={'10px'} rounded={"5px"} color={"ButtonText"} fontSize={"18px"}>Sync Room from Sensors</Collapsible.Trigger>
                          <Collapsible.Content>
                            <Box border={"1px solid"} rounded={"5px"} p={"10px"} w={"fit-content"} my={"20px"} >
                              <SyncRooms
                                iotBuildingId={Number(externalId)}
                                localBuildingId={Number(buildingId)}
                                onSyncSuccess={ListOwnerRooms}
                              />
                            </Box>
                          </Collapsible.Content>
                        </Collapsible.Root>
                      
                      </Flex>
                    </Center>
                  ):("")}
                </Box>
              ))
            )
          }
        </Box>
      </HStack>

      <HStack gap="20px" justifyContent="space-evenly">
        {/* Floor Filter */}
          <HStack gap="20px">
            <Box my={10} p={4} fontSize="16px" border="1px solid" rounded="7px">
              <select value={floor} onChange={handleFloorChange} disabled={!buildingId}>
                <option value="">All Floors</option>
                {[...new Set((Array.isArray(rooms) ? rooms : []).map((room) => room.floor))].map((uniqueFloor, idx) => (
                  <option key={idx} value={uniqueFloor}>{uniqueFloor}</option>
                ))}
              </select>
            </Box>
            {/* Room Size Filter */}
            <Box my={10} p={4} fontSize="16px" border="1px solid" rounded="7px">
              <select value={room_size} onChange={handleRoomSizeChange} disabled={!buildingId}>
                <option value="">All Size</option>
                {[...new Set((Array.isArray(rooms) ? rooms : [])
                  .filter((room) => !floor || room.floor === Number(floor))
                  .map((room) => room.room_size))].map((uniqueRoomSize, idx) => (
                  <option key={idx} value={uniqueRoomSize}>
                    {uniqueRoomSize ? `${uniqueRoomSize}` : "N/A"}
                  </option>
                ))}
              </select>
            </Box>
            {/* Room Filter */}
            <Box my={10} p={4} fontSize="16px" border="1px solid" rounded="7px">
              <select value={roomId} onChange={handleRoomChange} disabled={!buildingId}>
                <option value="">All Rooms</option>
                {(Array.isArray(rooms) ? rooms : [])
                  .filter((room) => !floor || room.floor === Number(floor))
                  .filter((room) => !room_size || room.room_size === room_size)
                  .map((room) => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
              </select>
            </Box>
          <Box>
            <Button onClick={handleClearFilter}>Clear</Button>
          </Box>
        </HStack>

        {/* Search Box */}
        <Center shadow="3px 3px 15px 5px rgb(75, 75, 79)" p="10px" rounded="7px">
          <form onSubmit={handleRoomSearch}>
            <InputGroup flex="1" startElement={<LuSearch />} endElement={endElement} rounded="5px">
              <Input
                ref={inputRef}
                id="search"
                type="search"
                value={keyword}
                onChange={handleKeywordChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter keyword to search"
                w="300px"
                aria-label="Search rooms by keyword"
              />
            </InputGroup>
          </form>
        </Center>
      </HStack>
      <Tabs.Root defaultValue={"list"} mx={"10px"}>
        <Tabs.List>
          <Tabs.Trigger value="list" fontSize={'30px'}>
            <FaListUl />
          </Tabs.Trigger>
          <Tabs.Trigger value="card" fontSize={'30px'}>
            <AiTwotoneAppstore />
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='card'>
          <Flex wrap="wrap" justifyContent="space-evenly" alignItems="center">
            {loading ? (
              <Center>
                <Text>Loading rooms...</Text>
              </Center>
            ) : fetchRooms.length > 0 ? (
              fetchRooms.map((room) => (
                <Box key={room.id} shadow="1px 1px 15px 5px rgb(75, 75, 79)" p={4} my={4} w="300px" h="350px" rounded={6}>
                  <Box>
                    <Flex justifyContent="space-between" w="100%" borderBottom="1px solid">
                      <Heading fontSize="18px">Room Details</Heading>

                      {editors.length > 0 && (
                      <Box>
                        <Dialog.Root size="xs">
                          <Menu.Root>
                            <Menu.Trigger asChild>
                              <Button variant="ghost" size="xs">
                                <BsThreeDotsVertical />
                              </Button>
                            </Menu.Trigger>
                            <Portal>
                              <Menu.Positioner>
                                <Menu.Content>
                                  <Menu.Item>
                                    <Button variant="outline" size="xs" onClick={() => handleClickQRCode(room.id)}>
                                      Create QR-Code
                                    </Button>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <Button variant="outline" size="xs" onClick={() => handleUpdateRoom(room.id)}>
                                      Update
                                    </Button>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <Button variant="outline" size="xs" onClick={() => handleDuplicateRoom(room)}>
                                      Duplicate
                                    </Button>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <Dialog.Trigger asChild>
                                      <Button variant="outline" size="xs">Delete</Button>
                                    </Dialog.Trigger>
                                  </Menu.Item>
                                </Menu.Content>
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
                                  <Button onClick={() => handleDeleteRoom(room.id)}>Delete</Button>
                                </Dialog.Footer>
                                <Dialog.CloseTrigger asChild>
                                  <CloseButton size="sm" />
                                </Dialog.CloseTrigger>
                              </Dialog.Content>
                            </Dialog.Positioner>
                          </Portal>
                        </Dialog.Root>
                      </Box>
                    )}

                    </Flex>
                <Box h="270px" overflow="auto" mt="10px" maxW="300px">
                  <Table.Root showColumnBorder>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>Name</Table.Cell>
                        <Table.Cell>{room.name}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Building</Table.Cell>
                        <Table.Cell>{room.building_name}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Size</Table.Cell>
                        <Table.Cell>{room.room_size || "N/A"}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Floor</Table.Cell>
                        <Table.Cell>{room.floor}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Description</Table.Cell>
                        <Table.Cell>{room.description || "N/A"}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                </Box>
              </Box>
              {/* QR and Report Buttons */}
              {/* <HStack my={4} mx="auto" justifyContent="space-evenly">
                {buildings
                  .filter((item) => item.id === Number(buildingId))
                  .flatMap((building) =>
                    members.filter((m) => m.organization === building.organization && m.user === userInfo?.id)
                  )
                  .filter((item) => item.role === 'editor')
                  .map((item) => (
                    <Box key={item.id}>
                      <Button onClick={() => handleClickQRCode(room.id)}>Create QR-Code</Button>
                    </Box>
                ))}
                <Button onClick={() => handleClickReport(room.id)}>View reports</Button>
              </HStack> */}
            </Box>
            ))
            ) : (
              ""
            )}
          </Flex>
        </Tabs.Content>
        <Tabs.Content value='list' shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} mt={'20px'} rounded={'7px'}>
            <Table.Root border={"2px solid"}>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader border={"2px solid"} fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'} w={"20%"}>Name</Table.ColumnHeader>
                  <Table.ColumnHeader border={"2px solid"} fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'} w={"15%"}>Building</Table.ColumnHeader>
                  <Table.ColumnHeader border={"2px solid"} fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'} w={"10%"}>Floor</Table.ColumnHeader>
                  <Table.ColumnHeader border={"2px solid"} fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'} w={"10%"}>Size</Table.ColumnHeader>
                  <Table.ColumnHeader border={"2px solid"} fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'}>Description</Table.ColumnHeader>
                  <Table.ColumnHeader border={"2px solid"} fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'} w={"5%"}>Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
               {fetchRooms.length > 0 ? (
              fetchRooms.map((room) => (
                <Table.Body key={room.id} border={"1px solid"}>
                  <Table.Row>
                    <Table.Cell border={"1px solid"}>{room.name}</Table.Cell>
                    <Table.Cell border={"1px solid"}>{room.building_name}</Table.Cell>
                    <Table.Cell border={"1px solid"} textAlign={"center"}>{room.floor}</Table.Cell>
                    <Table.Cell border={"1px solid"} textAlign={"center"}>{room.size}</Table.Cell>
                    <Table.Cell border={"1px solid"}>{room.description}</Table.Cell>
                    <Table.Cell border={"1px solid"}>
                      <>
                        {buildings
                          .filter((item) => item.id === Number(buildingId))
                          .flatMap((building) =>
                            members.filter((m) => m.organization === building.organization && m.user === userInfo?.id)
                          )
                          .filter((item) => item.role === 'editor')
                          .map((item) => (
                            <Box key={item.id}>
                              <Dialog.Root size="xs">
                                <Menu.Root>
                                  <Menu.Trigger asChild>
                                    <Button variant="ghost" size="xs">
                                      <BsThreeDotsVertical />
                                    </Button>
                                  </Menu.Trigger>
                                  <Portal>
                                    <Menu.Positioner border={"1px solid"} rounded={"5px"} background="#99a3a4">
                                      <Menu.Content>
                                        <Menu.Item>
                                          <Button variant="outline" onClick={() => handleClickQRCode(room.id)}>Create QR-Code</Button>
                                        </Menu.Item>
                                        {/* <Menu.Item>
                                          <Button variant="outline" onClick={() => handleClickReport(room.id)}>View reports</Button>
                                        </Menu.Item> */}
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
                                      </Menu.Content>
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
                                        <Button onClick={() => handleDeleteRoom(room.id)}>Delete</Button>
                                      </Dialog.Footer>
                                      <Dialog.CloseTrigger asChild>
                                        <CloseButton size="sm" />
                                      </Dialog.CloseTrigger>
                                    </Dialog.Content>
                                  </Dialog.Positioner>
                                </Portal>
                              </Dialog.Root>
                            </Box>
                          ))}
                      </>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))):("")}
            </Table.Root>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default RoomList;