
// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate, useParams } from 'react-router'
// import { Field, Center, VStack, Container, Input, Button, Heading, Checkbox, HStack, Box, Text} from '@chakra-ui/react'
// import { PasswordInput } from '../../components/ui/password-input'
// import useOrganization from './OrganizationHook'
// import useAccessToken from '../../services/token'
// import axios from 'axios'
// import useOrganization_Membership from './Organization_Membership_Hook'
// import { reset } from '../../services/authSlice'

// const RegisterMembers = ({onSuccess}) => {
//   const { user, userInfo, isError, isSuccess } = useSelector(state => state.auth)
//   const accessToken = useAccessToken(user)
//   const { organizations } = useOrganization()
//   const { members } = useOrganization_Membership()
//   const { orgId } = useParams()

//   const [formData, setFormData] = useState({
//     "first_name": "",
//     "last_name": "",
//     "email": "",
//     "password": "",
//     "re_password": "",
//     "organizationid": "",
//     "is_active": false // Initialize as boolean, not string
//   })

//   const [loading, setLoading] = useState(false)
//   const [errors, setErrors] = useState({})

//   const { first_name, last_name, email, password, re_password, organizationid, is_active } = formData
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const handleChange = (e) => {
//         setFormData((prev) => ({
//             ...prev,
//             [e.target.name]: e.target.value
//         })
//         )
//     }
//   // const handleChange = (e) => {
//   //   const { name, value, type, checked } = e.target
//   //   setFormData((prev) => ({
//   //     ...prev,
//   //     [name]: type === 'checkbox' ? checked : value
//   //   }))
    
//   //   // Clear error when user starts typing
//   //   if (errors[name]) {
//   //     setErrors(prev => ({
//   //       ...prev,
//   //       [name]: ''
//   //     }))
//   //   }
//   // }

//   // Handle checkbox change specifically
//   // const handleCheckboxChange = (checked) => {
//   //   setFormData(prev => ({
//   //     ...prev,
//   //     is_active: checked
//   //   }))
//   // }

//   // Form validation
//   const validateForm = () => {
//     const newErrors = {}
    
//     if (!first_name.trim()) newErrors.first_name = 'First name is required'
//     if (!last_name.trim()) newErrors.last_name = 'Last name is required'
//     if (!email.trim()) newErrors.email = 'Email is required'
//     else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email format is invalid'
//     if (!password) newErrors.password = 'Password is required'
//     else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
//     if (!re_password) newErrors.re_password = 'Please confirm password'
//     if (password !== re_password) newErrors.re_password = 'Passwords do not match'
//     if (!organizationid) newErrors.organizationid = 'Please select an organization'

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const resetForm = () => {
//     setFormData({
//       first_name: "",
//       last_name: "", 
//       email: "", 
//       password: "", 
//       re_password: "", 
//       organizationid: "",
//       is_active: false
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     if (!validateForm()) {
//       return
//     }

//     setLoading(true)
//     setErrors({})

//     const userData = {
//       first_name,
//       last_name,
//       email,
//       password,
//       re_password,
//       organizationid: Number(organizationid),
//       is_active:true
//     }

//     console.log("userdata: ", userData)

//     const url = import.meta.env.VITE_USER_CREATE_URL

//     try {
//       const response = await axios.post(url, userData, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       })

//       console.log('Registration successful:', response.data)
      
//       if (onSuccess) {
//         onSuccess() // Notify parent to refresh
//       }

//       alert("User registered successfully!")
//       resetForm()

//     } catch (error) {
//       console.error('Registration error:', error)
      
//       if (error.response) {
//         const { status, data } = error.response
        
//         if (status === 401) {
//           alert("Please login again.")
//           // Optionally redirect to login
//           // navigate('/login')
//         } else if (status === 400 && data) {
//           // Handle validation errors from backend
//           if (typeof data === 'object') {
//             setErrors(data)
//           } else {
//             alert("Registration failed. Please check your input.")
//           }
//         } else {
//           alert(`Registration failed: ${data?.message || 'Unknown error'}`)
//         }
//       } else if (error.request) {
//         alert("Network error. Please check your connection.")
//       } else {
//         alert("Registration failed. Please try again.")
//       }
      
//       resetForm()
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (isError) {
//       alert("Register has an error")
//     }
//     if (isSuccess) {
//       alert("An activation email has been sent to your email. Please check your email")
//     }
//     dispatch(reset())
//   }, [isError, isSuccess, user, navigate, dispatch])

//   return (
//     <Box mt={"10px"} h={"500px"} maxW="600px" w={"300px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" border="1px solid" rounded={8} p={4}>
//       <VStack pb={"10px"} mt={"10px"} spacing={4}>
//         <Heading fontSize={24} m={"10px"}>Create a new user</Heading>
//         <VStack maxW="500px" align="stretch" spacing={3}>
          
//           {/* First Name */}
//           <Box>
//             <Input 
//               border="1px solid"
//               borderColor={errors.first_name ? "red.500" : "gray.300"}
//               type="text"
//               placeholder="First Name *"
//               name="first_name"
//               onChange={handleChange}
//               value={first_name}
//               required
//             />
//             {errors.first_name && (
//               <Text color="red.500" fontSize="sm" mt={1}>{errors.first_name}</Text>
//             )}
//           </Box>

//           {/* Last Name */}
//           <Box>
//             <Input 
//               border="1px solid"
//               borderColor={errors.last_name ? "red.500" : "gray.300"}
//               type="text"
//               placeholder="Last Name *"
//               name="last_name"
//               onChange={handleChange}
//               value={last_name}
//               required
//             />
//             {errors.last_name && (
//               <Text color="red.500" fontSize="sm" mt={1}>{errors.last_name}</Text>
//             )}
//           </Box>

//           {/* Email */}
//           <Box>
//             <Input 
//               border="1px solid"
//               borderColor={errors.email ? "red.500" : "gray.300"}
//               type="email"
//               placeholder="Email *"
//               name="email"
//               onChange={handleChange}
//               value={email}
//               required
//             />
//             {errors.email && (
//               <Text color="red.500" fontSize="sm" mt={1}>{errors.email}</Text>
//             )}
//           </Box>

//           {/* Password */}
//           <Box>
//             <PasswordInput 
//               border="1px solid"
//               borderColor={errors.password ? "red.500" : "gray.300"}
//               type="password"
//               placeholder="Password *"
//               name="password"
//               onChange={handleChange}
//               value={password}
//               required
//             />
//             {errors.password && (
//               <Text color="red.500" fontSize="sm" mt={1}>{errors.password}</Text>
//             )}
//           </Box>

//           {/* Confirm Password */}
//           <Box>
//             <PasswordInput 
//               border="1px solid"
//               borderColor={errors.re_password ? "red.500" : "gray.300"}
//               type="password"
//               placeholder="Retype Password *"
//               name="re_password"
//               onChange={handleChange}
//               value={re_password}
//               required
//             />
//             {errors.re_password && (
//               <Text color="red.500" fontSize="sm" mt={1}>{errors.re_password}</Text>
//             )}
//           </Box>

//           {/* Organization Select */}
//           <Box>
//             <Text mb={1}>Select Organization *</Text>
//             <select
//               name='organizationid'
//               value={organizationid}
//               onChange={handleChange}
//               style={{ 
//                 width: '100%', 
//                 padding: '8px', 
//                 borderRadius: '5px', 
//                 border: errors.organizationid ? '1px solid #E53E3E' : '1px solid #ccc' 
//               }}
//             >
//               <option value="">-- Choose an organization --</option>
//               {organizations
//                 .filter(org => org.id=== Number(orgId))
//                 .map(org => (
//                     <option key={org.id} value={org.id}>{org.name}</option>
//                 ))
//               }
//             </select>
//             {errors.organizationid && (
//               <Text color="red.500" fontSize="sm" mt={1}>{errors.organizationid}</Text>
//             )}
//           </Box>
//         </VStack>
        
//         <Button 
//           type="submit" 
//           onClick={handleSubmit}
//           isLoading={loading}
//           loadingText="Registering..."
//           isDisabled={loading}
//           colorScheme="blue"
//           width="full"
//         >
//           Register
//         </Button>
//       </VStack>
//     </Box>
//   )
// }

// export default RegisterMembers

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { Field, Center, VStack, Container, Input, Button, Heading, Checkbox, HStack, Box, Text as ChakraText } from '@chakra-ui/react';
import { PasswordInput } from '../../components/ui/password-input';
import useOrganization from './OrganizationHook';
import useAccessToken from '../../services/token';
import axios from 'axios';
import useOrganization_Membership from './Organization_Membership_Hook';
import { reset } from '../../services/authSlice';

const RegisterMembers = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { user, userInfo, isError, isSuccess } = useSelector(state => state.auth);
  const accessToken = useAccessToken(user);
  const { organizations } = useOrganization();
  const { members } = useOrganization_Membership();
  const { orgId } = useParams();

  const [formData, setFormData] = useState({
    "first_name": "",
    "last_name": "",
    "email": "",
    "password": "",
    "re_password": "",
    "organizationid": "",
    "is_active": false // Initialize as boolean, not string
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { first_name, last_name, email, password, re_password, organizationid, is_active } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? checked : value
  //   }));
    
  //   // Clear error when user starts typing
  //   if (errors[name]) {
  //     setErrors(prev => ({
  //       ...prev,
  //       [name]: ''
  //     }));
  //   }
  // }

  // Handle checkbox change specifically
  // const handleCheckboxChange = (checked) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     is_active: checked
  //   }));
  // }

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!first_name.trim()) newErrors.first_name = t('register_members.first_name_required');
    if (!last_name.trim()) newErrors.last_name = t('register_members.last_name_required');
    if (!email.trim()) newErrors.email = t('register_members.email_required');
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t('register_members.email_invalid');
    if (!password) newErrors.password = t('register_members.password_required');
    else if (password.length < 8) newErrors.password = t('register_members.password_too_short');
    if (!re_password) newErrors.re_password = t('register_members.re_password_required');
    if (password !== re_password) newErrors.re_password = t('register_members.passwords_do_not_match');
    if (!organizationid) newErrors.organizationid = t('register_members.organization_required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "", 
      email: "", 
      password: "", 
      re_password: "", 
      organizationid: "",
      is_active: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    const userData = {
      first_name,
      last_name,
      email,
      password,
      re_password,
      organizationid: Number(organizationid),
      is_active: true
    };

    console.log("userdata: ", userData);

    const url = import.meta.env.VITE_USER_CREATE_URL;

    try {
      const response = await axios.post(url, userData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log('Registration successful:', response.data);
      
      if (onSuccess) {
        onSuccess(); // Notify parent to refresh
      }

      alert(t('register_members.user_registered'));
      resetForm();

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          alert(t('error.please_login_again'));
          // Optionally redirect to login
          // navigate('/login')
        } else if (status === 400 && data) {
          // Handle validation errors from backend
          if (typeof data === 'object') {
            setErrors(data);
          } else {
            alert(t('register_members.registration_failed'));
          }
        } else {
          alert(`${t('register_members.registration_failed')}: ${data?.message || t('register_members.unknown_error')}`);
        }
      } else if (error.request) {
        alert(t('register_members.network_error'));
      } else {
        alert(t('register_members.registration_failed'));
      }
      
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isError) {
      alert(t('register_members.register_error'));
    }
    if (isSuccess) {
      alert(t('register_members.activation_email_sent'));
    }
    dispatch(reset());
  }, [isError, isSuccess, user, navigate, dispatch]);

  return (
    <Box mt={"10px"} h={"500px"} maxW="600px" w={"300px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" border="1px solid" rounded={8} p={4}>
      <VStack pb={"10px"} mt={"10px"} spacing={4}>
        <Heading fontSize={24} m={"10px"}>{t('register_members.create_new_user')}</Heading>
        <VStack maxW="500px" align="stretch" spacing={3}>
          
          {/* First Name */}
          <Box>
            <Input 
              border="1px solid"
              borderColor={errors.first_name ? "red.500" : "gray.300"}
              type="text"
              placeholder={t('register_members.placeholder_first_name')}
              name="first_name"
              onChange={handleChange}
              value={first_name}
              required
            />
            {errors.first_name && (
              <ChakraText color="red.500" fontSize="sm" mt={1}>{errors.first_name}</ChakraText>
            )}
          </Box>

          {/* Last Name */}
          <Box>
            <Input 
              border="1px solid"
              borderColor={errors.last_name ? "red.500" : "gray.300"}
              type="text"
              placeholder={t('register_members.placeholder_last_name')}
              name="last_name"
              onChange={handleChange}
              value={last_name}
              required
            />
            {errors.last_name && (
              <ChakraText color="red.500" fontSize="sm" mt={1}>{errors.last_name}</ChakraText>
            )}
          </Box>

          {/* Email */}
          <Box>
            <Input 
              border="1px solid"
              borderColor={errors.email ? "red.500" : "gray.300"}
              type="email"
              placeholder={t('register_members.placeholder_email')}
              name="email"
              onChange={handleChange}
              value={email}
              required
            />
            {errors.email && (
              <ChakraText color="red.500" fontSize="sm" mt={1}>{errors.email}</ChakraText>
            )}
          </Box>

          {/* Password */}
          <Box>
            <PasswordInput 
              border="1px solid"
              borderColor={errors.password ? "red.500" : "gray.300"}
              type="password"
              placeholder={t('register_members.placeholder_password')}
              name="password"
              onChange={handleChange}
              value={password}
              required
            />
            {errors.password && (
              <ChakraText color="red.500" fontSize="sm" mt={1}>{errors.password}</ChakraText>
            )}
          </Box>

          {/* Confirm Password */}
          <Box>
            <PasswordInput 
              border="1px solid"
              borderColor={errors.re_password ? "red.500" : "gray.300"}
              type="password"
              placeholder={t('register_members.placeholder_re_password')}
              name="re_password"
              onChange={handleChange}
              value={re_password}
              required
            />
            {errors.re_password && (
              <ChakraText color="red.500" fontSize="sm" mt={1}>{errors.re_password}</ChakraText>
            )}
          </Box>

          {/* Organization Select */}
          <Box>
            <ChakraText mb={1}>{t('register_members.select_organization')}</ChakraText>
            <select
              name='organizationid'
              value={organizationid}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '5px', 
                border: errors.organizationid ? '1px solid #E53E3E' : '1px solid #ccc' 
              }}
            >
              <option value="">{t('register_members.choose_organization')}</option>
              {organizations
                .filter(org => org.id === Number(orgId))
                .map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))
              }
            </select>
            {errors.organizationid && (
              <ChakraText color="red.500" fontSize="sm" mt={1}>{errors.organizationid}</ChakraText>
            )}
          </Box>
        </VStack>
        
        <Button 
          type="submit" 
          onClick={handleSubmit}
          isLoading={loading}
          loadingText={t('register_members.registering')}
          isDisabled={loading}
          colorScheme="blue"
          width="full"
        >
          {t('register_members.register')}
        </Button>
      </VStack>
    </Box>
  );
};

export default RegisterMembers;