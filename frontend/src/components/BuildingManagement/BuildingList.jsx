import {useEffect, useState}from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import { Box , HStack, Image, Flex, Center, Button, Menu, Portal, Dialog, Text} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { BsThreeDotsVertical } from "react-icons/bs"
import { CloseButton } from '@chakra-ui/react'


const BuildingList = () => {
    const {user, userInfo} = useSelector(state => state.auth)
    const accessToken = useAccessToken(user)

    const navigate = useNavigate()
    const [buildings, setBuildings] = useState([])
    const [organizationId, setOrganizationId] = useState('')

    const ListBuilding = async()=>{
        if(!accessToken || !userInfo?.id) return
        const url = import.meta.env.VITE_BUILDING_LIST_URL
        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            })
            const buildings = res.data.filter(building => building.owner === userInfo.id)
            setBuildings(buildings)
        }catch(error){
            alert("Cannot list the building", error.response?.data || error.message)
        }
    }

    useEffect(()=>{
        if(accessToken && userInfo?.id){
            ListBuilding()
        }
    },[accessToken, userInfo?.id])

    const handleClickViewRoom = (buildingId) => {
        navigate(`/management/room-list/${buildingId}`)
    }
    const handleClickViewReport = (buildingId) => {
        navigate(`/management/building-reports/${buildingId}`)
    }
    
    const handleUpdateBuilding = (building) => {
        navigate(`/management/building/update/${building}`)
    }
    const handleDeleteBuilding = (building) => {
        if(!accessToken || !userInfo?.id) return
        const url = `${import.meta.env.VITE_BUILDING_UPDATE_URL}${building}/`
        try {
            axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            })
            .then(() =>{
                setBuildings(buildings.filter(post => post.id !== building))
            })
            setBuildings(buildings)
        }catch(error){
            alert("Cannot delete building", error.response?.data || error.message)
        }
    }
    return (
    <Flex  gap={8} p={4} rounded={7} wrap="wrap">
        {
            buildings && buildings.length > 0 ?
            (
                buildings.map((building) =>(
                    <Box shadow="1px 1px 15px 5px rgb(75, 75, 79)" rounded={8}
                        key={building.id}                    
                    >
                        <Flex rounded={8} maxW="400px" p={2} m={2} justifyContent="space-between">
                            <Image w="40%" height="200px" src={building.building_img} pr={2} maxH={300} maxW="50%"/>
                            <Center>
                                <Box pl={2}>
                                    <Box fontWeight="bold" fontSize="18px">Name: {building.name}</Box>
                                    {buildings.organization_name ? (
                                        <Box>Owner: {building.organization_name}</Box>                                 
                                    ):(
                                        <Box>Owner: {building.owner_name}</Box>

                                    )}
                                    <Box>Street: {building.street}</Box>
                                    <Box>City: {building.city}</Box>
                                    <Box>Postal Code: {building.postal_code}</Box>
                                    <Box>Country: {building.country}</Box>
                                </Box>
                            </Center>
                            <Box mx="18px">
                                <Dialog.Root size="xs">
                                <Menu.Root>
                                    <Menu.Trigger asChild>
                                        <Button variant="ghost" size="xs">
                                            <BsThreeDotsVertical />
                                        </Button>
                                    </Menu.Trigger>
                                    <Portal>
                                        <Menu.Positioner>
                                            <Menu.Item>
                                                <Button variant="outline" size="xs" onClick={() => handleUpdateBuilding(building.id)}>Update</Button>
                                            </Menu.Item>
                                            <Menu.Item>
                                            <Dialog.Trigger asChild>
                                        <Button variant="outline" size="xs">
                                            Delete
                                        </Button>
                                    </Dialog.Trigger>
                                            </Menu.Item>
                                        </Menu.Positioner>
                                    </Portal>
                                </Menu.Root>
                                    <Portal>
                                        <Dialog.Backdrop />
                                        <Dialog.Positioner>
                                        <Dialog.Content>
                                            <Dialog.Header>
                                            <Dialog.Title>Delete Building</Dialog.Title>
                                            </Dialog.Header>
                                            <Dialog.Body>
                                                <Text>Do you really want to delete the building?</Text>
                                            </Dialog.Body>
                                            <Dialog.Footer>
                                            <Dialog.ActionTrigger asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </Dialog.ActionTrigger>
                                            <Button onClick={()=>{handleDeleteBuilding(building.id)}}>Delete</Button>
                                            </Dialog.Footer>
                                            <Dialog.CloseTrigger asChild>
                                            <CloseButton size="sm" />
                                            </Dialog.CloseTrigger>
                                        </Dialog.Content>
                                        </Dialog.Positioner>
                                    </Portal>
                                    </Dialog.Root>
                            </Box>
                        </Flex>
                        <HStack justifyContent="space-between" p={2}>
                            <Button variant="outline" size="xs" onClick={()=> handleClickViewRoom(building.id)}>View rooms</Button>
                            <Button variant="outline" size="xs" onClick={()=> handleClickViewReport(building.id)} >View Report</Button>
                        </HStack>
                    </Box>
                ))
            ):(
                <Box>
                    <Box>You have no building. </Box> 
                    <Link to ="/management/add_building">Create your own Building</Link>
                </Box>
            )
        }
    </Flex>
  )
}

export default BuildingList