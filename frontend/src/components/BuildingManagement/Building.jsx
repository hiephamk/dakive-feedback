import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import {Container, Stack, Box, Input,HStack, VStack, Button, Center, Heading, FileUpload, Icon, Flex } from '@chakra-ui/react';
import axios from 'axios';
import useOrganization from '../Organization/OrganizationHook';
import { LuUpload } from 'react-icons/lu';
import { useNavigate } from 'react-router';
import useOrganization_Membership from '../Organization/Organization_Membership_Hook';

const Building = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    const navigate = useNavigate()

    // Fetch organizations
    const { organizations } = useOrganization();
    const { members } = useOrganization_Membership()

    const [organizationId, setOrganizationId] = useState('');
    const [buildingImg, setBuildingImage] = useState(null);

    const generateRandom = (length = 8) => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };
    useEffect(()=> {
        generateRandom()
    },[])

    const [formData, setFormData] = useState({
        name: "",
        building_size: "",
        street: "",
        city: "",
        state: "",
        country: "Finland",
        postal_code: "",
        description: "",
        owner: userInfo?.id|| "",
        organization: organizationId || "",
        external_id: generateRandom()
    });

    useEffect(() => {
        setFormData((prev) => ({ ...prev, organization: organizationId }));
    }, [organizationId]);

    const url = import.meta.env.VITE_BUILDING_CREATE_URL;

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
            organization: "Organization Name",
        };
        for (const field in requiredFields){
            if (!formData[field]){
                alert(`Please fill in the required field: ${requiredFields[field]}`)
                return
            }
        }
        // Create FormData object
        const formDataToSend = new FormData();
        
        // Append text fields
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        // Append file if selected
        if (buildingImg) {
            formDataToSend.append("building_img", buildingImg);
        }

        try {
             await axios.post(url, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Created building successfully");

            // Reset form and image state
            setFormData({
                name: "",
                building_size: "",
                street: "",
                city: "",
                state: "",
                country: "",
                postal_code: "",
                description:"",
                owner: userInfo?.id || "",
                organization: organizationId || "",
                external_id: generateRandom(),
            });
            setBuildingImage(null);
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
        <Container justifyContent="center" mt={10}>
            <VStack>
                <HStack  shadow="3px 3px 15px 5px rgb(75, 75, 79)"  p={4} rounded={7} minW="100%" gap={4} justifyContent={"space-evenly"}>
                    <Box w={"70%"}>
                        <Heading my={4}>Create New Building</Heading>
                        <HStack gap={2} justifyContent="space-between" w={"100%"} my={"20px"}>
                            <label id="organization"><Heading>Organization: </Heading></label>
                            <Center border="1px solid" p={1} rounded={5} w={"100%"}>
                                <select
                                    name="organization"
                                    id="organization"
                                    value={organizationId}
                                    onChange={(e) => setOrganizationId(e.target.value)}
                                >
                                    <option>Choose an organization</option>
                                    {members
                                    .filter(member => member.user === userInfo?.id && member.is_admin)
                                    .map(member => (
                                        <Box key={member.id}>
                                            {organizations.length > 0 ? (
                                                organizations
                                                .filter(org => org.id === member.organization)
                                                .map((org) => (
                                                    <option key={org.id} value={org.id}>
                                                        {org.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">No Organization</option>
                                            )}
                                        </Box>
                                    ))
                                    }
                                </select>
                            </Center>
                        </HStack>
                        <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                        <Input type="text" name="building_size" value={formData.building_size} onChange={handleChange} placeholder="Building Size" />
                        <Input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" />
                        <Input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                        <Input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                        <Input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
                        <Input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Postal Code" />
                        <Input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Descriptions" />
                        
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
                <Button onClick={handleSubmit} my={"20px"}>Create</Button>
            </VStack>
        </Container>
    );
};

export default Building;
