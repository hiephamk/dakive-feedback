import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../../services/token'
import api from '../../../services/api'
import { Box, VStack, HStack, Input, Button, Heading, Text } from '@chakra-ui/react'

const useGroupMember = () => {
    const {user, userInfo } = useSelector(state => state.auth)
    const accessToken = useAccessToken(user)

    const [groupMembers, setGroupMembers ] = useState([])

    const handleFetchGroupMember = async () => {
        if(!accessToken) return
        const url = import.meta.env.VITE_COMMUNITY_GROUP_MEMBER_LIST_URL
        console.log("url group member:", url)
        try {
            const res = await api.get(url,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            let groupItems = res.data
            // groupItems = groupItems.filter(item => item.group === userInfo?.id)
            setGroupMembers(groupItems)
        }catch(error){
            console.error("cannot fetch group", error.response?.data || error.message)
        }
    }
    useEffect(() => {
        if(accessToken && userInfo){
            handleFetchGroupMember()
        }
    },[accessToken, userInfo?.id])

  return {groupMembers}
}

export default useGroupMember