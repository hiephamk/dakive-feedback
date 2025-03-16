import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import axios from 'axios'

const useRoom = (userId) => {
    const {user, userInfo } = useSelector(state=>state.auth)
    const accessToken = useAccessToken(user)
    const [rooms,setRooms] = useState([])
    

    const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
    const url = import.meta.env.VITE_ROOM_LIST_URL
    const ListOwnerRooms = async () => {       
        try {
            const response = await axios.get(url, config)
            console.log("owner room list data: ", response.data)
            const filterItem = response.data.filter((room) => room.owner === userId)
            setRooms(filterItem)
        }catch(error) {
            console.error("Cannot list user's room", error.response?.data || error.message);
            alert("Cannot list user's room");
        }
    }

    useEffect(()=>{
        if(accessToken && userInfo?.id){
            ListOwnerRooms()
        }
    },[accessToken, userId])
  return {rooms}
}

export default useRoom