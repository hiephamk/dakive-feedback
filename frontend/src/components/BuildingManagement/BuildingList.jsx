import {useEffect, useState}from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import { Box , HStack, Image, Flex, Center, Button} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import useOrganization from './OrganizationHook'
import useBuilding from './BuildingHook'

const BuildingList = () => {
    const {user, userInfo} = useSelector(state => state.auth)
    const accessToken = useAccessToken(user)
    // const {buildings} = useBuilding()
    // const {organizations} = useOrganization()
    const navigate = useNavigate()
    const [buildings, setBuildings] = useState([])

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
    

    return (
    <Flex  gap={8} p={6} rounded={7} wrap="wrap">
        {
            buildings && buildings.length > 0 ?
            (
                buildings.map((building) =>(
                    <Box shadow="1px 1px 15px 5px rgb(75, 75, 79)" rounded={8}
                        key={building.id}
                        // onClick={()=> handleClick(building.id)}
                        
                    >
                        <Flex rounded={8} maxW="400px" p={2} m={2}>
                            <Image width="fit" height="200px" src={building.building_img} pr={2} maxH={300} maxW="50%"/>
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
                        </Flex>
                        <Box>

                        </Box>
                        <HStack justifyContent="space-between" p={2}>
                            <Button onClick={()=> handleClickViewRoom(building.id)}>View rooms</Button>
                            <Button onClick={()=> handleClickViewReport(building.id)} >View Report</Button>
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