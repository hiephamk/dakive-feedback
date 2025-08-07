
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import { MdDelete } from "react-icons/md";
import {
  Container,
  Stack,
  Box,
  Input,
  HStack,
  VStack,
  Button,
  Heading,
  Text,
  Checkbox,
  Flex,
} from '@chakra-ui/react';
import { Toaster, toaster } from "../ui/toaster"
import useOrganization from './OrganizationHook';
import { useNavigate, useParams } from 'react-router';
import api from '../../services/api';
import useOrganization_Membership from './Organization_Membership_Hook';


const Add_Member = ({onSuccess}) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const { members } = useOrganization_Membership()
  const { orgId } = useParams()
  const navigate = useNavigate();

  const { organizations } = useOrganization();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('viewer');
  const [isadmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = async (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setFilteredItems([]);
      setIsDropdownVisible(false);
      return;
    }

    const url = `${import.meta.env.VITE_SEARCH_ACCOUNT_URL}${keyword}`;
    try {
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const items = Array.isArray(response.data)
        ? response.data
        : response.data.items || [];

      setFilteredItems(items);
      setIsDropdownVisible(true);
    } catch (error) {
      console.error('Error fetching users:', error);
      setFilteredItems([]);
      setIsDropdownVisible(false);
    }
  };

  const handleItemClick = (item) => {
    setSelectedUser(item);
    setSearchKeyword('');
    setIsDropdownVisible(false);
  };

  const handleRemoveUser = () => {
    setSelectedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !organization || !role) {
      toaster.create({
        title: 'Incomplete Form',
        description: 'Please complete all fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const url = import.meta.env.VITE_ORGANIZATION_ADD_MEMBERS_URL;
    try {
      await api.post(
        url,
        {
          user: selectedUser.user,
          role: role,
          organization: organization,
          is_admin: isadmin,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (onSuccess) {
        onSuccess(); // Notify parent to refresh
      }
      
      toaster.create({
        title: 'Member Added',
        description: 'New member added successfully.',
        status: 'success',
        duration: 1000,
        isClosable: true,
      });
      
      setSelectedUser(null);
      setOrganization('');
      setRole('viewer');
      setIsAdmin(false);
      navigate(`/home/admin/organization/details/${organization}`);
    } catch (error) {
      console.error('Error adding member:', error.response?.data || error.message);
      toaster.create({
        title: 'Error',
        description: 'Failed to add new member.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      if (error.response && error.response.status === 400) {
        // Extract error message from the response
        const errorMessage = error.response.data.non_field_errors || error.response.data.name || 'This name already exists';
        // setErrors(errorMessage);
        alert(errorMessage)
      } else {
          console.error("Unexpected error:", error);
          // setErrors('An unexpected error occurred');
          alert("An unexpected error occurred");
        }
    }
  };
  useEffect(() => {
    if (isadmin && role !== "editor") {
      setRole("editor");
    }
  }, [isadmin]);
  return (
    <Box>
      <Box mt={"10px"} h={"500px"} maxW="600px" w={"300px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" border="1px solid" rounded={8}>
        <VStack
          shadow="md"
          p={6}
          spacing={4}
          rounded="md"
          borderWidth={1}
          align="stretch"
        >
          <Heading fontSize="xl">Exist Users</Heading>
          {/* Search Box */}
          <Box position="relative">
            <Input
              placeholder="Search for a user"
              value={searchKeyword}
              onChange={handleSearch}
              size="md"
            />
            {isDropdownVisible && (
              <Box
                ref={dropdownRef}
                position="absolute"
                zIndex="dropdown"
                bg="gray"
                borderWidth={1}
                mt={1}
                w="100%"
                rounded="md"
                overflow="hidden"
                maxHeight="200px"
                overflowY="auto"
              >
                {filteredItems.length === 0 ? (
                  <Box px={4} py={2} color="gray.500">
                    No users found
                  </Box>
                ) : (
                  filteredItems.map((item) => (
                    <Box
                      key={item.id}
                      px={4}
                      py={2}
                      _hover={{ bg: 'gray.500', cursor: 'pointer' }}
                      onClick={() => handleItemClick(item)}
                    >
                      {item.full_name} - {item.email}
                    </Box>
                  ))
                )}
              </Box>
            )}
          </Box>
          {/* Selected User */}
          {selectedUser && (
            <Flex p={2} bg="gray.400" rounded="md" justifyContent="space-between">
              <Text>{selectedUser.full_name} - {selectedUser.email}</Text>
              <Button size="xs" colorScheme="red" onClick={handleRemoveUser}>
                <MdDelete/>
              </Button>
            </Flex>
          )}
          {/* Organization Dropdown */}
          <Box>
            <Text mb={1}>Select Organization</Text>
            <select
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">-- Choose an organization --</option>
              {members
                .filter(member => member.user === userInfo?.id && member.organization ===Number(orgId))
                .map(member => organizations
                    .filter(org => org.id === member.organization)
                    .map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                  ))
                )
              }
            </select>
          </Box>
          <Box>
            <HStack align="flex-start">
              <Checkbox.Root
                checked={isadmin}
                onCheckedChange={(e) => setIsAdmin(!!e.checked)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Admin</Checkbox.Label>
              </Checkbox.Root>
            </HStack>
          </Box>
          {/* Role Dropdown */}
          {isadmin ? (
            <Box>
              <Text mb={1}>Select Role</Text>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="editor">Editor</option>
              </select>
            </Box>):(
            <Box>
              <Text mb={1}>Select Role</Text>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="">-- Choose a role --</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
          </Box>
          )}
          <Button colorScheme="blue" onClick={handleSubmit}>
            Add Member
          </Button>
        </VStack>
      </Box>
      <HStack gap={"30px"} justifyContent={"space-evenly"}>
      </HStack>
    </Box>
  );
};

export default Add_Member;