import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; // Add these imports
import useAccessToken from '../../services/token';
import { FileUpload,Icon, Box, Input, HStack, VStack, Button, Heading, Textarea } from '@chakra-ui/react';
import { LuUpload } from 'react-icons/lu';
import axios from 'axios';
import useOrganization from '../Organization/OrganizationHook'
import useOrganization_Membership from '../Organization/Organization_Membership_Hook';

const UpdateBuilding = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    const { buildingId } = useParams(); // Get building ID from URL params
    const navigate = useNavigate(); // For navigation after update
    const { organizations } = useOrganization();
    const { members } = useOrganization_Membership()

    console.log('organization_hook', organizations)

    const [organizationId, setOrganizationId] = useState('');
    const [buildingImg, setBuildingImage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        building_size:"",
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        description: "",
        buildingImg: "",
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
                    building_size: buildingData.building_size || "",
                    street: buildingData.street || "",
                    city: buildingData.city || "",
                    state: buildingData.state || "",
                    country: buildingData.country || "",
                    postal_code: buildingData.postal_code || "",
                    description: buildingData.description || "",
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
            // building_size: "Building Size",
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
            if(error.response && error.response.status === 401) {
                alert("Please login again.");
            }else {
                console.error(error);
            }
        }
    };

    return (
        <Box w={"100%"} maxW={'100vw'} mt={10}>
            <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={4} rounded={7} w={"60%"} mx={"auto"}>
                <HStack w={"100%"} justifyContent={"space-evenly"} px={"20px"}>
                    <Box w={"60%"}>
                        <Heading my={4}>Update Building</Heading>
                        <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                        <Input type="text" name="building_size" value={formData.building_size} onChange={handleChange} placeholder="Building Size" />
                        <Input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" />
                        <Input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                        <Input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                        <Input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
                        <Input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Postal Code" />
                        <Textarea type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Descriptions" />
                        <HStack gap={4} justifyContent="flex-start">
                            <label id="organization">Organization</label>
                            <Box border="1px solid" p={1} rounded={5} w={"50%"}>
                                <select
                                    name="organization"
                                    id="organization"
                                    value={organizationId}
                                    onChange={(e) => setOrganizationId(e.target.value)}
                    
                                >
                                    <option value="">Choose an organization</option>
                                    {members
                                    .filter(member => member.user === userInfo?.id && member.role !== "viewer")
                                    .map(member => organizations
                                            .filter(org => org.id === member.organization)
                                            .map(org => (
                                                <option key={org.id} value={org.id}>{org.name}</option>
                                            ))
                                    )}
                                </select>
                            </Box>
                        </HStack>
                    </Box>
                    <Box>
                    <Box>
                        <FileUpload.Root
                            maxW="xl"
                            alignItems="stretch"
                            maxFiles={1}
                            type="file"
                            id="file"
                            accept="image/*"
                            onChange={(a) => setBuildingImage(a.target.files[0])}
                            >
                            <FileUpload.HiddenInput />
                            <FileUpload.Dropzone>
                                <Icon size="lg" color="fg.muted">
                                <LuUpload />
                                </Icon>
                                <FileUpload.DropzoneContent>
                                    <Box>Drag and drop files here</Box>
                                    <Box color="fg.muted">up to 5MB</Box>
                                </FileUpload.DropzoneContent>
                            </FileUpload.Dropzone>
                            <FileUpload.List />
                        </FileUpload.Root>
                    </Box>
                    {buildingImg && (
                        <Box>
                            <strong>Selected file:</strong> {buildingImg.name}
                        </Box>
                    )}
                </Box>
                </HStack>
                
                <Button onClick={handleSubmit}>Update Building</Button>
            </VStack>
        </Box>
    );
};

export default UpdateBuilding;