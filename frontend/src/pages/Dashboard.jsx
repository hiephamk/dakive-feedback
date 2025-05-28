import NavDashboard from '../components/NavBars/Nav-Dashboard';
import { Outlet } from 'react-router';
import { Box, Container, VStack, HStack} from '@chakra-ui/react';


const Dashboard = () => {
  return (
    <Box width={"100%"} maxW="100vw" p="10px" boxSizing="border-box">
      <NavDashboard/>
      <Box>
        <Outlet/>
      </Box>
    </Box>
  )

};

export default Dashboard;
