import {useState, useEffect} from 'react'
import { useNavigate, NavLink } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../../services/authSlice'
import { Link } from 'react-router'
import { useColorModeValue, useColorMode } from '../ui/color-mode'
import { Box, HStack, Button, IconButton, Avatar, Text, Center, VStack,Image, Portal, Menu, Flex } from '@chakra-ui/react'
import { LuMoon, LuSun } from 'react-icons/lu'
import { GiHamburgerMenu } from "react-icons/gi";
import useProfile from '../../services/ProfileHook';
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "../ui/menu"

import LanguageSelector from '../Languague/LanguageSelector';
import { useTranslation } from 'react-i18next';

const NavDashboard = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Add useTranslation hook
  const { last_name, profile_img } = useProfile(userInfo?.id);
  const btnColor = useColorModeValue('gray.50', 'black');

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 450px)');
    setIsDesktop(mediaQuery.matches);
    const handleResize = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return (
    <Box shadow="3px 3px 15px 5px rgb(75, 75, 79)" p="10px" rounded="7px">
      {user ? (
        <Box>
          {isDesktop ? (
            <HStack py={2} justifyContent="space-between" fontSize={22} fontWeight="bold">
              <Button bg="black">
                <Image
                  width="100px"
                  bg="black"
                  src="https://www.hamk.fi/wp-content/uploads/2024/01/HAMK_Logo_text_small_ENG_NEGA-1.svg"
                />
              </Button>
              <NavLink to="/home">{t('nav_home')}</NavLink>
              <NavLink to="/home/admin">{t('management')}</NavLink>
              <Menu.Root>
                <Menu.Trigger asChild>
                  <NavLink variant="outline" fontSize={22} fontWeight="bold">
                    {t('reports')}
                  </NavLink>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item value="table">
                        <Link to="/home/management/report/table">{t('table')}</Link>
                      </Menu.Item>
                      <Menu.Item value="chart">
                        <Link to="/home/management/report/chart">{t('nav_chart')}</Link>
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
              <NavLink to="/home/about">{t('about')}</NavLink>
              <LanguageSelector />
              <Flex gap={'20px'}>
                <IconButton onClick={toggleColorMode}>
                  {colorMode === 'light' ? <LuMoon /> : <LuSun />}
                </IconButton>
                <MenuRoot>
                  <MenuTrigger asChild>
                    <Button variant="outline" size="sm" borderColor={btnColor}>
                      <Box>
                        <Avatar.Root shape="full" size="lg">
                          <Avatar.Fallback name={last_name} />
                          <Avatar.Image src={profile_img ? profile_img : null} />
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
                            <Avatar.Image src={profile_img ? profile_img : null} />
                          </Avatar.Root>
                        </MenuItem>
                      </Center>
                      <MenuItem>
                        <Text fontWeight="bold">{userInfo.first_name} {userInfo.last_name}</Text>
                      </MenuItem>
                      <MenuItem>
                        <NavLink onClick={handleLogout}>{t('logout')}</NavLink>
                      </MenuItem>
                      <MenuItem>
                        <NavLink to="/home/profile">{t('nav_profile')}</NavLink>
                      </MenuItem>
                    </VStack>
                  </MenuContent>
                </MenuRoot>
              </Flex>
              
            </HStack>
          ) : (
            <Flex justifyContent="space-between">
              <MenuRoot>
                <MenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <GiHamburgerMenu /> {t('menu')}
                  </Button>
                </MenuTrigger>
                <MenuContent>
                  <MenuItem value="home">
                    <NavLink to="/home">{t('nav_home')}</NavLink>
                  </MenuItem>
                  <MenuItem value="management">
                    <NavLink to="/home/admin">{t('management')}</NavLink>
                  </MenuItem>
                  <MenuItem value="report">
                    <NavLink to="/home/management/report/chart">{t('reports')}</NavLink>
                  </MenuItem>
                  <MenuItem value="profile">
                    <NavLink to="/home/profile">{t('nav_profile')}</NavLink>
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
              <Flex>
                <LanguageSelector />
                <IconButton onClick={toggleColorMode} size="sm">
                  {colorMode === 'light' ? <LuMoon /> : <LuSun />}
                </IconButton>
              </Flex>
            </Flex>
          )}
        </Box>
      ) : null}
    </Box>
  );
};

export default NavDashboard;