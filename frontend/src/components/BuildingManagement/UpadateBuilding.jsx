import {useEffect, useState}from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import {Container, Stack, Box, Input,HStack, VStack, Button, Center, Heading, FileUpload, Icon, Flex } from '@chakra-ui/react';
import { Link } from 'react-router'
import { LuUpload } from 'react-icons/lu';
import useOrganization from './OrganizationHook'
import useBuilding from './BuildingHook'

const UpadateBuilding = () => {
    const {user, userInfo} = useSelector(state => state.auth)
    const accessToken = useAccessToken(user)
    const { buildings } = useBuilding()
    const {organizations} = useOrganization()

    // const [buildings, setBuildings] = useState([])
    const [buildingId, setBuildingId] = useState('')
    const [organizationId, setOrganizationId] = useState('')
    const [buildingImg, setBuildingImage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        owner: userInfo?.id|| "",
        organization: organizationId || "",
    });
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleUpdate = async () => {
        if(!accessToken || !userInfo?.id) return
        const url = `${import.meta.env.VITE_BUILDING_UPDATE_URL}${buildingId}`
        try {
            await axios.put(url,formData,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            })
            setFormData({
                name: "",
                street: "",
                city: "",
                state: "",
                country: "",
                postal_code: "",
                owner: userInfo?.id|| "",
                organization: organizationId || "",
            });
        } catch(error){
            console.log("cannot update building", error.message)
            alert("Update building was not successful")
        }
            
    }

  return (
    <Box>
        {buildings.length > 0 ? (
            buildings.map((building) => (
                <VStack  key={building.id}
                    shadow="3px 3px 15px 5px rgb(75, 75, 79)"  p={4} rounded={7} minW="100%">
                    {
                        <Box>
                            <Heading my={4}>Update Building</Heading>
                            <Input type="text" name="name" value={building.name} onChange={handleInputChange} placeholder="Name" />
                            <Input type="text" name="street" value={building.street} onChange={handleInputChange} placeholder="Street" />
                            <Input type="text" name="city" value={building.city} onChange={handleInputChange} placeholder="City" />
                            <Input type="text" name="state" value={building.state} onChange={handleInputChange} placeholder="State" />
                            <Input type="text" name="country" value={building.country} onChange={handleInputChange} placeholder="Country" />
                            <Input type="text" name="postal_code" value={building.postal_code} onChange={handleInputChange} placeholder="Postal Code" />
                            
                            <HStack gap={4} justifyContent="space-between">
                                <label id="organization">Organization: </label>
                                <Box border="1px solid" p={1} rounded={5}>
                                    <select
                                        name="organization"
                                        id="organization"
                                        value={organizationId}
                                        onChange={(e) => setOrganizationId(e.target.value)}
                                    >
                            
                                        {organizations.length>0 ? (organizations.map((org) => (
                                            <option key={org.id} value={org.id}>
                                                {org.name}
                                            </option>
                                        ))):(<option value="">No Organization</option>)
                                        }
                                    </select>
                                </Box>
                            </HStack>
                            {/* File Upload */}
                            {/* <Box>
                                <input
                                    type="file"
                                    id="file"
                                    accept="image/*"
                                    onChange={(e) => setBuildingImage(e.target.files[0])}
                                />
                            </Box> */}
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
                            <Button onClick={handleUpdate}>Update</Button>
                        </Box>
                        // buildingId === building.id && (
                        // )
                    }
                </VStack>
            ))
        ):(<Box>
            <Heading>You have no building.Please create one first</Heading>
        </Box>)

        }
    </Box>
  )
}

export default UpadateBuilding