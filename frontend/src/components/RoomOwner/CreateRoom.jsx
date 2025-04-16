import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import { Box, Stack, Input, VStack, Button, Center, Heading, Container } from '@chakra-ui/react';
import axios from 'axios';
import useBuilding from '../BuildingManagement/BuildingHook';

const CreateRoom = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);

    // Fetch organizations
    const {buildings} = useBuilding(userInfo?.id);
    const [buildingId, setBuildingId] = useState('');
    const [formData, setFormData] = useState({
        name: "",
        // room_size:"",
        floor: "",
        description: "",
        building: buildingId || "", // Use lowercase key name
    });

    // Update formData when organizationId changes
    useEffect(() => {
        setFormData((prev) => ({ ...prev, building: buildingId }));
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
        } catch (error) {
            console.error("Error creating room:", error.response?.data || error.message);
        }
    };

    return (
        <Container justifyContent="center" maxW="500px" mt={10}>
            <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" m={4} p={4} rounded={8} minW="100%">
                <Heading>Create New Room</Heading>
                <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                <Box>
                    <label htmlFor="size">Room Size</label>
                    <select name="room_size" id="size"
                        value={formData.room_size}
                        onChange={handleChange} 
                        placeholder="Room Size"
                        style={{border:'1px solid', borderRadius:'5px', padding:"7px", marginLeft:'10px'}}
                    >
                        <option value="">Choose room size</option>
                        <option value="30">0-29 m2</option>
                        <option value="50">30-49 m2</option>
                        <option value="100">50-99 m2</option>
                        <option value="150">100-149 m2</option>
                        <option value="200">150-199 m2</option>
                        <option value="250">200-249 m2</option>
                        <option value="300">250-299 m2</option>
                    </select>
                </Box>
                <Input type="text" name="floor" value={formData.floor} onChange={handleChange} placeholder="Floor" />
                <Input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Descriptions" />
                <Box border="1px solid" p={1} rounded={5}>
                <select
                name="Room"
                id="room"
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                style={{height:'100%', padding:'5px'}}
                >
                <option value="">Choose Building</option>
                {
                    buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                        {building.name}
                    </option>
                    ))
                }
                </select>
                </Box>
                <Button onClick={handleSubmit}>Create</Button>
            </VStack>
        </Container>
    );
};

export default CreateRoom;
