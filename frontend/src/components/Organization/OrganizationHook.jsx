import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import api from '../../services/api'

const useOrganization = () => {
    const {user, userInfo } = useSelector(state=>state.auth)
    const accessToken = useAccessToken(user)
    const [organizations, setOrganizations] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // const config = {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //       "Content-Type": "application/json",
    //     },
    //   };
    const url = import.meta.env.VITE_ORGANIZATION_LIST_URL

    
    
    const ListOrganizations = async () => {       
        try {
            const response = await api.get(url, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
        },
            })

            const filterItem = response.data
            const sortedItem = filterItem.sort((a, b) => a.id - b.id);
            setOrganizations(sortedItem)

        }catch(error) {
            if(error.response && error.response.status === 401) {
                alert("Please login again.");
            }else {
                console.error(error);
            }
        }
    }

    useEffect(()=>{
        if(accessToken || userInfo?.id){
            ListOrganizations()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[accessToken, userInfo?.id])

    const deleteOrganization = async (id) => {
    if (!accessToken || !userInfo?.id) return false;

    setLoading(true);
    setError(null);

    const url = `${import.meta.env.VITE_ORGANIZATION_DELETE_URL}${id}/`;
    try {
      await api.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      await ListOrganizations()
    //   setOrganizations(organizations.filter((org) => org.id !== id));
        return true
    } catch (err) {
      console.error('Error deleting member:', err);
      setError(err.response?.data?.message || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
    
  const updateOrganization = async (id, data) => {
    if (!accessToken || !userInfo?.id) return false;

    setLoading(true);
    setError(null);
    const url = `${import.meta.env.VITE_ORGANIZATION_UPDATE_URL}${id}/`;
    try {
      const response = await api.put(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      // Update the member in the state
      setOrganizations(
        organizations.map((org) =>
          org.id === id ? { ...org, ...response.data } : org
        )
      );
      return true;
    } catch (err) {
      console.error('Error updating member:', err);
      setError(err.response?.data?.message || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {organizations, error, loading, deleteOrganization, updateOrganization, ListOrganizations}
}

export default useOrganization