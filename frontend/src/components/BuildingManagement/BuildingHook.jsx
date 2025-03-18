import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import axios from 'axios'

const useBuilding = () => {
    const {user, userInfo } = useSelector(state=>state.auth)
    const accessToken = useAccessToken(user)
    const [buildings,setBuildings] = useState([])
    

    const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
    const url = import.meta.env.VITE_BUILDING_LIST_URL
    console.log("URL:", url)
    const ListBuildings = async () => {       
      if(!accessToken) return
        try {
            const response = await axios.get(url, config)
            console.log("Building list data: ", response.data)
            setBuildings(response.data)
            
        }catch(error) {
          console.error("list building error:", error.response?.data || error.message);
          alert("Cannot list buildings");
  
        }
    }

    useEffect(()=>{
        if(accessToken && userInfo?.id){
            ListBuildings()
        }
    },[accessToken, userInfo?.id])
  return {buildings}
}

export default useBuilding