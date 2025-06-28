import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../../services/token'
import api from '../../../services/api'
import { Box, VStack, HStack, Input, Button, Heading, Text } from '@chakra-ui/react'

const CreateGroup = ({circleId}) => {
    const {user, userInfo } = useSelector(state => state.auth)
    const accessToken = useAccessToken(user)

    const [formData, setFormData] = useState({
        name: "",
        circle: circleId,
        owner: userInfo.id
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handleCreateGroup = async () => {
        if(!accessToken) return
        const url = import.meta.env.VITE_COMMUNITY_GROUP_CREATE_URL
        try {
            await api.post(url, formData, 
                {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
                }
            )
            alert("Created the group successfully")
            setFormData({
                name:""
            })
        }catch(error){
            console.error("failed to create group", error.response.data || error.message)
        }
    }
  return (
    <HStack>
        <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Group Name" />
        <Button onClick={handleCreateGroup}>Create</Button>
    </HStack>
  )
}

export default CreateGroup