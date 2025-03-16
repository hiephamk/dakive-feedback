import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BiLogInCircle } from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux'
import { login, reset, getUserInfo } from '../services/authSlice'
import {Center, Button, Container, Box, Heading, Input, Text, VStack, HStack, Flex} from "@chakra-ui/react"
import {PasswordInput} from "../components/ui/password-input"


const Login = () => {
  const { user, isLoading, isError, isSuccess , userInfo} = useSelector((state) => state.auth)


    const [formData, setFormData] = useState({
        "email": "",
        "password": "",
    })

    const { email, password } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        })
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email,
            password,
        }
        dispatch(login(userData))
    }


    useEffect(() => {
      if (isError) {
        alert("login failed");
      }
  
      if (isSuccess || user) {
          navigate( "/dashboard")
      }

      dispatch(reset());
      dispatch(getUserInfo());
  
    }, [isError, isSuccess, user, email, navigate, dispatch]);

  return (
    <Container maxW="1140px">
      <Center flexBasis="50%">
        <VStack maxW="500px" mt={100} rounded={8} p={8} border="1px solid" shadow="3px 3px 15px 5px rgb(75, 75, 79)">
          <Heading fontSize={24} >Login</Heading>
          <VStack p={4} rounded={8}>
            <Input
              border="1px solid"
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={email}
              required
            />
            <PasswordInput
              border="1px solid" my={2}
              placeholder="Password"
              size="lg"
              onChange={handleChange}
              value={password}
              name="password"
              required
            />
            <Button type="submit" onClick={handleSubmit}>Login</Button>
          </VStack>
          <Text>Forgot password? <Link to="/reset-password">reset password</Link></Text>
          <Text>Don&apos;t you have an account yet?
            <Link to="/register">
              Sign up
            </Link>
          </Text>
        </VStack>
      </Center>
    </Container>
  )
  
}

export default Login

