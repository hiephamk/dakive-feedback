import React from 'react'
import { Link } from 'react-router'
import { Box, Image, Center, HStack, Container, Flex, Heading, VStack, Stack } from '@chakra-ui/react'

const HomePage = () => {
  return (
    <Box width="100%" p="10px" boxSizing={"border-box"}
      bgImage="url('https://www.hamk.fi/wp-content/uploads/2024/01/dakive_hankekuva_uusilleverkkosivuille-scaled.jpg')"
      w="100vw"
      h="100vh"
      bgRepeat="no-repeat"
      rounded={10}
    >
      <Box >
        <Center>
          <VStack>
            <Box textAlign="center" mt={100}>
              <Heading fontSize={46} fontWeight="bold">Welcome to the DakiVE</Heading>
            </Box>
            {/* <Center height="50vh">
              <Flex gap="100px" maxW="1000px">
                <Box shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={4} fontSize={24} rounded={5}>
                  <Link to="/management/home">For the Building Owner</Link>
                </Box>
              </Flex>
            </Center> */}
          </VStack>
        </Center>
      </Box>
    </Box>
  )
}

export default HomePage