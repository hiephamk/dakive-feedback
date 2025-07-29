
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Text, Button, VStack, Tabs, Table, HStack, Center, Switch} from '@chakra-ui/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useAccessToken from '../../services/token';
import useOrganization from './OrganizationHook';
import useBuilding from '../BuildingManagement/BuildingHook';
import useOrganization_Membership from './Organization_Membership_Hook';
import Add_Member from './Add_Member';
import { Toaster, toaster } from "../ui/toaster";
import api from '../../services/api';
import BuildingListOrg from '../BuildingManagement/BuildingListOrg';
import RegisterMembers from './RegisterMembers';
import CreateBuildingOrg from '../BuildingManagement/CreeateBuildingOrg';
import useUsers from '../../services/useUsers';
import SyncBuildings from '../Sensor-Data/SyncBuildings';

const Organization_Details = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const navigate = useNavigate();
  const { orgId } = useParams();

  const { organizations, ListOrganizations } = useOrganization();
  const { buildings: hookBuildings } = useBuilding(); // Renamed to avoid confusion
  const { users } = useUsers();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refetchMember, setRefetchMembers] = useState(0);
  const [fetchBuildings, setFetchBuildings] = useState([]);
  const [refetchBuildings, setRefetchBuildings] = useState(0); // Trigger for BuildingListOrg
  const [isChecked, setIChecked] = useState(true)

  // Fetch members
  const fetchMembers = async () => {
    if (!accessToken || !userInfo?.id) return;

    setLoading(true);
    setError(null);
    const url = import.meta.env.VITE_ORGANIZATION_MEMBERSHIP_LIST_URL;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    try {

      const response = await api.get(url, config);
      setMembers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Organization_Details: Error fetching members:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch buildings
  const ListBuildings = async () => {
    if (!accessToken || !orgId) return;

    setLoading(true);
    setError(null);
    const url = import.meta.env.VITE_BUILDING_LIST_URL;
    try {

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      let fetchedBuildings = Array.isArray(response.data) ? response.data : [];
      if (orgId) {
        fetchedBuildings = fetchedBuildings.filter(
          (item) => item.organization === Number(orgId)
        );
      }
      setFetchBuildings(fetchedBuildings);
      setRefetchBuildings((prev) => prev + 1); // Trigger BuildingListOrg refetch

    } catch (err) {
      console.error('Organization_Details: Error fetching buildings:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberAdded = () => {
    setRefetchMembers((prev) => prev + 1);
  };

  useEffect(() => {
    if (accessToken) {

      fetchMembers();
      ListBuildings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, refetchMember, orgId]);

  const handleUpdate = async (id) => {
    navigate(`/home/admin/organization/update_members/${id}`);
  };

  const handleDeleteMember = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this member?');
    if (!confirmDelete) return;

    if (!accessToken || !userInfo?.id) return false;

    setLoading(true);
    setError(null);

    const url = `${import.meta.env.VITE_ORGANIZATION_MEMBERSHIP_DELETE_URL}${id}/`;
    try {
      await api.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setMembers(members.filter((member) => member.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting member:', err);
      setError(err.response?.data?.message || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toaster.create({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error]);

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 450px)");
    setIsDesktop(mediaQuery.matches);
    const handleResize = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <Box>
      {isDesktop ? (
        <Box shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} h="fit-content" minH={"85vh"} rounded={'8px'} overflow={"auto"} maxHeight="100vh" maxW={"90%"}>
      <Tabs.Root defaultValue={'buildings'}>
        <Tabs.List>
          <Tabs.Trigger fontSize={"20px"} fontWeight={"bold"} value="buildings">Buildings</Tabs.Trigger>
          <Tabs.Trigger fontSize={"20px"} fontWeight={"bold"} value="members">Members</Tabs.Trigger>
          <Tabs.Trigger fontSize={"20px"} fontWeight={"bold"} value="info">Info</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="info">
          <Center ml={"30px"}>
            {organizations.length > 0 ? (
              organizations
                .filter((item) => item.id === Number(orgId))
                .map((item) => (
                  <Center key={item.id} p={2} fontSize="18px" w={"fit-content"} border={"1px solid"} mt={"20px"}>
                    <Table.Root size="sm" showColumnBorder>
                      <Table.Header w={"30%"}>
                        <Table.Row>
                          <Table.ColumnHeader fontWeight="bold" fontSize={"18px"} w={"20%"}>Information</Table.ColumnHeader>
                          <Table.ColumnHeader fontWeight="bold" fontSize={"18px"} w={"80%"} px={"10px"}>Description</Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">Name</Table.Cell>
                          <Table.Cell>{item.name}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">Street</Table.Cell>
                          <Table.Cell>{item.street}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">City</Table.Cell>
                          <Table.Cell>{item.city}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">Post Code</Table.Cell>
                          <Table.Cell>{item.postal_code}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">State</Table.Cell>
                          <Table.Cell>{item.state}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">Country</Table.Cell>
                          <Table.Cell>{item.country}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">Email</Table.Cell>
                          <Table.Cell>{item.email}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">Website</Table.Cell>
                          <Table.Cell>{item.website}</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </Center>
                ))
            ) : (
              <Box p={2}>
                <Link to="/home/management/add_organization">
                  Create a new Organization
                </Link>
              </Box>
            )}
          </Center>
        </Tabs.Content>
        <Tabs.Content value="members">
          <Box>
            <Tabs.Root variant={"outline"} defaultValue={"details"}>
              <Tabs.List>
                <Tabs.Trigger fontSize={"16px"} value="details">Details</Tabs.Trigger>
                {members.length > 0 &&
                  members.some(
                    (mem) =>
                      mem.user === userInfo.id &&
                      mem.is_admin &&
                      mem.organization === Number(orgId)
                  ) && (
                    <>
                      <Tabs.Trigger fontSize={"16px"} value="existed-members">
                        Add Existed Members
                      </Tabs.Trigger>
                      <Tabs.Trigger fontSize={"16px"} value="new-member">
                        Create A New Member
                      </Tabs.Trigger>
                    </>
                  )}
              </Tabs.List>
              <Tabs.Content value="details">
                <VStack spacing={4} p={4}>
                  {loading && <Text>Loading members...</Text>}
                  <Table.Root>
                    <Table.Header fontSize={"18px"}>
                      <Table.Row>
                        <Table.ColumnHeader>Full Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Email</Table.ColumnHeader>
                        <Table.ColumnHeader>Admin</Table.ColumnHeader>
                        <Table.ColumnHeader>Role</Table.ColumnHeader>
                        <Table.ColumnHeader>Action</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body fontSize={"16px"}>
                      {members.length > 0 &&
                        members
                          .filter(
                            (member) =>
                              member.organization === Number(orgId) &&
                              member.user !== member.members_owner?.id &&
                              member.user !== userInfo.id
                          )
                          .map((member) => (
                            <Table.Row key={member.id}>
                              <Table.Cell>{member.members_full_name}</Table.Cell>
                              <Table.Cell>{member.members_email}</Table.Cell>
                              <Table.Cell>
                                {member.is_admin
                                  ? member.members_owner?.id === member.user
                                    ? 'Yes - Owner'
                                    : 'Yes'
                                  : 'No'}
                              </Table.Cell>
                              <Table.Cell>
                                {members.some(
                                  (mem) =>
                                    mem.user === userInfo.id &&
                                    mem.is_admin &&
                                    mem.organization === Number(orgId)
                                ) ? (
                                  <Button onClick={() => handleUpdate(member.id)}>
                                    {member.role}
                                  </Button>
                                ) : (
                                  <Button disabled>{member.role}</Button>
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                {members.some(
                                  (mem) =>
                                    mem.user === userInfo.id &&
                                    mem.is_admin &&
                                    mem.organization === Number(orgId)
                                ) ? (
                                  <Button
                                    colorScheme="red"
                                    size="sm"
                                    onClick={() => handleDeleteMember(member.id)}
                                  >
                                    Delete
                                  </Button>
                                ) : null}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                    </Table.Body>
                  </Table.Root>
                </VStack>
              </Tabs.Content>
              <Tabs.Content value="existed-members">
                {members.length > 0 &&
                  members.some(
                    (mem) =>
                      mem.user === userInfo.id &&
                      mem.is_admin &&
                      mem.organization === Number(orgId)
                  ) && (
                    <Center>
                      <Add_Member onSuccess={handleMemberAdded} />
                    </Center>
                  )}
              </Tabs.Content>
              <Tabs.Content value="new-member">
                {members.length > 0 &&
                  members.some(
                    (mem) =>
                      mem.user === userInfo.id &&
                      mem.is_admin &&
                      mem.organization === Number(orgId)
                  ) && (
                    <Center>
                      <RegisterMembers onSuccess={handleMemberAdded} />
                    </Center>
                  )}
              </Tabs.Content>
            </Tabs.Root>
          </Box>
        </Tabs.Content>
        <Tabs.Content value="buildings">
          <Box>
            <Tabs.Root variant={"outline"} defaultValue={"list-building"}>
              <Tabs.List>
                <Tabs.Trigger fontWeight="bold" fontSize={"16px"} value="list-building">
                  List of Buildings
                </Tabs.Trigger>
                {members.length > 0 &&
                  members.some(
                    (mem) =>
                      mem.user === userInfo.id &&
                      (mem.is_admin || mem.role === "editor") &&
                      mem.organization === Number(orgId)
                  ) && (
                    <Tabs.Trigger fontWeight="bold" fontSize={"16px"} value="new-building">
                      Create a New Building
                    </Tabs.Trigger>
                  )}
              </Tabs.List>
              <Tabs.Content value="list-building">
                <BuildingListOrg
                  organization={Number(orgId)}
                  buildings={fetchBuildings}
                  refetchTrigger={refetchBuildings}
                />
              </Tabs.Content>
              <Tabs.Content value="new-building">
                {members.length > 0 &&
                  members.some(
                    (mem) =>
                      mem.user === userInfo.id &&
                      (mem.is_admin || mem.role === "editor") &&
                      mem.organization === Number(orgId)
                  ) && (
                    <VStack>
                      <Box border={"1px solid"} p={"20px"} rounded={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
                        <Switch.Root
                          checked={isChecked}
                          onCheckedChange={(e) => setIChecked(e.checked)}
                          invalid
                        >
                          <Switch.HiddenInput/>
                          <Switch.Label>Sync Buildings from Sensor</Switch.Label>
                          <Switch.Control bg={"blue"}/>
                          <Switch.Label>Create new Buildings</Switch.Label>
                        </Switch.Root>
                      </Box>
                      {isChecked ? (
                        <Box border={"1px solid"} mt={"20px"} rounded={"7px"}>
                          <CreateBuildingOrg />
                        </Box>):(
                        <Box border={"1px solid"} mt={"20px"} p={"20px"} rounded={"7px"}>
                          <SyncBuildings
                            organizationId={Number(orgId)}
                            onSyncSuccess={ListBuildings}
                          />
                      </Box>
                      )}
    
                    </VStack>
                )}
              </Tabs.Content>
            </Tabs.Root>
          </Box>
        </Tabs.Content>
      </Tabs.Root>
      <Toaster />
    </Box>
      ):(
        <BuildingListOrg
          organization={Number(orgId)}
          buildings={fetchBuildings}
          refetchTrigger={refetchBuildings}
        />
      )}
    </Box>
  );
};

export default Organization_Details;