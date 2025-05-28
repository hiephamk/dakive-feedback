import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import axios from 'axios'

const useBuilding = () => {
    const {user } = useSelector(state=>state.auth)
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
            const res = await axios.get(url, config)
            const buildingFilter = res.data
            // const buildingFilter = res.data.filter(item => item.owner === userId)
            setBuildings(buildingFilter )
          
        }catch(error) {
          if(error.response && error.response.status === 401) {
                alert("Please login again.");
            }else {
                console.error(error);
            }
  
        }
    }

    useEffect(()=>{
        if(accessToken ){
            ListBuildings()
        }
    },[accessToken,])
  
  
    return {buildings}
}

export default useBuilding