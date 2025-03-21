import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import axios from 'axios'

const useRoom = (buildingId) => {
    const {user } = useSelector(state=>state.auth)

    const accessToken = useAccessToken(user)
    const [rooms,setRooms] = useState([])
    
    const ListOwnerRooms = async () => {       
      const url = import.meta.env.VITE_ROOM_LIST_URL
      try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          })
          const filterItem = response.data.filter((room) => room.building === Number(buildingId))
          if(filterItem.length > 0){

            setRooms(filterItem)
          }else {
            setRooms("")
          }
      }catch(error) {
          console.error("Cannot list user's room", error.response?.data || error.message);
          alert("Cannot list user's room");
      }
    }

    useEffect(()=>{
      if(accessToken && buildingId){
          ListOwnerRooms()
      }
  },[accessToken, buildingId])
  return {rooms}
}

export default useRoom