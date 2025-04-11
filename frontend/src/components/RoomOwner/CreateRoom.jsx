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

    console.log("building list", buildings)

    const [buildingId, setBuildingId] = useState('');
    const [formData, setFormData] = useState({
        name: "",
        floor: "",
        owner: userInfo?.id || "",
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
                floor: "",
                owner: userInfo?.id || "",
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
                <Input type="text" name="floor" value={formData.floor} onChange={handleChange} placeholder="Floor" />
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
