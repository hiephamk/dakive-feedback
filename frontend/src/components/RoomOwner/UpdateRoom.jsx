import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import useAccessToken from '../../services/token';
import { Container, Stack, Box, Input, HStack, VStack, Button, Heading, Textarea, Field, Flex } from '@chakra-ui/react';
import axios from 'axios';
import useBuilding from '../BuildingManagement/BuildingHook';
import useOrganization_Membership from '../Organization/Organization_Membership_Hook';

const UpdateRoom = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    const { roomId } = useParams();
    const navigate = useNavigate();

    const { members } = useOrganization_Membership()
    const { buildings } = useBuilding();

    const [buildingId, setBuildingId] = useState('');

    const [formData, setFormData] = useState({
        name: "",
        room_size:"",
        floor: "",
        building: buildingId || "",
        description: "",
        external_id:""
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
                    room_size: roomData.room_size || "",
                    floor: roomData.floor || "",
                    building: roomData.building || "",
                    description: roomData.description || "",
                    external_id: roomData.external_id || "",
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
            // room_size:"Room Size",
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
            await axios.put(url, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Room updated successfully");
            navigate(`/home/management/room-list/${formData.building}/${formData.external_id}`);
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
                    <VStack>
                        <Field.Root required>
                            <Flex>
                                <Field.Label w={"200px"}>
                                    Building: <Field.RequiredIndicator/>
                                </Field.Label>
                                    <HStack border="1px solid" p={"10px"} rounded={5} w={"100%"} mx={"10px"}>
                                        <select
                                            name="building"
                                            id="building"
                                            value={buildingId}
                                            onChange={(e) => setBuildingId(e.target.value)}
                                        >
                                            <option value="">Choose a Building</option>
                                            {members
                                                .filter(member => member.user === userInfo?.id && member.role === "editor")
                                                .map(org => buildings
                                                    .filter(building => building.organization === org.organization)
                                                    .map(building => (
                                                        <option key={building.id} value={building.id}>
                                                            {building.name}
                                                        </option>
                                                    ))
                                                )
                                            }
                                        </select>
                                    </HStack>
                            </Flex>
                        </Field.Root>
                        <Field.Root required>
                            <HStack>
                                <Field.Label w={"200px"}>
                                    Name: <Field.RequiredIndicator/>
                                </Field.Label>
                                <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                            </HStack>
                        </Field.Root>
                        <Field.Root required>
                            <HStack>
                                <Field.Label w={"200px"}>
                                    Floor: <Field.RequiredIndicator/>
                                </Field.Label>
                                <Input type="text" name="floor" value={formData.floor} onChange={handleChange} placeholder="Floor" />
                            </HStack>
                        </Field.Root>
                        <Field.Root>
                            <HStack>
                                <Field.Label w={"200px"}>
                                    Room Size:
                                </Field.Label>
                                <Input type="text" name="room_size" value={formData.room_size} onChange={handleChange} placeholder="Room size" />
                            </HStack>
                        </Field.Root>
                        <Field.Root>
                            <HStack>
                                <Field.Label w={"200px"}>
                                    Description:
                                </Field.Label>
                                <Input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Descriptions" />
                            </HStack>
                        </Field.Root>
                    </VStack>
                    <Button onClick={handleSubmit}>Update Room</Button>
                </VStack>
            </HStack>
        </Container>
    );
};

export default UpdateRoom;