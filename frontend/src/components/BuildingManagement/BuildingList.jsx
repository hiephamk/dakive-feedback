
import {useEffect, useState, useRef}from 'react'
import api from '../../services/api'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import {Container, Table,  Input, InputGroup, Box , HStack, Image, Flex, Center, Button, Menu, Portal, Dialog, Text, CloseButton, VStack, Stack} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { BsThreeDotsVertical } from "react-icons/bs"
import { BsBuildingsFill } from "react-icons/bs";
import { LuSearch } from "react-icons/lu"
import useOrganization_Membership from '../Organization/Organization_Membership_Hook'



const BuildingList = () => {
    const {user, userInfo} = useSelector(state => state.auth)
    const accessToken = useAccessToken(user)
    const { members} = useOrganization_Membership()

    const inputRef = useRef<HTMLInputElement | null>(null)
    
    console.log("member_org:", members)


    const navigate = useNavigate()
    const [buildings, setBuildings] = useState([])
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
            const res = await api.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            })
            let fetchedBuilding = Array.isArray(res.data) ? res.data : [];
            console.log("Fetched buildings:", fetchedBuilding);
            // fetchedBuilding = fetchedBuilding.find(item => item.organization === organization)
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
            if(error.response && error.response.status === 401) {
                alert("Please login again.");
            }else {
                console.error(error);
            }
        }
    }

    useEffect(()=>{
        if(accessToken && userInfo?.id){
            ListBuilding()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            api.delete(url, {
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
            const res = await api.post(url, duplicatedData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            })
            setBuildings(prev => [...prev, res.data])
            alert("Building duplicated successfully!")
        } catch (error) {
            console.error("Error duplicating building:", error);
            if(error.response.data === 401) {

                alert("Please login again.");
            }
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

    const handleClearFilter = () => {
        setBuildingName("");
        setBuildingStreet("");
        setPostalCode("");
        setBuildingCity("");
        setBuildingSize("");
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
            const res = await api.get(url, config);
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
    const handleKeywordChange = (e) => {
      const value = e.target.value;
      setKeyword(value);

      // When keyword is cleared (e.g. backspace to empty), fetch all
      if (value.trim() === "") {
          handleBuildingSearch(); // Call without event
      }
    };

    useEffect(() => {
      if (keyword.trim() === "") {
          ListBuilding();
      }
    }, [keyword]);

    const endElement = keyword ? (
      <CloseButton
        size="xs"
        onClick={() => {
          setKeyword("")
          inputRef.current?.focus()
        }}
        me="-2"
      />
    ) : undefined

    return (
        <Box w="100%" maxW={"100vw"}>
            <Box>
                <HStack gap={"10px"} justifyContent={"space-evenly"}>
                    <Box my={10} p={4} fontSize="16px" border={"1px solid"} rounded={"7px"}>
                        <label htmlFor="city"></label>
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
                    <Box my={10} p={4} fontSize="16px" border={"1px solid"} rounded={"7px"}>
                        <label htmlFor="postal_code"></label>
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
                    <Box my={10} p={4} fontSize="16px" border={"1px solid"} rounded={"7px"}>
                        <label htmlFor="building_street"></label>
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
                    <Box my={10} p={4} fontSize="16px" border={"1px solid"} rounded={"7px"}>
                        <label htmlFor="size"></label>
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
                    <Box my={10} p={4} fontSize="16px" border={"1px solid"} rounded={"7px"}>
                        <label htmlFor="name"></label>
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
                    <Box>
                        <Button onClick={handleClearFilter}>Clear</Button>
                    </Box>
                </HStack>
                <Center>
                    <form onSubmit={handleBuildingSearch} >
                        <InputGroup p={"10px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" flex="1" startElement={<LuSearch />} endElement={endElement} rounded={"7px"}>
                            <Input 
                            // ref={inputRef}
                            id='search'
                            type="search"
                            value={keyword}
                            onChange={handleKeywordChange}
                            // onChange={(e) => setKeyword(e.target.value)}
                            onkeydown={handleKeyDown}
                            placeholder="Enter keyword to search"
                            w={"300px"}
                            />
                        </InputGroup>
                    </form>
                </Center>
            </Box>
            <Flex p={4} wrap={"wrap"} justifyContent={"space-evenly"} alignItems={"center"}>
                {
                    buildings.length > 0 ? (
                        buildings.map((building) => (     
                        <Box key={building.id}>
                            <Box>
                                {members
                                ?.filter(item => item.organization === building.organization && item.user === userInfo?.id)
                                .map((item) => (
                                    
                                <Box key={item.id} >
                                    <Box shadow="1px 1px 15px 5px rgb(75, 75, 79)" rounded={8} key={building.id} 
                                        w={"300px"} h={"470px"} my={"10px"}>
                                        <VStack>
                                            <Flex justifyContent={"space-between"} p={"10px"} w={"100%"}>
                                                 <Image p={"2px"} bg={"white"} w="85%" rounded={"5px"} height="150px" src={building.building_img || '/building.png'}/>
                                                <Box>
                                                    <Dialog.Root size="xs">
                                                        
                                                        {item.role === "editor" ? (<Menu.Root>
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
                                                        </Menu.Root>):("")}
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
                                            <Box pl={2} h="220px" overflow={"auto"} mt={"10px"} maxW={"300px"}>
                                                <Table.Root showColumnBorder>
                                                    <Table.Body>
                                                        <Table.Row>
                                                            <Table.Cell fontWeight="bold" fontSize="18px" >Name</Table.Cell>
                                                            <Table.Cell fontWeight="bold" fontSize="18px" whiteSpace={"normal"} maxW={"160px"}>{building.name}</Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row>
                                                            <Table.Cell>Organization</Table.Cell>
                                                            <Table.Cell whiteSpace={"normal"} maxW={"160px"}>{building.organization}</Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row>
                                                            <Table.Cell>Size</Table.Cell>
                                                            <Table.Cell whiteSpace={"normal"} maxW={"160px"}>{building.size}</Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row>
                                                            <Table.Cell>Street</Table.Cell>
                                                            <Table.Cell whiteSpace={"normal"} maxW={"160px"}>{building.street}</Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row>
                                                            <Table.Cell>City</Table.Cell>
                                                            <Table.Cell whiteSpace={"normal"} maxW={"160px"}>{building.city}</Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row>
                                                            <Table.Cell>Post-Code</Table.Cell>
                                                            <Table.Cell whiteSpace={"normal"} maxW={"160px"}>{building.postal_code}</Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row>
                                                            <Table.Cell>Country</Table.Cell>
                                                            <Table.Cell whiteSpace={"normal"} maxW={"160px"}>{building.country}</Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row>
                                                            <Table.Cell>Description</Table.Cell>
                                                            <Table.Cell whiteSpace={"normal"} maxW={"160px"}>{building.description}</Table.Cell>
                                                        </Table.Row>
                                                    </Table.Body>
                                                </Table.Root>
                                            </Box>
                                        </VStack>
                                        <HStack justifyContent="space-between" p={2}>
                                            <Button variant="outline" size="xs" onClick={()=> handleClickViewRoom(building.id)}>View rooms</Button>
                                            <Button variant="outline" size="xs" onClick={()=> handleClickViewReport(building.id)} >View Report</Button>
                                        </HStack>
                                    </Box>

                                </Box>
                                ))}
                            </Box>
                            
                        </Box>

                        ))
                    ) : (
                        <Box>
                            <Box>You have no building. </Box>
                            {members
                            .find(member => member.user === userInfo?.id && member.is_admin) ?  (<Link to="/home/management/add_building">Create your own Building</Link>):("")

                        }
                            
                        </Box>
                    )
                }
            </Flex>
        </Box>
    )
}

export default BuildingList
