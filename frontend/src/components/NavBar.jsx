import React from 'react'
import { Container, HStack, IconButton } from '@chakra-ui/react'
import { Link } from 'react-router'
import { useColorMode } from './ui/color-mode'
import { LuMoon, LuSun } from 'react-icons/lu'

const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Container bg="teal.600" rounded={8} my={4} py={4}>
        <HStack justifyContent="space-evenly" fontWeight="bold" fontSize={24}>
            <Link to="/home">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/community">Community</Link>
            <Link to="/login">Logout</Link>
            <Link to="/profile">Profile</Link>
            <IconButton onClick={toggleColorMode}>
              {
                colorMode === "light" ? <LuSun/> : <LuMoon/>
              }
            </IconButton>
        </HStack>
    </Container>
  )
}

export default NavBar