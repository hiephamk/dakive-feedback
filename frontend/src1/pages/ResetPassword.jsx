import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from "../services/authSlice"
import { Button, Center, Container, Input, Box, VStack, Heading } from "@chakra-ui/react"

const ResetPassword = () => {

    const [formData, setFormData] = useState({
        "email": "",
    })

    const { email } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)


    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        })
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const userData = {email}
        dispatch(resetPassword(userData))
    }
    useEffect(() => {
        if (isError) {
            alert(message)
        }
        if (isSuccess) {
            navigate("/")
            alert("A reset password email has been sent to you.")
        }
    }, [isError, isSuccess, message, navigate, dispatch])
    return (
        <Container>
            <Center>
                <VStack gap={4} maxW="500px" my={4}>
                    <Heading>
                        Enter your email to reset your password
                    </Heading>
                    <Input
                      border="1px solid"
                      type="text"
                      placeholder="Email: me@email.com"
                      name="email"
                      onChange={handleChange}
                      value={email}
                      required
                    />
                    <Button onClick={handleSubmit}>Reset Password</Button>
                </VStack>
            </Center>
        </Container>
    )
}
export default ResetPassword