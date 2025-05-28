import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import {Box, Input, VStack, Button, Center, Heading } from '@chakra-ui/react'
import axios from 'axios'

const useOrganization = (userId) => {
    const {user, userInfo } = useSelector(state=>state.auth)
    const accessToken = useAccessToken(user)
    const [organizations,setOrganizations] = useState([])

    const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
    const url = import.meta.env.VITE_ORGANIZATION_CREATE_URL
    const ListOrganizations = async () => {       
        try {
            const response = await axios.get(url, config)
            console.log("organization list data: ", response.data)
            const filterItem = response.data.filter(item => item.owner === userId)
            setOrganizations(filterItem)

        }catch(error) {
            alert("Cannot list Organizations", error)
        }
    }

    useEffect(()=>{
        if(accessToken, userInfo?.id){
            ListOrganizations()
        }
    },[accessToken, userId])
  return {organizations}
}

export default useOrganization