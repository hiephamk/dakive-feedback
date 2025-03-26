import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import {Box, Input, VStack, Button, Center, Heading, Container } from '@chakra-ui/react'
import axios from 'axios'

const Organizations = () => {
    const {user, userInfo } = useSelector(state=>state.auth)
    const accessToken = useAccessToken(user)
    const [Organizations,setOrganizations] = useState([])

    const [formData, setFormData] = useState({
        name: "",
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        email: "",
        website: "",
        owner:userInfo.id
      });

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
            const filterItem = response.data.filter(item => item.owner === userInfo.id)
            setOrganizations(filterItem)

        }catch(error) {
            alert("Cannot list Organizations", error)
        }
    }
        
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const requiredFields = {
        name: "Organization Name",
        street: "Street",
        city: "City",
        country: "Country",
        postal_code: "Postal Code",
        email:"Email",
        website:"Website",
    };
    for (const field in requiredFields){
      if (!formData[field]){
          alert(`Please fill in the required field: ${requiredFields[field]}`)
          return
      }
    }
      try {
        const response = await axios.post(
          url,
          formData,
          config
        );
        alert("create orgnization successfully")
        console.log("Organization created:", response.data);
        setFormData({
          name: "",
          street: "",
          city: "",
          state: "",
          country: "",
          postal_code: "",
          email: "",
          website: "",
          owner:userInfo.id
        });
      } catch (error) {
        console.error("Error creating organization:", error.response.data);
      }
    };

    useEffect(()=>{
        if(accessToken, userInfo?.id){
            ListOrganizations()
        }
    },[accessToken, userInfo?.id])
  return (
    <Container justifyContent="center" maxW="500px">
      <VStack  shadow="3px 3px 15px 5px rgb(75, 75, 79)" m={4} p={4} rounded={8} minW="100%">
        <Heading>Create New Organization</Heading>
        <Input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Name'
        />
        <Input
            type='text'
            name='street'
            value={formData.street}
            onChange={handleChange}
            placeholder='Street'
        />
        <Input
            type='text'
            name='city'
            value={formData.city}
            onChange={handleChange}
            placeholder='City'
        />
        <Input
            type='text'
            name='state'
            value={formData.state}
            onChange={handleChange}
            placeholder='State'
        />
        <Input
            type='text'
            name='country'
            value={formData.country}
            onChange={handleChange}
            placeholder='Country'
        />
        <Input
            type='text'
            name='postal_code'
            value={formData.postal_code}
            onChange={handleChange}
            placeholder='Postal Code'
        />
        <Input
            type='text'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
        />
        <Input
            type='text'
            name='website'
            value={formData.website}
            onChange={handleChange}
            placeholder='Website'
        />
        <Button onClick={handleSubmit}>Create</Button>
      </VStack>
    </Container>
  )
}

export default Organizations