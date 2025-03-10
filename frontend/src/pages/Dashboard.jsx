import React from 'react'
import {Box, Container } from '@chakra-ui/react'
import { useColorModeValue } from '../components/ui/color-mode'
import { Outlet,} from 'react-router'
import NavBar from '../components/NavBar'

const Dashboard = () => {
  const mainBg = useColorModeValue("gray.100", "gray.800")
  return (
    <Box>
      <NavBar/>
      <Container maxW="20%">

      </Container>
      <Container height="100vh" maxW="60%" rounded={8} bg={mainBg}>
        <Outlet/>
      </Container>
      <Container maxW="20%">

      </Container>
    </Box>
  )
}

export default Dashboard