import NavDashboard from '../components/NavBars/Nav-Dashboard';
import { Outlet } from 'react-router';
import { Box, Container, VStack, HStack} from '@chakra-ui/react';


const Dashboard = () => {
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
