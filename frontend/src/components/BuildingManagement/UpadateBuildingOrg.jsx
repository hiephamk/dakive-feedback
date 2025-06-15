import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; // Add these imports
import useAccessToken from '../../services/token';
import { Center, Field, FileUpload, Icon, Box, Input, HStack, VStack, Flex, Button, Heading, Textarea } from '@chakra-ui/react';
import { LuUpload } from 'react-icons/lu';
import axios from 'axios';
import useOrganization from '../Organization/OrganizationHook'
import useOrganization_Membership from '../Organization/Organization_Membership_Hook';

const UpdateBuildingOrg = () => {
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
        external_id: ""
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
                    external_id: buildingData.external_id || ""
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
            navigate(`/home/admin/organization/details/${organizationId}`);
        } catch (error) {
            alert(error.name || error.non_field_error)

        }
    };

    return (
        <Box w={"100%"} maxW={'100vw'} mt={10}>
            <Center>
                <VStack w={"70%"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={"7px"}>
                    <Box w={"100%"}>
                        <Center>
                            <Heading my={4}>Update Building</Heading>
                        </Center>
                    </Box>
                    <HStack p={4} rounded={7} minW="100%" gap={4} justifyContent={"space-evenly"}>
                        <VStack>
                            
                            <Field.Root required>
                                <HStack>
                                    <Field.Label w={"200px"}>
                                        Organization: <Field.RequiredIndicator />
                                    </Field.Label>
                                    <HStack gap={2} justifyContent="space-between" w={"100%"} my={"20px"}>
                                        <Box border="1px solid" p={1} rounded={5}>
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
                                </HStack>
                            </Field.Root>
                            <Field.Root required>
                                <HStack>
                                    <Field.Label w={"200px"}>
                                        Name: <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input type="text" name="name" value={formData.name} onChange={handleChange}/>
                                </HStack>
                            </Field.Root>
                            <Field.Root>
                                <HStack>
                                    <Field.Label w={"200px"}>
                                        Building Size:
                                    </Field.Label>
                                    <Input type="text" name="building_size" value={formData.building_size} onChange={handleChange} placeholder="Building Size" />
                                </HStack>
                            </Field.Root>
                            <Field.Root required>
                                <HStack>
                                    <Field.Label w={"200px"}>
                                        Street: <Field.RequiredIndicator/>
                                    </Field.Label>
                                    <Input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" />
                                </HStack>
                            </Field.Root>
                            <Field.Root required>
                                <HStack>
                                    <Field.Label w={"200px"}>
                                        City: <Field.RequiredIndicator/>
                                    </Field.Label>
                                    <Input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                                </HStack>
                            </Field.Root>
                            <Field.Root required>
                                <HStack>
                                    <Field.Label w={"200px"}>
                                        Postal Code: <Field.RequiredIndicator/>
                                    </Field.Label>
                                    <Input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Postal Code" />
                                </HStack>
                            </Field.Root>
                            <Field.Root>
                                <HStack>
                                    <Field.Label w={"200px"}>
                                        State:
                                    </Field.Label>
                                    <Input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                                </HStack>
                            </Field.Root>
                            <Field.Root>
                                <HStack>
                                    <Field.Label w={"200px"}>
                                        Country:
                                    </Field.Label>
                                    <Input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
                                </HStack>
                            </Field.Root>
                            <Field.Root>
                                <HStack>
                                    <Field.Label w={"200px"}>
                                        Description:
                                    </Field.Label>
                                    <Textarea overflow={"auto"} type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Descriptions" />
                                </HStack>
                            </Field.Root>
                
                        </VStack>
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
                    <Button onClick={handleSubmit} my={"20px"}>Create Building</Button>
                </VStack>
            </Center>
        </Box>
    );
};

export default UpdateBuildingOrg;