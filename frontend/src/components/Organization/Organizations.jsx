import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import {Box, Input, VStack, Button, Center, Heading, Container, Field, HStack } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router'

const Organizations = ({onSuccess = () => {}}) => {
    const {user, userInfo } = useSelector(state=>state.auth)
    const accessToken = useAccessToken(user)
    const navigate = useNavigate()

    const [Organizations,setOrganizations] = useState([])
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        street: "",
        city: "",
        state: "",
        country: "Finland",
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
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    const isValidURL = (url) => {
      try {
          new URL(url);
          return true;
      } catch {
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
        postal_code: "Postal Code",
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
        onSuccess()
        alert("create orgnization successfully")
        ListOrganizations()
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
        navigate('/home/admin', { state: { shouldRefresh: true } })
      } catch (err) {
        if (err.response && err.response.status === 400) {
        // Extract error message from the response
        const errorMessage = err.response.data.non_field_errors || err.response.data.name || 'unknow errors';
        setErrors(errorMessage);
        alert(errorMessage)
      } else {
          console.error("Unexpected error:", err);
          setErrors('An unexpected error occurred');
          alert("An unexpected error occurred");
        }
      }
    };

    useEffect(()=>{
        if(accessToken, userInfo?.id){
            ListOrganizations()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[accessToken, userInfo?.id])
  return (
    <Container justifyContent="center" maxW="500px">
      <VStack  shadow="3px 3px 15px 5px rgb(75, 75, 79)" m={4} p={4} rounded={8} minW="100%">
        <Heading>Create New Organization</Heading>
        <Field.Root required>
            <HStack>
                <Field.Label w={"200px"}>
                    Name: <Field.RequiredIndicator />
                </Field.Label>
                <Input type="text" name="name" value={formData.name} onChange={handleChange}/>
            </HStack>
        </Field.Root>
        <Field.Root required>
            <HStack>
                <Field.Label w={"200px"}>
                    Street: <Field.RequiredIndicator />
                </Field.Label>
                <Input type="text" name="street" value={formData.street} onChange={handleChange}/>
            </HStack>
        </Field.Root>
        <Field.Root required>
            <HStack>
                <Field.Label w={"200px"}>
                    City: <Field.RequiredIndicator />
                </Field.Label>
                <Input type="text" name="city" value={formData.city} onChange={handleChange}/>
            </HStack>
        </Field.Root>
        <Field.Root required>
            <HStack>
                <Field.Label w={"200px"}>
                    Postal Code: <Field.RequiredIndicator />
                </Field.Label>
                <Input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange}/>
            </HStack>
        </Field.Root>
        <Field.Root>
            <HStack>
                <Field.Label w={"200px"}>
                    Country:
                </Field.Label>
                <Input type="text" name="country" value={formData.country} onChange={handleChange}/>
            </HStack>
        </Field.Root>
        <Field.Root>
            <HStack>
                <Field.Label w={"200px"}>
                    Email:
                </Field.Label>
                <Input type="text" name="email" value={formData.email} onChange={handleChange} placeholder='abc@email.com'/>
            </HStack>
        </Field.Root>
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        <Field.Root>
            <HStack>
                <Field.Label w={"200px"}>
                    Website: 
                </Field.Label>
                <Input type="text" name="website" value={formData.website} onChange={handleChange} placeholder='https://www.example.com'/>
            </HStack>
        </Field.Root>
        {errors.website && <p style={{ color: 'red' }}>{errors.website}</p>}
        <Button onClick={handleSubmit}>Create Organinzation</Button>
      </VStack>
    </Container>
  )
}

export default Organizations
