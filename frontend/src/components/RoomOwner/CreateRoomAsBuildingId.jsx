import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import { Box, Text, HStack, Input, VStack, Button, Center, Heading, Container } from '@chakra-ui/react';
import axios from 'axios';
import useBuilding from '../BuildingManagement/BuildingHook';
import { useParams, useNavigate } from 'react-router-dom'

const CreateRoomAsBuildingId = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    const navigate = useNavigate()

    // Fetch organizations
    const {buildings} = useBuilding(userInfo?.id);
    // const [buildingId, setBuildingId] = useState('');
    const { buildingId } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        // room_size:"",
        floor: "",
        description: "",
        building: "", // Use lowercase key name
    });

    // Update formData when organizationId changes
    useEffect(() => {
        setFormData((prev) => ({ ...prev, building: Number(buildingId) }));
    }, [buildingId]);

    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    };

    const url = import.meta.env.VITE_ROOM_CREATE_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(url, formData, config);
            alert("Created the room successfully");
            setFormData({
                name: "",
                room_size:"",
                floor: "",
                description:"",
                building: buildingId, 
            });
            navigate(`/home/management/room-list/${buildingId}`)
        } catch (error) {
            console.error("Error creating room:", error.response?.data || error.message);
        }
    };

    return (
        <Container justifyContent="center" maxW="500px" mt={10}>
            <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" m={4} p={4} rounded={8} minW="100%">
                <Box p={1}>
                    {buildings
                    .filter(item => item.id === Number(buildingId))
                    .map(building => (
                        <Box key={building.id}>
                            <Heading>Create New Rooms - {building.name}</Heading>
                        </Box>
                    ))
                    }
                </Box>
                
                <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                <Input type="text" name="room_size" value={formData.room_size} onChange={handleChange} placeholder="Room size" />
                <Input type="text" name="floor" value={formData.floor} onChange={handleChange} placeholder="Floor" />
                <Input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Descriptions" />
                <Button onClick={handleSubmit}>Create</Button>
            </VStack>
        </Container>
    );
};
export default CreateRoomAsBuildingId