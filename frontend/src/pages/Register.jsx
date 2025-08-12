// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { register, reset } from '../services/authSlice'
// import { useNavigate, Link } from 'react-router-dom'
// import { HStack, Text, Center, VStack, Container, Input, Button, Heading } from '@chakra-ui/react'
// import { PasswordInput } from '../components/ui/password-input'

// const Register = () => {

//     const [formData, setFormData] = useState({
//         "first_name": "",
//         "last_name": "",
//         "email": "",
//         "password": "",
//         "re_password": "",
//     })

//     const { first_name, last_name, email, password, re_password } = formData

//     const dispatch = useDispatch()
//     const navigate = useNavigate()

//     const { user, isError, isSuccess } = useSelector((state) => state.auth)

//     const handleChange = (e) => {
//         setFormData((prev) => ({
//             ...prev,
//             [e.target.name]: e.target.value
//         })
//         )
//     }
//     const handleSubmit = (e) => {
//         e.preventDefault()
//         if (password !== re_password) {
//             alert("Passwords do not match")
//         } else {
//             const userData = {
//                 first_name,
//                 last_name,
//                 email,
//                 password,
//                 re_password
//             }
//             dispatch(register(userData))
//         }
//     }
//     useEffect(() => {
//         if (isError) {
//             alert("Registter has an error")
//         }
//         if (isSuccess) {
//             alert("An activation email has been sent to your email. Please check your email")
//         }
//         dispatch(reset())
//     }, [isError, isSuccess, user, navigate, dispatch])

//   return (
//     <Container maxW="1140px">
//       <Center flexBasis="50%">
//         <VStack maxW="500px" mt={100} p={4} rounded={8} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
//           <Heading fontSize={24}>Register</Heading>
//           <VStack p={2} rounded={8}>
//             <Input  border="1px solid"
//               type="text"
//               placeholder="First Name *"
//               name="first_name"
//               onChange={handleChange}
//               value={first_name}
//               required
//             />
//             <Input border="1px solid"
//               type="text"
//               placeholder="Last Name *"
//               name="last_name"
//               onChange={handleChange}
//               value={last_name}
//               required
//             />
//             <Input border="1px solid"
//                 type="email"
//                 placeholder="Email *"
//                 name="email"
//                 onChange={handleChange}
//                 value={email}
//                 required
//             />
//             <PasswordInput border="1px solid"
//               type="password"
//               placeholder="Password *"
//               name="password"
//               onChange={handleChange}
//               value={password}
//               required
//             />
//             <PasswordInput border="1px solid"
//               type="password"
//               placeholder="Retype Password *"
//               name="re_password"
//               onChange={handleChange}
//               value={re_password}
//               required
//             />
//           </VStack>
//             <Button type="submit" onClick={handleSubmit}>Register</Button>
//           <HStack>
//             <Text fontSize="14px" fontStyle="italic" >Do you have an account?</Text>
//             <Link to="/login">login</Link>
//           </HStack>
//         </VStack>
//       </Center>
//     </Container>
//   )
// }

// export default Register

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../services/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { HStack, Text, Center, VStack, Container, Input, Button, Heading } from '@chakra-ui/react';
import { PasswordInput } from '../components/ui/password-input';
import LanguageSelector from '../components/Languague/LanguageSelector';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    "first_name": "",
    "last_name": "",
    "email": "",
    "password": "",
    "re_password": "",
  });

  const { first_name, last_name, email, password, re_password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isSuccess } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== re_password) {
      alert(t('error.passwords_do_not_match'));
    } else {
      const userData = {
        first_name,
        last_name,
        email,
        password,
        re_password
      };
      dispatch(register(userData));
    }
  };

  useEffect(() => {
    if (isError) {
      alert(t('error.register_error'));
    }
    if (isSuccess) {
      alert(t('register.activation_email_sent'));
    }
    dispatch(reset());
  }, [isError, isSuccess, user, navigate, dispatch, t]);

  return (
    <Container maxW="1140px">
      <Center flexBasis="50%">
        <VStack maxW="500px" mt={100} p={4} rounded={8} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
          <HStack gap={"20px"}>
            <Heading fontSize={24}>{t('register.heading')}</Heading>
            <LanguageSelector/>
          </HStack>
          <VStack p={2} rounded={8}>
            <Input border="1px solid"
              type="text"
              placeholder={t('register.first_name')}
              name="first_name"
              onChange={handleChange}
              value={first_name}
              required
            />
            <Input border="1px solid"
              type="text"
              placeholder={t('register.last_name')}
              name="last_name"
              onChange={handleChange}
              value={last_name}
              required
            />
            <Input border="1px solid"
              type="email"
              placeholder={t('register.email')}
              name="email"
              onChange={handleChange}
              value={email}
              required
            />
            <PasswordInput border="1px solid"
              type="password"
              placeholder={t('register.password')}
              name="password"
              onChange={handleChange}
              value={password}
              required
            />
            <PasswordInput border="1px solid"
              type="password"
              placeholder={t('register.re_password')}
              name="re_password"
              onChange={handleChange}
              value={re_password}
              required
            />
          </VStack>
          <Button type="submit" onClick={handleSubmit}>{t('register.button')}</Button>
          <HStack>
            <Text fontSize="14px" fontStyle="italic">{t('register.have_account')}</Text>
            <Link to="/login">{t('register.login')}</Link>
          </HStack>
        </VStack>
      </Center>
    </Container>
  );
};

export default Register;