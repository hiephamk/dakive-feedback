import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../../services/token'
import api from '../../../services/api'
import { Box, VStack, HStack, Input, Button, Heading, Text } from '@chakra-ui/react'

const useListGroups = () => {
    const {user, userInfo } = useSelector(state => state.auth)
    const accessToken = useAccessToken(user)

    const [groups, setGroups ] = useState([])
    const handleFetchGroup = async () => {
        if(!accessToken) return
        const url = import.meta.env.VITE_COMMUNITY_GROUP_LIST_URL
        try {
            const res = await api.get(url,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            let groupItems = res.data
            groupItems = groupItems.filter(item => item.owner === userInfo?.id)
            setGroups(groupItems)
        }catch(error){
            console.error("cannot fetch group", error.response?.data || error.message)
        }
    }
    useEffect(() => {
        if(accessToken && userInfo){
            handleFetchGroup()
        }
    },[accessToken, userInfo?.id])

  return {groups}
}

export default useListGroups