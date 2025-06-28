import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import {Box, Input, VStack, Button, Center, Heading, Container, Field, HStack } from '@chakra-ui/react'
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
        postal_code: "Postal Code",
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
              <Field.Root required>
                  <HStack>
                      <Field.Label w={"200px"}>
                          Country:
                      </Field.Label>
                      <Input type="text" name="country" value={formData.country} onChange={handleChange}/>
                  </HStack>
              </Field.Root>
              <Field.Root required>
                  <HStack>
                      <Field.Label w={"200px"}>
                          Email:
                      </Field.Label>
                      <Input type="text" name="email" value={formData.email} onChange={handleChange}/>
                  </HStack>
              </Field.Root>
              {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
              <Field.Root required>
                  <HStack>
                      <Field.Label w={"200px"}>
                          Website: 
                      </Field.Label>
                      <Input type="text" name="website" value={formData.website} onChange={handleChange}/>
                  </HStack>
              </Field.Root>
              {errors.website && <p style={{ color: 'red' }}>{errors.website}</p>}
              <Button onClick={handleSubmit}>Create Organinzation</Button>
            </VStack>
    </Container>
  )
}

export default UpdateOrg