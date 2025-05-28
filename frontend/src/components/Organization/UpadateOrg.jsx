import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import {Box, Input, VStack, Button, Center, Heading, Container } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router'
import api from '../../services/api'

const UpdateOrg = () => {
    const {user, userInfo } = useSelector(state=>state.auth)
    const accessToken = useAccessToken(user)
    const navigate = useNavigate()
    const { orgId } = useParams()

    const [errors, setErrors] = useState("");
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
    useEffect(() => {
        const fetOrganization = async () => {
            if(!accessToken || !orgId) return
            try {
                const url = `${import.meta.env.VITE_ORGANIZATION_UPDATE_URL}${orgId}/`;
                const res = await api.get(url,{
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                })
                const organizationData = res.data
                setFormData({
                    name: organizationData.name,
                    street: organizationData.street,
                    city: organizationData.city,
                    state: organizationData.state,
                    country: organizationData.country,
                    postal_code: organizationData.postal_code,
                    email: organizationData.email,
                    website: organizationData.website,
                    owner:userInfo.id
                });
                
            }catch (error) {
                console.error("Error fetching building:", error);
                alert("Failed to load building data");
            }
        }
            if(accessToken && orgId) {
                fetOrganization()
            }
    },[accessToken, orgId, userInfo?.id])

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    const isValidURL = (url) => {
      try {
          new URL(url);  // throws if invalid
          return true;
      } catch (_) {
          return false;
      }
  }; 
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
      if (name === 'website') {
        if (value && !isValidURL(value)) {
            setErrors((prev) => ({ ...prev, website: 'Invalid URL format (must start with http:// or https://)' }));
        } else {
            setErrors((prev) => ({ ...prev, website: null }));
        }
      }
      if (name === 'email') {
        if (value && !isValidEmail(value)) {
            setErrors((prev) => ({ ...prev, email: 'Invalid email format(exp:abc@email.com)' }));
        } else {
            setErrors((prev) => ({ ...prev, email: null }));
        }
      }
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
        const url = `${import.meta.env.VITE_ORGANIZATION_UPDATE_URL}${orgId}/`
        await api.put(
          url,
          formData,
          {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            },
          }
        );
        alert("Update orgnization successfully")

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
        navigate(`/home/admin/organization/details/${orgId}`, { state: { shouldRefresh: true }})
      } catch (err) {
        if (err.response && err.response.status === 400) {
        // Extract error message from the response
        const errorMessage = err.response.data.non_field_errors || err.response.data.name || 'This name already exists';
        setErrors(errorMessage);
        alert(errorMessage)
      } else {
          console.error("Unexpected error:", err);
          setErrors('An unexpected error occurred');
          alert("An unexpected error occurred");
        }
      }
    };

  return (
    <Container justifyContent="center" maxW="500px">
      <VStack  shadow="3px 3px 15px 5px rgb(75, 75, 79)" m={4} p={4} rounded={8} minW="100%">
        <Heading>Update Organization</Heading>
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
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        <Input
            type='text'
            name='website'
            value={formData.website}
            onChange={handleChange}
            placeholder='http://example.com'
        />
        <Button onClick={handleSubmit}>Update</Button>
      </VStack>
    </Container>
  )
}

export default UpdateOrg