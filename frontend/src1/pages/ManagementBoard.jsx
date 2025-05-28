import React, { useEffect } from 'react';
import NavBar from '../components/BuildingManagement/Nav-ManagerBoard';
import useUsers from '../services/useUsers';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, Link } from 'react-router';
import { Box, Stack,HStack, VStack, Flex, Container} from '@chakra-ui/react';

const ManagementBoard = () => {
  const { Owner } = useUsers();
  const { user, userInfo } = useSelector(state => state.auth);
  const navigate = useNavigate();


  return (
    <Container mt={4}>
        <Box rounded={8} mx={4} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
          <NavBar />
        </Box>
        <Box>
          <Outlet />
        </Box>
    </Container>
  );
};

export default ManagementBoard;
