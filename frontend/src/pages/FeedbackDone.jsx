import { Box, Heading, Center, Stack} from '@chakra-ui/react'
import NavUserReport from '../components/NavBars/NavUserReport'

const FeedbackDone = () => {
  return (
    <Box m={"10px"}>
        <NavUserReport/>
        <Center>
            <Stack mt={"100px"} textAlign={"center"} gap={"20px"} maxW={"fix-content"}>
                <Heading fontSize={"xl"} fontWeight={"bold"} fontStyle={"italic"}>The room report was sent</Heading>
                <Heading fontSize={"inherit"}>👍❤️Thank you for your valuable contribution❤️👍</Heading>
            </Stack>
        </Center>
    </Box>
  )
}

export default FeedbackDone