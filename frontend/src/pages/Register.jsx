import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register, reset } from '../services/authSlice'
import { useNavigate } from 'react-router'
import { Field, Center, VStack, Container, Input, Button, Heading } from '@chakra-ui/react'
import { PasswordInput } from '../components/ui/password-input'

const Register = () => {

    const [formData, setFormData] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "password": "",
        "re_password": "",
    })

    const { first_name, last_name, email, password, re_password } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user, isError, isSuccess } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        })
        )
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (password !== re_password) {
            alert("Passwords do not match")
        } else {
            const userData = {
                first_name,
                last_name,
                email,
                password,
                re_password
            }
            dispatch(register(userData))
        }
    }
    useEffect(() => {
        if (isError) {
            alert("Registter has an error")
        }
        if (isSuccess) {
            alert("An activation email has been sent to your email. Please check your email")
        }
        dispatch(reset())
    }, [isError, isSuccess, user, navigate, dispatch])

  return (
    <Container>
      <Center>
        <VStack mt={100} p={4} bg="cyan.800" border="1px solid" maxW={600} rounded={8} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
          <Heading fontSize={24} color="white">Register</Heading>
          <VStack maxW="500px" bg="white" p={2} rounded={8}>
            <Input  border="1px solid"
              type="text"
              placeholder="First Name *"
              name="first_name"
              onChange={handleChange}
              value={first_name}
              required
            />
            <Input border="1px solid"
              type="text"
              placeholder="Last Name *"
              name="last_name"
              onChange={handleChange}
              value={last_name}
              required
            />
            <Input border="1px solid"
                type="email"
                placeholder="Email *"
                name="email"
                onChange={handleChange}
                value={email}
                required
            />
            <PasswordInput border="1px solid"
              type="password"
              placeholder="Password *"
              name="password"
              onChange={handleChange}
              value={password}
              required
            />
            <PasswordInput border="1px solid"
              type="password"
              placeholder="Retype Password *"
              name="re_password"
              onChange={handleChange}
              value={re_password}
              required
            />
          </VStack>
            <Button type="submit" onClick={handleSubmit}>Register</Button>
        </VStack>
      </Center>
    </Container>
  )
}

export default Register