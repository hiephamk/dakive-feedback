import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import { useParams } from 'react-router';
import { Box, Input, VStack, Button, Center, Container, Heading, HStack } from '@chakra-ui/react';
import axios from 'axios';
import useBuilding from '../BuildingManagement/BuildingHook';
import useRoom from './RoomHook';
import { Link } from 'react-router';

const CreateRoomReport = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    
    const { rooms } = useRoom(userInfo?.id);
    const { buildings } = useBuilding();
    
    const { roomId: paramRoomId } = useParams();
    const [roomId, setRoomId] = useState(paramRoomId || '');
    const [buildingId, setBuildingId] = useState('');

    const [formData, setFormData] = useState({
        name: "",
        room_status: "",
        heat_status: "",
        electric_status: "",
        internet_status: "",
        noise_status: "",
        air_status: "",
        neighborhood_status: "", // Added missing field
        room: roomId || "",
        building: buildingId || "",
    });

    useEffect(() => {
        if (paramRoomId) {
            setRoomId(paramRoomId);
            const selectedRoom = rooms.find(room => room.id === Number(paramRoomId));
            if (selectedRoom) {
                setBuildingId(String(selectedRoom.building));
            }
        }
    }, [paramRoomId, rooms]);

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
        const url = `${import.meta.env.VITE_ROOM_REPORT_CREATE_URL}${roomId}/`;
        try {
            const response = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            alert("The room report was sent.");
            console.log("Send room report", response.data);
            
            // Reset all fields
            setFormData({
                name: "",
                room_status: "",
                heat_status: "",
                electric_status: "",
                internet_status: "",
                noise_status: "",
                air_status: "",
                neighborhood_status: "",
                room: roomId,
                building: buildingId,
            });

        } catch (error) {
            console.error("Error creating room report:", error.message);
            alert("Error sending room report");
        }
    };

    return (
      <Container mt={5} p={4} rounded={8} minW="100%">
        {rooms.length > 0 ? (
          <HStack gap={4} justifyContent="center">
            <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={8} p={4}>
              <Heading>Create Room Report</Heading>
              <Box border="1px solid" p={1} rounded={5} maxW="500px">
                <Input type="text" name="room_status" value={formData.room_status} onChange={handleChange} placeholder="Room Status" />
                <Input type="text" name="heat_status" value={formData.heat_status} onChange={handleChange} placeholder="Heat status" />
                <Input type="text" name="electric_status" value={formData.electric_status} onChange={handleChange} placeholder="Electric status" />
                <Input type="text" name="internet_status" value={formData.internet_status} onChange={handleChange} placeholder="Internet status" />
                <Input type="text" name="noise_status" value={formData.noise_status} onChange={handleChange} placeholder="Noise status" />
                <Input type="text" name="air_status" value={formData.air_status} onChange={handleChange} placeholder="Air status" />
                <Input type="text" name="neighborhood_status" value={formData.neighborhood_status} onChange={handleChange} placeholder="Neighborhood" />
                
                <VStack justifyContent="center" gap="2">
                  <HStack>
                    <label id="room">Room: </label>
                    <Input 
                      value={rooms.find(room => room.id === Number(roomId))?.name || ""}
                      readOnly
                    />
                  </HStack>
                  <HStack>
                    <label id="building">Building: </label>
                    <Input 
                      value={buildings.find(building => building.id === Number(buildingId))?.name || ""}
                      readOnly
                    />
                  </HStack>
                </VStack>
              </Box>
              <Button onClick={handleSubmit}>Create</Button>
            </VStack>
          </HStack>
        ) : (
          <Center>
            <HStack>
              <Heading>You have no rooms. Please </Heading>
              <Link to="/room/create-room">Click here</Link>
              <Heading>to create a room first</Heading>
            </HStack>
          </Center>
        )}
      </Container>
    );
};

export default CreateRoomReport;