import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSelector, useDispatch } from "react-redux"
import { resetPasswordConfirm } from '../services/authSlice'
import { Center, Container, Input,Box, VStack, Button } from '@chakra-ui/react'
import { PasswordInput } from '../components/ui/password-input'

const ResetPasswordConfirm = () => {

    const { uid, token } = useParams()
    const [formData, setFormData] = useState({
        'new_password': '',
        're_new_password': ''
    })

    const { new_password, re_new_password } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

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

        const userData = {
            uid,
            token,
            new_password,
            re_new_password
        }

        dispatch(resetPasswordConfirm(userData))
    }

    useEffect(() => {
        if (isError) {
            alert(message)
        }
        if (isSuccess) {
            navigate("/")
            alert("Your password was reset successfully.")

        }


    }, [isError, isSuccess, message, navigate, dispatch])


    return (
        <Container>
            <Center>
                <Box border="1px solid" p={4} rounded={8}>
                    <VStack maxW="500px">
                        <PasswordInput type="password"
                            placeholder="New password"
                            name="new_password"
                            onChange={handleChange}
                            value={new_password}
                            required
                        />
                        <PasswordInput
                            placeholder="Confirm new password"
                            size="lg"
                            name="re_new_password"
                            onChange={handleChange}
                            value={re_new_password}
                            required
                        />
                        <Button onClick={handleSubmit}>Reset Password</Button>
                    </VStack>
                </Box>
            </Center>
        </Container>
    )
}

export default ResetPasswordConfirm