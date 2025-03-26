import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import useAccessToken from '../../services/token';
import { Container, Stack, Box, Input, HStack, VStack, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';
import useBuilding from '../BuildingManagement/BuildingHook';

const UpdateRoom = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    const { roomId } = useParams();
    const navigate = useNavigate();
    console.log("user:", user)
    const { buildings } = useBuilding(userInfo?.id);

    const [buildingId, setBuildingId] = useState('');

    const [formData, setFormData] = useState({
        name: "",
        floor: "",
        building: buildingId || "",
        owner:userInfo?.id || ""
    });

    // Fetch room data when component mounts
    useEffect(() => {
        const fetchRoom = async () => {
            if (!accessToken || !roomId) return;
            try {
                const url = `${import.meta.env.VITE_ROOM_UPDATE_URL}${roomId}/`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                });
                const roomData = response.data;
                setFormData({
                    name: roomData.name || "",
                    floor: roomData.floor || "",
                    building: roomData.building || "",
                    owner: roomData.owner || userInfo?.id || "",
                });
                setBuildingId(roomData.building || '');
            } catch (error) {
                console.error("Error fetching room:", error);
                alert("Failed to load room data");
            }
        };

        if (accessToken && roomId) {
            fetchRoom();
        }
    }, [accessToken, roomId]);

    useEffect(() => {
        setFormData((prev) => ({ ...prev, building: buildingId }));
    }, [buildingId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = {
            name: "Room Name",
            floor: "Floor",
            building: "Building",
        };

        for (const field in requiredFields) {
            if (!formData[field]) {
                alert(`Please fill in the required field: ${requiredFields[field]}`);
                return;
            }
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const url = `${import.meta.env.VITE_ROOM_UPDATE_URL}${roomId}/`;
            const res = await axios.put(url, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Room updated successfully");
            console.log("room update:", res.data)
            navigate(`/home/management/room-list/${formData.building}`);
        } catch (error) {
            console.error("Error updating room:", error);
            alert("Failed to update room: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Container justifyContent="center" maxW="500px" mt={10}>
            <HStack>
                <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={4} rounded={7} minW="100%">
                    <Heading my={4}>Update Room</Heading>
                    <HStack>
                        <label htmlFor="name">Name: </label>
                        <Input 
                            id="name" 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            placeholder="Room Name" 
                        />
                    </HStack>
                    <HStack>
                        <label htmlFor="floor">Floor:</label>
                        <Input 
                            id="floor" 
                            type="text" 
                            name="floor" // Fixed: was "street"
                            value={formData.floor} 
                            onChange={handleChange} 
                            placeholder="Floor" 
                        />
                    </HStack>
                    <HStack gap={4} justifyContent="space-between">
                        <label htmlFor="building">Building: </label>
                        <Box border="1px solid" p={1} rounded={5}>
                            <select
                                name="building"
                                id="building"
                                value={buildingId}
                                onChange={(e) => setBuildingId(e.target.value)}
                            >
                                <option value="">Choose a Building</option>
                                {buildings && buildings.length > 0 ? (
                                    buildings.map((building) => (
                                        <option key={building.id} value={building.id}>
                                            {building.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No Buildings</option>
                                )}
                            </select>
                        </Box>
                    </HStack>
                    <Button onClick={handleSubmit}>Update Room</Button>
                </VStack>
            </HStack>
        </Container>
    );
};

export default UpdateRoom;