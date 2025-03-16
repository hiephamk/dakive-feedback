import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import { Box, Input, VStack, Button, Center, Container, Heading, QrCode, HStack, Portal, Select } from '@chakra-ui/react';
import axios from 'axios';
import useBuilding from '../BuildingManagement/BuildingHook'
import useRoom from './RoomHook';
import { Link } from 'react-router';

const CreateRoomReport = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    
    const {rooms} = useRoom(userInfo?.id)
    const {buildings} = useBuilding()

    console.log("buildings:", buildings)
    console.log("rooms:", rooms)

    const [roomId, setRoomId] = useState('');
    const [buildingId, setBuildingId] = useState('');

    const [formData, setFormData] = useState({
        name: "",
        room_status: "",
        heat_status: "",
        electric_status: "",
        internet_status: "",
        noise_status: "",
        air_status: "",
        room: roomId || "",
        building: buildingId || "",
    });

    useEffect(() => {
        if (roomId) {
            const selectedRoom = rooms.find(room => room.id === Number(roomId));
            if (selectedRoom) {
                setBuildingId(String(selectedRoom.building));
            } else {
                setBuildingId('');
            }
        } else {
            setBuildingId('');
        }
    }, [roomId, rooms]);

    // Effect to update formData after roomId or buildingId changes
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            room: roomId,
            building: buildingId,
        }));
    }, [roomId, buildingId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = import.meta.env.VITE_ROOM_REPORT_CREATE_URL;
        try {
            const response = await axios.post(url, formData, {headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                },
            });
            alert("The room report was sent.");
            console.log("Send room report", response.data);
            
            setFormData({
                name: "",
                room_status: "",
                heat_status: "",
                electric_status: "",
                internet_status: "",
                noise_status: "",
                air_status: "",
                neighborhood_status: "",
                room: roomId|| "",
                building: buildingId,
            });

        } catch (error) {
            console.error("Error creating organization:", error.response?.data || error.message);
            alert("send room report error")
        }
    };

    return (
      <Container mt={5} p={4} rounded={8} minW="100%">
        {rooms.length > 0 ? (
          <HStack gap={4} justifyContent="center">
          <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={8} p={4}>
            <Box>
              <QrCode.Root size="sm" value="https://www.hamk.fi/en/projects/dakive-data-utilization-for-the-development-of-energy-efficiency-and-low-carbon-of-the-real-estate/">
              <QrCode.Frame>
                  <QrCode.Pattern />
              </QrCode.Frame>
              </QrCode.Root>
            </Box>
              <Heading>Create Room Report</Heading>
            <Box border="1px solid" p={1} rounded={5} maxW="500px">
              <Input type="text" name="room_status" value={formData.room_status} onChange={handleChange} placeholder="Room Status" />
              <Input type="text" name="heat_status" value={formData.heat_status} onChange={handleChange} placeholder="Heat status" />
              <Input type="text" name="electric_status" value={formData.electric_status} onChange={handleChange} placeholder="Electric status" />
              <Input type="text" name="internet_status" value={formData.internet_status} onChange={handleChange} placeholder="Internet status" />
              <Input type="text" name="noise_status" value={formData.noise_status} onChange={handleChange} placeholder="noise_status" />
              <Input type="text" name="air_status" value={formData.air_status} onChange={handleChange} placeholder="Air status" />
              <Input type="text" name="neighborhood_status" value={formData.neighborhood_status} onChange={handleChange} placeholder="Neighborhood" />
            <VStack justifyContent="center" gap="2">
              <HStack>
                <label id="room">Room: </label>
                <select
                  name="room"
                  id="room"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  style={{height:'100%', padding:'5px', border:"1px solid", borderRadius:"5px"}}
                >
                  <option value="">Choose a room</option>
                  {
                    rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                    ))
                  }
                </select>
              </HStack>
              <HStack>
              <label id="building">Building: </label>
                <select
                  name="building"
                  id="building"
                  value={buildingId}
                  onChange={(e) => setBuildingId(e.target.value)}
                  style={{height:'100%', padding:'5px', border:"1px solid", borderRadius:"5px", width:"100%"}}
                >
                  <option value="">Choose a building</option>
                  {
                    buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))
                  }
                </select>
              </HStack>
            </VStack>
            </Box>
              <Button onClick={handleSubmit}>Create</Button>
          </VStack>
        </HStack>
        ):(
          <Center>
            <HStack>
              <Heading>You have no room. Please </Heading>
              <Link to="/room/create-room">Click here</Link>
              <Heading>to create a room first</Heading>
            </HStack>
          </Center>
        )
        }
      </Container>
    );
};

export default CreateRoomReport;
