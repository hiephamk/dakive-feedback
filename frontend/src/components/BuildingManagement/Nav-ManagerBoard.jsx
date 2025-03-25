import {useState, useEffect} from 'react'
import { useNavigate, NavLink } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../../services/authSlice'
import { Link } from 'react-router'
import { useColorModeValue, useColorMode } from '../ui/color-mode'
import { Box, HStack, Button, IconButton, Avatar, Text, Center, VStack,Image, Portal, Menu } from '@chakra-ui/react'
import { LuMoon, LuSun } from 'react-icons/lu'
import { GiHamburgerMenu } from "react-icons/gi";
import useProfile from '../../services/ProfileHook';
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "../ui/menu"


const NavBar = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  const [isDesktop, setIsDesktop] = useState(false);
  const dispatch = useDispatch()

  const { user, userInfo } = useSelector((state) => state.auth)
  const {last_name, profile_img} = useProfile(userInfo.id)

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
          {/* <Image sizes='sm' src="https://www.hamk.fi/wp-content/uploads/2024/01/HAMK_Logo_text_small_ENG_NEGA-1.svg"/> */}
          {/* <NavLink to="/home">Dashboard</NavLink> */}
          <NavLink to="/home/management/home">Home</NavLink>
          <Menu.Root>
            <Menu.Trigger asChild>
              <NavLink variant="outline" fontSize={22} fontWeight="bold">
                Management
              </NavLink>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>            
                  <Menu.Item value="new-txt-a">
                    <Link to="/home/management/add_organization">Create Organization</Link>                                
                  </Menu.Item>
                  <Menu.Item value="new-file-a">
                  <Link to="/home/management/add_building">Create Building</Link>                 
                  </Menu.Item>
                  <Menu.Item value="new-win-a">
                  <Link to="/home/management/create-room">Create rooms</Link>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger asChild>
              <NavLink variant="outline" fontSize={22} fontWeight="bold">
                Reports
              </NavLink>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>            
                <Menu.Item value="new-win-a">
                    <Link to="/home/management/building-list">List of building</Link> 
                  </Menu.Item>
                  <Menu.Item value="new-win-a">
                    <Link to="/home/management/report/table">Table</Link>
                  </Menu.Item>
                  <Menu.Item value="new-win-a">
                    <Link to="/home/management/report/chart">Chart</Link>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="outline" size="sm" borderColor={btnColor}>
                <Box>
                  <Avatar.Root shape="full" size="lg">
                      <Avatar.Fallback name={last_name} />
                      <Avatar.Image src={profile_img?profile_img:null} />
                  </Avatar.Root>
                </Box>
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
                  <NavLink to="/home/profile">Profile</NavLink>
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
              <NavLink to="/home/management/home">Home</NavLink>
            </MenuItem>
            <MenuItem value="new-win-a">
              <NavLink to="/home/home/management/add_organization">Add Organizations</NavLink>
            </MenuItem>
            <MenuItem value="new-win-a">
              <NavLink to="/home/management/add_building">Add Buildings</NavLink>
            </MenuItem>
            <MenuItem value="new-win-a">
              <NavLink to="/home/management/building-list">List of buildings</NavLink>
            </MenuItem>
            <MenuItem value="new-win-a">
              <NavLink to="/home/management/report">Reports</NavLink>
            </MenuItem>
            <MenuItem value="new-win-a">
              <NavLink to="/home/profile">Profile</NavLink>
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

export default NavBar