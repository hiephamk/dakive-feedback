import {useState, useEffect} from 'react'
import { useNavigate, NavLink } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../../services/authSlice'
import { Link } from 'react-router'
import { useColorModeValue, useColorMode } from '../ui/color-mode'
import { Box, HStack, Button, IconButton, Avatar, Text, Center, VStack, Image, Portal, Menu } from '@chakra-ui/react'
import { LuMoon, LuSun } from 'react-icons/lu'
import { GiHamburgerMenu } from "react-icons/gi";
import useProfile from '../../services/ProfileHook';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "../ui/menu"

const Nav = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  const [isDesktop, setIsDesktop] = useState(false);
  const dispatch = useDispatch()

  const { user, userInfo } = useSelector((state) => state.auth)
  const {profile_img, last_name} = useProfile(userInfo.id)

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
    <Box p={2}>
      {user ? (
        <Box >
        {isDesktop ? (
        <HStack py={2} justifyContent="space-between" fontSize={22} fontWeight="bold">
          <Button bg="black">
            <Image width="100px" bg="black" src="https://www.hamk.fi/wp-content/uploads/2024/01/HAMK_Logo_text_small_ENG_NEGA-1.svg"/>
          </Button>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/room/home">Home</NavLink>
          <Menu.Root>
                      <Menu.Trigger asChild>
                        <NavLink variant="outline" fontSize={22} fontWeight="bold">
                          Management
                        </NavLink>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content>
                            <Menu.Item value="add-room">
                              <Link to="/room/create-room">Add your rooms</Link>
                                          
                            </Menu.Item>
                            <Menu.Item value="room-list">
                            <Link to="/room/room-list">List of rooms</Link>
                            
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
          <NavLink to="/room/room-report">Feedback</NavLink>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="outline" size="sm" borderColor={btnColor}>
                <Avatar.Root shape="full" size="lg">
                    <Avatar.Fallback name={last_name} />
                    <Avatar.Image src={profile_img?profile_img:null} />
                </Avatar.Root>
              </Button>
            </MenuTrigger>
            <MenuContent>
              <VStack maxW="300px">
                <Center>
                  <MenuItem>
                  <Avatar.Root shape="full" size="lg">
                      <Avatar.Fallback name={last_name} />
                      <Avatar.Image src={profile_img?profile_img:null} />
                  </Avatar.Root>
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
              <Link to="/room/home">Home</Link>
            </MenuItem>
            <MenuItem value="new-file-a">
              <Link to ="/room/create-room">Add rooms</Link>
            </MenuItem>
            <MenuItem value="new-win-a">
              <Link to ="/room/room-list">List of rooms</Link>
            </MenuItem>
            <MenuItem value="new-win-a">
              <Link to ="/room/room-report">feedback</Link>
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