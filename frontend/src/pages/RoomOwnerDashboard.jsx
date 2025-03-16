import React, { useEffect } from 'react';
import Nav from '../components/RoomOwner/Nav';
import useUsers from '../services/useUsers';
import { Outlet, useNavigate, Link } from 'react-router';
import { Box, Container, HStack, VStack, Flex, Center } from '@chakra-ui/react';

const RoomOwnerDashboard = () => {

  return (
    <Container mt={2}>
      <Box border="1px solid" rounded={8} mx={4} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
        <Nav />
      </Box>
      <Container>
        <Outlet/>
      </Container>
    </Container>
  );
};

export default RoomOwnerDashboard;
