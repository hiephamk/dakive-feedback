import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; // Add these imports
import useAccessToken from '../../services/token';
import { Container, Stack, Box, Input, HStack, VStack, Button, Heading } from '@chakra-ui/react';
import axios from 'axios';
import useOrganization from './OrganizationHook';

const UpdateBuilding = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    const { buildingId } = useParams(); // Get building ID from URL params
    const navigate = useNavigate(); // For navigation after update
    const { organizations } = useOrganization(userInfo?.id);

    const [organizationId, setOrganizationId] = useState('');
    const [buildingImg, setBuildingImage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        owner: userInfo?.id || "",
        organization: organizationId || "",
    });

    // Fetch building data when component mounts
    useEffect(() => {
        const fetchBuilding = async () => {
            if (!accessToken || !buildingId) return;
            try {
                const url = `${import.meta.env.VITE_BUILDING_UPDATE_URL}${buildingId}/`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                });
                const buildingData = response.data;
                setFormData({
                    name: buildingData.name || "",
                    street: buildingData.street || "",
                    city: buildingData.city || "",
                    state: buildingData.state || "",
                    country: buildingData.country || "",
                    postal_code: buildingData.postal_code || "",
                    owner: buildingData.owner || userInfo?.id || "",
                    organization: buildingData.organization || "",
                });
                setOrganizationId(buildingData.organization || '');
            } catch (error) {
                console.error("Error fetching building:", error);
                alert("Failed to load building data");
            }
        };

        if (accessToken && buildingId) {
            fetchBuilding();
        }
    }, [accessToken, buildingId, userInfo?.id]);

    useEffect(() => {
        setFormData((prev) => ({ ...prev, organization: organizationId }));
    }, [organizationId]);

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
            name: "Building Name",
            street: "Street",
            city: "City",
            country: "Country",
            postal_code: "Postal Code",
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

        if (buildingImg) {
            formDataToSend.append("building_img", buildingImg);
        }

        try {
            const url = `${import.meta.env.VITE_BUILDING_UPDATE_URL}${buildingId}/`;
            await axios.put(url, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Building updated successfully");
            navigate('/home/management/building-list');
        } catch (error) {
            console.error("Error updating building:", error);
            alert("Failed to update building: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Container justifyContent="center" maxW="500px" mt={10}>
            <HStack>
                <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={4} rounded={7} minW="100%">
                    <Heading my={4}>Update Building</Heading>
                    <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                    <Input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" />
                    <Input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                    <Input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                    <Input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
                    <Input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Postal Code" />
                    
                    <HStack gap={4} justifyContent="space-between">
                        <label id="organization">Organization: </label>
                        <Box border="1px solid" p={1} rounded={5}>
                            <select
                                name="organization"
                                id="organization"
                                value={organizationId}
                                onChange={(e) => setOrganizationId(e.target.value)}
                            >
                                <option value="">Choose an organization</option>
                                {organizations.length > 0 ? (
                                    organizations.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No Organization</option>
                                )}
                            </select>
                        </Box>
                    </HStack>
                    {/* Note: I removed FileUpload since I don't have its exact implementation details */}
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBuildingImage(e.target.files[0])}
                    />
                    {buildingImg && (
                        <Box>
                            <strong>Selected file:</strong> {buildingImg.name}
                        </Box>
                    )}
                    <Button onClick={handleSubmit}>Update Building</Button>
                </VStack>
            </HStack>
        </Container>
    );
};

export default UpdateBuilding;