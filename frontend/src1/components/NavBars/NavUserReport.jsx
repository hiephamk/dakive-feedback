import {useState, useEffect} from 'react'
import { useNavigate, NavLink } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../../services/authSlice'
import { Link } from 'react-router'
import { useColorModeValue, useColorMode } from '../ui/color-mode'
import { LuMoon, LuSun } from 'react-icons/lu'
import { GiHamburgerMenu } from "react-icons/gi";
import useProfile from '../../services/ProfileHook';
import { Box, HStack, Button, IconButton, Avatar, Text, Center, VStack, Image, Portal, Menu, Heading } from '@chakra-ui/react'
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "../ui/menu"

const NavUserReport = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  return (
    <Box p={2}>
        <HStack py={2} justifyContent="space-between" fontSize={22} fontWeight="bold">
          <Button bg="black">
            <Image width="100px" bg="black" src="https://www.hamk.fi/wp-content/uploads/2024/01/HAMK_Logo_text_small_ENG_NEGA-1.svg"/>
          </Button>
          <Heading fontSize={"28px"} fontWeight={"bold"}>DAKIVE FEEDBACK SYSTEM</Heading>

          
          <IconButton onClick={toggleColorMode}>
            {
              colorMode === 'light' ? <LuSun/> : <LuMoon/>
            }
          </IconButton>
  
        </HStack>
    </Box>
  )
}

export default NavUserReport