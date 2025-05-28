import { useEffect } from 'react'
import { BiUserCheck } from 'react-icons/bi'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { activate, reset } from '../services/authSlice'
import { VStack, Button, Center, Container, Heading } from '@chakra-ui/react'

const Activate = () => {

    const { uid, token } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleSubmit = (e) => {
        e.preventDefault()

        const userData = {
            uid,
            token
        }
        dispatch(activate(userData))
        alert("Your account has been activated! You can login now")
    }

    useEffect(() => {
        if (isError) {
            alert(message)
        }

        if (isSuccess) {
            navigate("/login")
        }

        dispatch(reset())

    }, [isError, isSuccess, navigate, dispatch])


    return (
        <Container>
            <Center>
                <VStack mt={100} p={4} rounded={8} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
                    <Heading>Activate Account</Heading>
                    {isLoading}
                    <Button type="submit" onClick={handleSubmit}>Activate Account</Button>
                </VStack>
            </Center>
        </Container>
    )
}

export default Activate