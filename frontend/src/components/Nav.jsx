import {useState, useEffect} from 'react'
import { useNavigate, NavLink } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../services/authSlice'
import { Link } from 'react-router'
import { useColorModeValue, useColorMode } from './ui/color-mode'
import { Box, HStack, Button, IconButton, Avatar, Text, Center, VStack } from '@chakra-ui/react'
import { LuMoon, LuSun } from 'react-icons/lu'
import { GiHamburgerMenu } from "react-icons/gi";
import AvatarUser from './AvatarUser'
import useProfile from '../services/ProfileHook';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "./ui/menu"

const Nav = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  const [isDesktop, setIsDesktop] = useState(false);
  const dispatch = useDispatch()

  const { user, userInfo } = useSelector((state) => state.auth)
  const {accounts, isloading, error} = useProfile(userInfo.id)

  const navigate = useNavigate()
  const btnColor = useColorModeValue("gray.50", "black")
  const handleLogout = () => {
      dispatch(logout())
      dispatch(reset())
      navigate("/login")
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 450px)");
    setIsDesktop(mediaQuery.matches);
    const handleResize = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <Box>
      {user ? (
        <Box >
        {isDesktop ? (
        <HStack py={2} justifyContent="space-evenly" fontSize={22} fontWeight="bold">
          <NavLink to="/dashboard">Home</NavLink>
          <NavLink to="/dashboard/about">About</NavLink>
          <NavLink to="/dashboard/community">Community</NavLink>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="outline" size="sm" borderColor={btnColor}>
                {accounts && accounts.length>0 ? (
                  accounts.map((account) => (
                    <Box key={account.id}>
                      <Avatar.Root shape="full" size="lg">
                          <Avatar.Fallback name="Random User" />
                          <Avatar.Image src={account.profile_img} />
                      </Avatar.Root>
                    </Box>
                  ))
                ):(<Avatar.Root shape="full" size="lg">
                  <Avatar.Fallback name={userInfo.last_name} />
              </Avatar.Root>)}
              </Button>
            </MenuTrigger>
            <MenuContent>
              <VStack maxW="300px">
                <Center>
                  <MenuItem>
                    <AvatarUser/>
                  </MenuItem>
                </Center>
                  <MenuItem>
                    <Text fontWeight="bold">{userInfo.first_name} {userInfo.last_name}</Text>
                  </MenuItem>
                <MenuItem>
                  <NavLink onClick={handleLogout}>Logout</NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/dashboard/profile">Profile</NavLink>
                </MenuItem>
              </VStack>
            </MenuContent>
          </MenuRoot>
          
          <IconButton onClick={toggleColorMode}>
            {
              colorMode === 'light' ? <LuSun/> : <LuMoon/>
            }
          </IconButton>
  
        </HStack>
        ):(
        <MenuRoot>
          <MenuTrigger asChild>
            <Button variant="outline" size="sm">
              <GiHamburgerMenu/> Menu
            </Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem value="new-txt-a">
              <Link to="/dashboard">Home</Link>
            </MenuItem>
            <MenuItem value="new-file-a">
              <Link to ="/dashboard/about">About</Link>
            </MenuItem>
            <MenuItem value="new-win-a">
            <Link to ="/dashboard/community">Community</Link>
            </MenuItem>
            <MenuItem value="new-win-a">
              <Link to ="/dashboard/profile">Profile</Link>
            </MenuItem>
          </MenuContent>
        </MenuRoot>
        )
      }  
      </Box>
      ): (null)

      }
    </Box>
  )
}

export default Nav