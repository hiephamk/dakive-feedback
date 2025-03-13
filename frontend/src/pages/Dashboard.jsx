import { Box, Container, Text, Spinner, HStack } from '@chakra-ui/react';
import { useColorModeValue } from '../components/ui/color-mode';
import { Link, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import useProfile from '../services/ProfileHook';

const Dashboard = () => {
  const { user, userInfo } = useSelector((state) => state.auth); 
  const mainBg = useColorModeValue('gray.50', 'black');
  
  const { accounts,} = useProfile(user);

  console.log("accounts:", accounts);
  console.log("userInfo.id:", userInfo?.id);

  return (
    <HStack my={10}>
      <Container width="20%" maxW="container.sm" py={4}>
      </Container>

      <Container
        height="85vh"
        width={['100%', '60%']}
        maxW="container.lg"
        rounded={8}
        bg={mainBg}
        shadow="3px 3px 15px 5px rgb(75, 75, 79)"
        my={4}
      >
        <Outlet />
      </Container>
      <Container width={['100%', '20%']} maxW="container.sm" />
    </HStack>
  );
};

export default Dashboard;
