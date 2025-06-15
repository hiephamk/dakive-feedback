import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import {Container, Stack, Box, Input,HStack, VStack, Button, Center, Heading, FileUpload, Icon, Flex, Textarea, Field } from '@chakra-ui/react';
import api from '../../services/api';
import useOrganization from '../Organization/OrganizationHook';
import { LuUpload } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router';
import useOrganization_Membership from '../Organization/Organization_Membership_Hook';



const CreateBuildingOrg = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    const navigate = useNavigate()
    const { orgId } = useParams()

    // Fetch organizations
    const { organizations } = useOrganization();
    const { members } = useOrganization_Membership()

    const [organizationId, setOrganizationId] = useState('');
    const [buildingImg, setBuildingImage] = useState(null);

    const generateRandom = (length = 8) => {
        return Math.random().toString(36).substring(2, 2 + length)
    }
    const [formData, setFormData] = useState({
        name: "",
        building_size: "",
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        description: "",
        owner: userInfo?.id|| "",
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
            // country: "Country",
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
             await api.post(url, formDataToSend, {
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
            });
            setBuildingImage(null);
            navigate(`/home/admin`, { state: { shouldRefresh: true } })
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
            <Center>
                <VStack w={"70%"}>
                    <HStack p={4} rounded={7} minW="100%" gap={4} justifyContent={"space-evenly"}>
                        <VStack>
                            <Heading my={4}>Create New Building</Heading>
                            <Field.Root required>
                                <HStack>
                                    <Field.Label w={"200px"}>
                                        Organization: <Field.RequiredIndicator />
                                    </Field.Label>
                                    <HStack gap={2} justifyContent="space-between" w={"100%"} my={"20px"}>
                                        <Center border="1px solid" p={1} rounded={5}>
                                            <select
                                                name="organization"
                                                id="organization"
                                                value={organizationId}
                                                onChange={(e) => setOrganizationId(e.target.value)}
                                            >
                                                <option>Choose an organization</option>
                                                {members
                                                .filter(member => member.user === userInfo?.id && member.role === "editor" && member.organization === Number(orgId))
                                                .map(member => (
                                                    <option key={member.id} value={member.organization}>{member.organization_name}</option>
                                                ))
                                                }
                                            </select>
                                        </Center>
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
        </Container>
    );
};

export default CreateBuildingOrg;
