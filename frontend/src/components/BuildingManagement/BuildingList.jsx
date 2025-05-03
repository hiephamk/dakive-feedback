
import {useEffect, useState, useRef}from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import {Container, Box , HStack, Image, Flex, Center, Button, Menu, Portal, Dialog, Text, CloseButton, VStack, Stack} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { BsThreeDotsVertical } from "react-icons/bs"
import { BsBuildingsFill } from "react-icons/bs";
import { LuSearch } from "react-icons/lu"



const BuildingList = () => {
    const {user, userInfo} = useSelector(state => state.auth)
    const accessToken = useAccessToken(user)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const navigate = useNavigate()
    const [buildings, setBuildings] = useState([])
    const [organization, setOrganization] = useState('')
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)
    const [building_size, setBuildingSize] = useState('')
    const [building_city, setBuildingCity] = useState('')
    const [building_street, setBuildingStreet] = useState('')
    const [postal_code, setPostalCode] = useState('')
    const [building_name, setBuildingName] = useState('')

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
            if(building_city) {
                fetchedBuilding = fetchedBuilding.filter(item => item.city === building_city)
            }
            if(postal_code) {
                fetchedBuilding = fetchedBuilding.filter(item => item.postal_code === postal_code)
            }
            if(building_street) {
                fetchedBuilding = fetchedBuilding.filter(item => item.street === building_street)
            }
            if(building_size) {
                fetchedBuilding = fetchedBuilding.filter(item => item.building_size === building_size)
            }
            if(building_name) {
                fetchedBuilding = fetchedBuilding.filter(item => item.name === building_name)
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
    },[accessToken, userInfo?.id, building_size, building_city, postal_code, building_street, building_name])

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
            organization: building.organization,
            building_size: building.building_size,
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
    const handleBuildingCityChange = (e) => {
        setBuildingCity(e.target.value);
    }
    const handleBuildingPostalCodeChange = (e) => {
        setPostalCode(e.target.value);
    }
    const handleBuildingStreeChange = (e) => {
        setBuildingStreet(e.target.value);
    }
    const handleBuildingNameChange = (e) => {
        setBuildingName(e.target.value);
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
            <Box marginBottom={"20px"}>
                <HStack gap={"10px"} justifyContent={"space-evenly"}>
                    <Box my={10} p={4} fontSize="18px" fontWeight="bold" border={"1px solid"} rounded={"7px"}>
                        <label htmlFor="city">City: </label>
                        <select
                            value={building_city}
                            onChange={handleBuildingCityChange}
                            id='city'
                        >
                            <option value="">All Cities</option>
                            {[...new Set((Array.isArray(buildings) ? buildings : []).map(building => building.city))].map((uniqueBuildingCity, idx) => (
                                <option key={idx} value={uniqueBuildingCity}>
                                    {uniqueBuildingCity}
                                </option>
                            ))}
                        </select>
                    </Box>
                    <Box my={10} p={4} fontSize="18px" fontWeight="bold" border={"1px solid"} rounded={"7px"}>
                        <label htmlFor="postal_code">Postcode: </label>
                        <select
                            value={postal_code}
                            onChange={handleBuildingPostalCodeChange}
                            id='postal_code'
                        >
                            <option value="">All Postcodes</option>
                            {[...new Set((Array.isArray(buildings) ? buildings : []).map(building => building.postal_code))].map((uniquePostalCode, idx) => (
                                <option key={idx} value={uniquePostalCode}>
                                    {uniquePostalCode}
                                </option>
                            ))}
                        </select>
                    </Box>
                    <Box my={10} p={4} fontSize="18px" fontWeight="bold" border={"1px solid"} rounded={"7px"}>
                        <label htmlFor="building_street">Street: </label>
                        <select
                            value={building_street}
                            onChange={handleBuildingStreeChange}
                            id='building_street'
                        >
                            <option value="">All Streets</option>
                            {[...new Set((Array.isArray(buildings) ? buildings : []).map(building => building.street))].map((uniqueStreet, idx) => (
                                <option key={idx} value={uniqueStreet}>
                                    {uniqueStreet}
                                </option>
                            ))}
                        </select>
                    </Box>
                    <Box my={10} p={4} fontSize="18px" fontWeight="bold" border={"1px solid"} rounded={"7px"}>
                        <label htmlFor="size">Size: </label>
                        <select
                            value={building_size}
                            onChange={handleBuildingSizeChange}
                            id='size'
                        >
                            <option value="">All Size</option>
                            {[...new Set((Array.isArray(buildings) ? buildings : []).map(building => building.building_size))].map((uniqueBuildingSize, idx) => (
                                <option key={idx} value={uniqueBuildingSize ? `${uniqueBuildingSize}` : "N/A"}>
                                    {uniqueBuildingSize ? `${uniqueBuildingSize}` : "N/A"}
                                </option>
                            ))}
                        </select>
                    </Box>
                    <Box my={10} p={4} fontSize="18px" fontWeight="bold" border={"1px solid"} rounded={"7px"}>
                        <label htmlFor="name">Name: </label>
                        <select
                            value={building_name}
                            onChange={handleBuildingNameChange}
                            id='name'
                        >
                            <option value="">All Names</option>
                            {[...new Set((Array.isArray(buildings) ? buildings : []).map(building => building.name))].map((uniqueBuildingName, idx) => (
                                <option key={idx} value={uniqueBuildingName}>
                                    {uniqueBuildingName}
                                </option>
                            ))}
                        </select>
                    </Box>
                </HStack>
                <form onSubmit={handleBuildingSearch}>
                    <Center>
                        <HStack gap={"10px"} alignItems={"center"}>
                            <label htmlFor="search">Search Building: </label>
                                <input
                                    id='search'
                                    type="search"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onkeydown={handleKeyDown}
                                    placeholder="Enter keyword to search"
                                    style={{border:"1px solid", borderRadius:"7px", padding:"5px", minWidth:"200px", maxWidth:"400px"}}
                                />
                        </HStack>
                    </Center>
                </form>
            </Box>

            <Flex p={4} wrap={"wrap"} justifyContent={"space-evenly"} alignItems={"center"}>
                {
                    buildings && buildings.length > 0 ? (
                        buildings.map((building) => (
                            <Box shadow="1px 1px 15px 5px rgb(75, 75, 79)" rounded={8} key={building.id} w={"300px"} h={"470px"} my={"10px"}>
                                <Flex rounded={8} maxW="400px" p={2} m={2} justifyContent="space-between">
                                    <VStack>
                                            <Image p={"2px"} bg={"white"} mx={"auto"} w="auto" border={"1px solid"} rounded={"5px"} height="150px" src={building.building_img || '/building.png'}/>
                                        <Box>
                                            <Box pl={2}>
                                                <Box fontWeight="bold" fontSize="18px">Name: {building.name}</Box>
                                                {building.organization_name ? (
                                                    <Box>Owner: {building.organization_name}</Box>
                                                ):(
                                                    <Box>Owner: {building.owner_name}</Box>
                                                )}
                                                <Box>Size: {building.building_size ? `${building.building_size}` : "N/A"}</Box>
                                                <Box>Street: {building.street}</Box>
                                                <Box>City: {building.city}</Box>
                                                <Box>Postal Code: {building.postal_code}</Box>
                                                <Box>Country: {building.country}</Box>
                                                <Box>Descriptions: {building.description}</Box>
                                            </Box>
                                        </Box>
                                    </VStack>
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
