
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Box, Text as ChakraText, Button, VStack, Tabs, Table, HStack, Center, Switch} from '@chakra-ui/react';
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
  const { t } = useTranslation();
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const navigate = useNavigate();
  const { orgId } = useParams();

  const { organizations, ListOrganizations } = useOrganization();
  const { buildings: hookBuildings } = useBuilding();
  const { users } = useUsers();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refetchMember, setRefetchMembers] = useState(0);
  const [fetchBuildings, setFetchBuildings] = useState([]);
  const [refetchBuildings, setRefetchBuildings] = useState(0);
  const [isChecked, setIChecked] = useState(true)

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
      setError(t('organization_details.error_fetching_members'));
    } finally {
      setLoading(false);
    }
  };

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
      setRefetchBuildings((prev) => prev + 1);
    } catch (err) {
      console.error('Organization_Details: Error fetching buildings:', err);
      setError(t('organization_details.error_fetching_buildings'));
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
  }, [accessToken, refetchMember, orgId]);

  const handleUpdate = async (id) => {
    navigate(`/home/admin/organization/update_members/${id}`);
  };

  const handleDeleteMember = async (id) => {
    const confirmDelete = window.confirm(t('organization_details.delete_member_confirm'));
    if (!confirmDelete) return;

    if (!accessToken || !userInfo?.id) return false;

    setLoading(true);
    setError(null);

    const url = `${import.meta.env.VITE_ORGANIZATION_MEMBERSHIP_DELETE_URL}${id}/`;
    console.log("url delete member:", url)
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
      setError(t('organization_details.error_deleting_member'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toaster.create({
        title: t('organization_details.error_title'),
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
          <Tabs.Trigger fontSize={"20px"} fontWeight={"bold"} value="buildings">{t('organization_details.buildings')}</Tabs.Trigger>
          <Tabs.Trigger fontSize={"20px"} fontWeight={"bold"} value="members">{t('organization_details.members')}</Tabs.Trigger>
          <Tabs.Trigger fontSize={"20px"} fontWeight={"bold"} value="info">{t('organization_details.info')}</Tabs.Trigger>
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
                          <Table.ColumnHeader fontWeight="bold" fontSize={"18px"} w={"20%"}>{t('organization_details.information')}</Table.ColumnHeader>
                          <Table.ColumnHeader fontWeight="bold" fontSize={"18px"} w={"80%"} px={"10px"}>{t('organization_details.description')}</Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">{t('organization_details.name')}</Table.Cell>
                          <Table.Cell>{item.name}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">{t('organization_details.street')}</Table.Cell>
                          <Table.Cell>{item.street}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">{t('organization_details.city')}</Table.Cell>
                          <Table.Cell>{item.city}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">{t('organization_details.postal_code')}</Table.Cell>
                          <Table.Cell>{item.postal_code}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">{t('organization_details.state')}</Table.Cell>
                          <Table.Cell>{item.state}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">{t('organization_details.country')}</Table.Cell>
                          <Table.Cell>{item.country}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">{t('organization_details.email')}</Table.Cell>
                          <Table.Cell>{item.email}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold">{t('organization_details.website')}</Table.Cell>
                          <Table.Cell>{item.website}</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </Center>
                ))
            ) : (
              <Box p={2}>
                <Link to="/home/management/add_organization">
                  {t('organization_details.create_new_organization')}
                </Link>
              </Box>
            )}
          </Center>
        </Tabs.Content>
        <Tabs.Content value="members">
          <Box>
            <Tabs.Root variant={"outline"} defaultValue={"details"}>
              <Tabs.List>
                <Tabs.Trigger fontSize={"16px"} value="details">{t('organization_details.details')}</Tabs.Trigger>
                {members.length > 0 &&
                  members.some(
                    (mem) =>
                      mem.user === userInfo.id &&
                      mem.is_admin &&
                      mem.organization === Number(orgId)
                  ) && (
                    <>
                      <Tabs.Trigger fontSize={"16px"} value="existed-members">
                        {t('organization_details.add_existed_members')}
                      </Tabs.Trigger>
                      <Tabs.Trigger fontSize={"16px"} value="new-member">
                        {t('organization_details.create_new_member')}
                      </Tabs.Trigger>
                    </>
                  )}
              </Tabs.List>
              <Tabs.Content value="details">
                <VStack spacing={4} p={4}>
                  {loading && <ChakraText>{t('organization_details.loading_members')}</ChakraText>}
                  <Table.Root>
                    <Table.Header fontSize={"18px"}>
                      <Table.Row>
                        <Table.ColumnHeader>{t('organization_details.full_name')}</Table.ColumnHeader>
                        <Table.ColumnHeader>{t('organization_details.email')}</Table.ColumnHeader>
                        <Table.ColumnHeader>{t('organization_details.admin')}</Table.ColumnHeader>
                        <Table.ColumnHeader>{t('organization_details.role')}</Table.ColumnHeader>
                        <Table.ColumnHeader>{t('organization_details.action')}</Table.ColumnHeader>
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
                                    ? t('organization_details.yes_owner')
                                    : t('organization_details.yes')
                                  : t('organization_details.no')}
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
                                    {t('organization_details.delete')}
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
                  {t('organization_details.list_of_buildings')}
                </Tabs.Trigger>
                {members.length > 0 &&
                  members.some(
                    (mem) =>
                      mem.user === userInfo.id &&
                      (mem.is_admin || mem.role === "editor") &&
                      mem.organization === Number(orgId)
                  ) && (
                    <Tabs.Trigger fontWeight="bold" fontSize={"16px"} value="new-building">
                      {t('organization_details.create_new_building')}
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
                          <Switch.Label>{t('organization_details.sync_buildings')}</Switch.Label>
                          <Switch.Control bg={"blue"}/>
                          <Switch.Label>{t('organization_details.create_new_buildings')}</Switch.Label>
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