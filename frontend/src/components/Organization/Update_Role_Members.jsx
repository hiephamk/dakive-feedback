import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
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
} from '@chakra-ui/react';
import axios from 'axios';
import useOrganization from './OrganizationHook';
import { useNavigate } from 'react-router';
import useUsers from '../../services/useUsers';
import { useParams } from 'react-router-dom';
import useOrganization_Membership from './Organization_Membership_Hook';

const Update_Role_Members = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const navigate = useNavigate();
  const { users } = useUsers();

  console.log("user list:", users)

  const { organizations } = useOrganization();
  const { id, orgId } = useParams();
  const [isadmin, setIsAdmin] = useState(false)

  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('viewer');
  const [organization, setOrganization] = useState('');
  const {members} = useOrganization_Membership();

    useEffect(() => {
  if (members && id) {
    const memberToEdit = members.find((m) => m.id === Number(id));
    if (memberToEdit) {
      setUserId(memberToEdit.user); // or memberToEdit.user.id
      setOrganization(memberToEdit.organization); // or memberToEdit.organization.id
      setRole(memberToEdit.role);
    }
  }
}, [id, members]);
  const handleSubmit = async (id) => {

    const url = `${import.meta.env.VITE_ORGANIZATION_MEMBERSHIP_UPDATE_URL}${id}/`
    try {
      await axios.put(url, {
        user: userId,
        role: role,
        organization: organization,
        is_admin: isadmin,    
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      alert('Update role successfully');
      setUserId('');
      setRole('viewer');
      setOrganization('');

      navigate(`/home/admin/organization/details/${organization}`);
    } catch (error) {
      console.error('Error response:', error.response?.data || error.message);
      alert('Failed to update role member');
    } 
  };

  return (
    <Container justifyContent="center" maxW="500px" mt={10}>
      <HStack>
        <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={4} rounded={7} minW="100%">
          <Heading my={4}>Update Member Role</Heading>

          

          <VStack gap={4} justifyContent="space-between" w="100%">
            <HStack w="100%" gap={4}>
              <label htmlFor="organization">Organization:</label>
              <Box border="1px solid" p={1} rounded={5} w="100%">
                <select
                  name="organization"
                  id="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  style={{ width: '100%' }}
                  disabled={true}
                >
                  <option value="">Choose an organization</option>
                  {members
                    // .filter(member => member.user === userInfo?.id && member.organization ===Number(orgId))
                    .map(member => organizations
                      .filter(org => org.id === member.organization)
                      .map((org) => (
                          <option key={org.id} value={org.id}>
                              {org.name}
                          </option>)))
                  }
                </select>
              </Box>
            </HStack>

            <HStack w="100%" gap={4}>
              <label htmlFor="user">Member:</label>
              <Box border="1px solid" p={1} rounded={5} w="100%">
                <select
                  name="user"
                  id="user"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  style={{ width: '100%' }}
                  // disabled={true}
                >
                  <option value="">Choose a user</option>
                  {members
                    .filter(mem => mem.id === Number(id))
                    .map(mem => users
                        .filter(user => user.user === mem.user)
                        .map(user => (
                          <option key={user.id} value={user.user}>{user.email}</option>
                        ))
                    )
                  }
                </select>
              </Box>
            </HStack>
            <HStack align="flex-start">
            
              <Checkbox.Root
                checked={isadmin}
                onCheckedChange={(e) => setIsAdmin(!!e.checked)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Is Admin</Checkbox.Label>
              </Checkbox.Root>
            </HStack>
            <HStack w="100%" gap={4}>
            <label htmlFor="role">Role:</label>
            <Box border="1px solid" p={1} rounded={5} w="100%">
              <select
                name="role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%' }}
                
              >
                <option value="">Choose a role</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </Box>
          </HStack>
          </VStack>

          <Button onClick={() => handleSubmit(id)}>
            Update
          </Button>
        </VStack>
      </HStack>
    </Container>
  );
};

export default Update_Role_Members;
