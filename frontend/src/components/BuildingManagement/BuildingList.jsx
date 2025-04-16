
import {useEffect, useState}from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import { Container, Box , HStack, Image, Flex, Center, Button, Menu, Portal, Dialog, Text} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { BsThreeDotsVertical } from "react-icons/bs"
import { CloseButton } from '@chakra-ui/react'


const BuildingList = () => {
    const {user, userInfo} = useSelector(state => state.auth)
    const accessToken = useAccessToken(user)

    const navigate = useNavigate()
    const [buildings, setBuildings] = useState([])
    const [organizationId, setOrganizationId] = useState('')
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)
    const [building_size, setBuildingSize] = useState('')

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
            let fetchedBuilding = Array.isArray(res.data) ? res.data : [];
            if(building_size) {
                fetchedBuilding = fetchedBuilding.filter(item => item.building_size === Number(building_size))
            }
            setBuildings(fetchedBuilding)
        }catch(error){
            alert("Cannot list the building", error.response?.data || error.message)
        }
    }

    useEffect(()=>{
        if(accessToken && userInfo?.id){
            ListBuilding()
        }
    },[accessToken, userInfo?.id, building_size])

    const handleClickViewRoom = (buildingId) => {
        navigate(`/home/management/room-list/${buildingId}`)
    }

    const handleClickViewReport = (buildingId) => {
        navigate(`/home/management/building-reports/${buildingId}`)
    }

    const handleUpdateBuilding = (building) => {
        navigate(`/home/management/building/update/${building}`)
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
        }catch(error){
            alert("Cannot delete building", error.response?.data || error.message)
        }
    }

    const handleDuplicateBuilding = async (building) => {
        const url = import.meta.env.VITE_BUILDING_CREATE_URL
        const duplicatedData = {
            name: `${building.name} Copy`,
            owner: building.owner,
            organization_id: building.organization_id,
            // building_size: building.building_size,
            street: building.street,
            city: building.city,
            state: building.state,
            postal_code: building.postal_code,
            country: building.country,
            description: building.description,
            // building_img: building.building_img
        }

        try {
            const res = await axios.post(url, duplicatedData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            })
            setBuildings(prev => [...prev, res.data])
            alert("Building duplicated successfully!")
        } catch (error) {
            console.error("Error duplicating building:", error);
            alert("Failed to duplicate building. Please try again.");
        }
    }

    const handleBuildingSizeChange = (e) => {
        setBuildingSize(e.target.value);
    }

    const handleBuildingSearch = async (e) => {
        e.preventDefault();
        const searchKeyword = keyword.trim()
        if (!searchKeyword) {
            alert("Please enter a keyword to search.")
            return
        }
        setLoading(true)
        const url = `${import.meta.env.VITE_BUILDING_SEARCH_URL}?keyword=${keyword}`
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        try {
            const res = await axios.get(url, config);
            let searchfilter = Array.isArray(res.data) ? res.data : [];
            if(building_size) {
                searchfilter = searchfilter.filter(item => item.building_size === Number(building_size))
            }
            setBuildings(searchfilter)
        } catch (error) {
            console.error("Error searching building:", error);
            alert("Cannot search this building name. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (event) => {
        if (event && event.key === "Enter") {
            event.preventDefault();
            handleBuildingSearch();
        }
    };

    return (
        <Container>
            <Box>
                <HStack gap={"10px"}>
                    <Box my={10} p={4} fontSize="18px" fontWeight="bold">
                        <label htmlFor="size">Building Size: </label>
                        <select
                            value={building_size}
                            onChange={handleBuildingSizeChange}
                            id='size'
                        >
                            <option value="">All Size</option>
                            {[...new Set((Array.isArray(buildings) ? buildings : []).map(building => building.building_size))].map((uniqueBuildingSize, idx) => (
                                <option key={idx} value={uniqueBuildingSize}>
                                    {uniqueBuildingSize}
                                </option>
                            ))}
                        </select>
                    </Box>
                    <HStack gap={"10px"}>
                        <form onSubmit={handleBuildingSearch}>
                            <label htmlFor="search">Search Building: </label>
                            <input
                                id='search'
                                type="search"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter keyword to search"
                                style={{border:"1px solid", borderRadius:"7px", padding:"5px"}}
                            />
                            <Button type="submit" mx={"10px"}>Search</Button>
                        </form>
                    </HStack>
                </HStack>
            </Box>

            <Flex gap={8} p={4} rounded={7} wrap="wrap">
                {
                    buildings && buildings.length > 0 ? (
                        buildings.map((building) => (
                            <Box shadow="1px 1px 15px 5px rgb(75, 75, 79)" rounded={8} key={building.id}>
                                <Flex rounded={8} maxW="400px" p={2} m={2} justifyContent="space-between">
                                    <Image w="40%" height="200px" src={building.building_img} pr={2} maxH={300} maxW="50%"/>
                                    <Center>
                                        <Box pl={2}>
                                            <Box fontWeight="bold" fontSize="18px">Name: {building.name}</Box>
                                            {building.organization_name ? (
                                                <Box>Owner: {building.organization_name}</Box>
                                            ):(
                                                <Box>Owner: {building.owner_name}</Box>
                                            )}
                                            <Box>Building-Size: {building.building_size} rooms</Box>
                                            <Box>Street: {building.street}</Box>
                                            <Box>City: {building.city}</Box>
                                            <Box>Postal Code: {building.postal_code}</Box>
                                            <Box>Country: {building.country}</Box>
                                            <Box>Descriptions: {building.description}</Box>
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
                                                                <Button variant="outline" size="xs">Delete</Button>
                                                            </Dialog.Trigger>
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            <Button variant="outline" size="xs" onClick={() => handleDuplicateBuilding(building)}>Duplicate</Button>
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
                    ) : (
                        <Box>
                            <Box>You have no building. </Box>
                            <Link to="/home/management/add_building">Create your own Building</Link>
                        </Box>
                    )
                }
            </Flex>
        </Container>
    )
}

export default BuildingList
