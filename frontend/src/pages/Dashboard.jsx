import { useEffect } from 'react';

import { useColorModeValue } from '../components/ui/color-mode';
import { useSelector } from 'react-redux';
import useProfile from '../services/ProfileHook';
import NavDashboard from '../components/NavBars/Nav-Dashboard';

import { useNavigate, Link, Outlet } from 'react-router';
import { Box, Container, VStack, HStack} from '@chakra-ui/react';


const Dashboard = () => {
  const mainBg = useColorModeValue('gray.50', 'black');
  let navigate = useNavigate();

  const { userInfo } = useSelector(state => state.auth);
  const{is_owner, full_name } = useProfile(userInfo?.id)

  console.log("is_owner:", is_owner);
  console.log("full name", full_name);

  return (
    <Container fluid>
      <NavDashboard/>
      <Box maxW="1440px">
        <Outlet/>
      </Box>
    </Container>
  )

};

export default Dashboard;
