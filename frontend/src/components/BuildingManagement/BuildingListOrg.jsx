import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import {
  Container,
  Tabs,
  Box,
  InputGroup,
  Input,
  HStack,
  Image,
  Flex,
  Center,
  Button,
  Menu,
  Portal,
  Dialog,
  Text as ChakraText,
  CloseButton,
  VStack,
  Stack,
  Table,
  HoverCard
} from '@chakra-ui/react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { LuSearch } from 'react-icons/lu';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BsBuildingsFill } from 'react-icons/bs';
import { PiDotsThreeCircleFill } from 'react-icons/pi';
import { FaListUl } from 'react-icons/fa';
import { AiTwotoneAppstore } from 'react-icons/ai';
import useOrganization_Membership from '../Organization/Organization_Membership_Hook';

const BuildingListOrg = ({ organization, buildings: refetchTrigger }) => {
  const { t } = useTranslation();
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const { members } = useOrganization_Membership();
  const { orgId, id } = useParams();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [buildings, setBuildings] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [building_size, setBuildingSize] = useState('');
  const [building_city, setBuildingCity] = useState('');
  const [building_street, setBuildingStreet] = useState('');
  const [postal_code, setPostalCode] = useState('');
  const [building_name, setBuildingName] = useState('');

  const ListBuilding = async () => {
    if (!accessToken || !userInfo?.id) return;
    const url = import.meta.env.VITE_BUILDING_LIST_URL;
    try {
      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      let fetchedBuilding = Array.isArray(res.data) ? res.data : [];

      // Filter by organization
      if (organization) {
        fetchedBuilding = fetchedBuilding.filter(
          (item) => item.organization === Number(organization)
        );
      }

      // Apply filters
      if (building_city) {
        fetchedBuilding = fetchedBuilding.filter((item) => item.city === building_city);
      }
      if (postal_code) {
        fetchedBuilding = fetchedBuilding.filter((item) => item.postal_code === postal_code);
      }
      if (building_street) {
        fetchedBuilding = fetchedBuilding.filter((item) => item.street === building_street);
      }
      if (building_size) {
        fetchedBuilding = fetchedBuilding.filter(
          (item) => item.building_size === building_size
        );
      }
      if (building_name) {
        fetchedBuilding = fetchedBuilding.filter((item) => item.name === building_name);
      }

      setBuildings(fetchedBuilding);

    } catch (error) {
      console.error('BuildingListOrg: Error fetching buildings:', error);
      if (error.response && error.response.status === 401) {
        alert(t('error.please_login_again'));
      } else {
        alert(t('building_list_org.error_fetching_buildings'));
      }
    }
  };

  //console.log buildings:
  useEffect(() => {
    console.log("buildings:", buildings);
  }, [buildings]);

  useEffect(() => {
    if (accessToken && userInfo?.id) {
      ListBuilding();
    }
  }, [
    accessToken,
    userInfo?.id,
    building_size,
    building_city,
    postal_code,
    building_street,
    building_name,
    refetchTrigger,
  ]);

  const handleClickViewRoom = (buildingId, externalId, orgId) => {
    navigate(`/home/management/room-list/${buildingId}/${externalId}/${orgId}`);
  };

  const handleClickViewReport = (buildingId) => {
    navigate(`/home/management/building-reports/${buildingId}`);
  };

  const SensorDataView = (buildingid, externalid) => {
    navigate(`/home/management/sensor-data/reports/${buildingid}/${externalid}`);
  };

  const handleUpdateBuilding = (building) => {
    navigate(`/home/admin/building/update/${building}`);
  };

  const handleDeleteBuilding = async (building) => {
    if (!accessToken || !userInfo?.id) return;
    const url = `${import.meta.env.VITE_BUILDING_UPDATE_URL}${building}/`;
    try {
      await api.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setBuildings(buildings.filter((post) => post.id !== building));
    } catch (error) {
      console.error('BuildingListOrg: Error deleting building:', error);
      alert(t('building_list_org.error_deleting_building') + (error.response?.data || error.message));
    }
  };

  const generateRandom = (length = 8) => {
    return Math.random().toString(36).substring(2, 2 + length);
  };

  const handleDuplicateBuilding = async (building) => {
    const url = import.meta.env.VITE_BUILDING_CREATE_URL;
    const duplicatedData = {
      name: `${building.name} ${t('building_list_org.copy')}`,
      owner: building.owner,
      organization: building.organization,
      building_size: building.building_size,
      street: building.street,
      city: building.city,
      state: building.state,
      postal_code: building.postal_code,
      country: building.country,
      description: building.description,
      external_id: generateRandom(),
    };

    try {
      const res = await api.post(url, duplicatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setBuildings((prev) => [...prev, res.data]);
      alert(t('building_list_org.building_duplicated'));
    } catch (error) {
      console.error('BuildingListOrg: Error duplicating building:', error);
      if (error.response?.status === 401) {
        alert(t('error.please_login_again'));
      } else {
        alert(t('building_list_org.error_duplicating_building'));
      }
    }
  };

  const handleBuildingSizeChange = (e) => {
    setBuildingSize(e.target.value);
  };

  const handleBuildingCityChange = (e) => {
    setBuildingCity(e.target.value);
  };

  const handleBuildingPostalCodeChange = (e) => {
    setPostalCode(e.target.value);
  };

  const handleBuildingStreetChange = (e) => {
    setBuildingStreet(e.target.value);
  };

  const handleBuildingNameChange = (e) => {
    setBuildingName(e.target.value);
  };

  const handleClearFilter = () => {
    setBuildingName('');
    setBuildingStreet('');
    setPostalCode('');
    setBuildingCity('');
    setBuildingSize('');
  };

  const handleBuildingSearch = async (e) => {
    if (e) e.preventDefault();
    const searchKeyword = keyword.trim();
    if (!searchKeyword) {
      ListBuilding();
      return;
    }
    setLoading(true);
    const url = `${import.meta.env.VITE_BUILDING_SEARCH_URL}?keyword=${encodeURIComponent(keyword)}`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const res = await api.get(url, config);
      let searchFilter = Array.isArray(res.data) ? res.data : [];
      if (organization) {
        searchFilter = searchFilter.filter(
          (item) => item.organization === Number(organization)
        );
      }
      if (building_size) {
        searchFilter = searchFilter.filter(
          (item) => item.building_size === Number(building_size)
        );
      }
      setBuildings(searchFilter);
    } catch (error) {
      console.error('BuildingListOrg: Error searching building:', error);
      alert(t('building_list_org.error_searching_building'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event && event.key === 'Enter') {
      handleBuildingSearch();
    }
  };

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (value.trim() === '') {
      ListBuilding();
    }
  };

  useEffect(() => {
    if (keyword.trim() === '') {
      ListBuilding();
    }
  }, [keyword]);

  const endElement = keyword ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setKeyword('');
        inputRef.current?.focus();
      }}
      me="-2"
    />
  ) : undefined;

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
        <Box w={'75vw'} maxW={'100%'} justifyContent={'center'}>
          <Box>
            <HStack justifyContent={'space-evenly'}>
              <Box p={2} fontSize="16px" fontWeight="bold" border={'1px solid'} rounded={'7px'}>
                <label htmlFor="city"></label>
                <select value={building_city} onChange={handleBuildingCityChange} id="city">
                  <option value="">{t('building_list_org.all_cities')}</option>
                  {[...new Set(buildings.filter((item) => item.organization === organization).map((building) => building.city))]
                  .map((uniqueBuildingCity, idx) => (
                    <option key={idx} value={uniqueBuildingCity}>
                      {uniqueBuildingCity}
                    </option>
                  ))}
                </select>
              </Box>
              <Box my={10} p={2} fontSize="16px" fontWeight="bold" border={'1px solid'} rounded={'7px'}>
                <label htmlFor="postal_code"></label>
                <select value={postal_code} onChange={handleBuildingPostalCodeChange} id="postal_code">
                  <option value="">{t('building_list_org.all_postcodes')}</option>
                  {[...new Set(buildings.filter((item) => item.organization === organization).map((building) => building.postal_code))].map((uniquePostalCode, idx) => (
                    <option key={idx} value={uniquePostalCode}>
                      {uniquePostalCode}
                    </option>
                  ))}
                </select>
              </Box>
              <Box my={10} p={2} fontSize="16px" fontWeight="bold" border={'1px solid'} rounded={'7px'}>
                <label htmlFor="building_street"></label>
                <select value={building_street} onChange={handleBuildingStreetChange} id="building_street">
                  <option value="">{t('building_list_org.all_streets')}</option>
                  {[...new Set(buildings.filter((item) => item.organization === organization).map((building) => building.street))].map((uniqueStreet, idx) => (
                    <option key={idx} value={uniqueStreet}>
                      {uniqueStreet}
                    </option>
                  ))}
                </select>
              </Box>
              <Box my={10} p={2} fontSize="16px" fontWeight="bold" border={'1px solid'} rounded={'7px'}>
                <label htmlFor="size"></label>
                <select value={building_size} onChange={handleBuildingSizeChange} id="size">
                  <option value="">{t('building_list_org.all_sizes')}</option>
                  {[...new Set(buildings.filter((item) => item.organization === organization).map((building) => building.building_size))].map((uniqueBuildingSize, idx) => (
                    <option key={idx} value={uniqueBuildingSize ? `${uniqueBuildingSize}` : 'N/A'}>
                      {uniqueBuildingSize ? `${uniqueBuildingSize}` : 'N/A'}
                    </option>
                  ))}
                </select>
              </Box>
              <Box my={10} p={2} fontSize="16px" fontWeight="bold" border={'1px solid'} rounded={'7px'}>
                <label htmlFor="name"></label>
                <select value={building_name} onChange={handleBuildingNameChange} id="name">
                  <option value="">{t('building_list_org.all_names')}</option>
                  {[...new Set(buildings.filter((item) => item.organization === organization).map((building) => building.name))].map((uniqueBuildingName, idx) => (
                    <option key={idx} value={uniqueBuildingName}>
                      {uniqueBuildingName}
                    </option>
                  ))}
                </select>
              </Box>
              <Box>
                <Button onClick={handleClearFilter}>{t('building_list_org.clear')}</Button>
              </Box>
            </HStack>
            <Center w={'80vw'}>
              <form onSubmit={handleBuildingSearch}>
                <InputGroup flex="1" startElement={<LuSearch />} endElement={endElement} border={'1px solid'} rounded={'5px'}>
                  <Input
                    ref={inputRef}
                    id="search"
                    type="search"
                    value={keyword}
                    onChange={handleKeywordChange}
                    onKeyDown={handleKeyDown}
                    placeholder={t('building_list_org.search_placeholder')}
                  />
                </InputGroup>
              </form>
            </Center>
          </Box>
          <Box justifyContent={'space-evenly'} alignItems={'center'} rounded={8}>
            <Tabs.Root defaultValue={'list'}>
              <Tabs.List>
                <Tabs.Trigger value="list" fontSize={'30px'}>
                  <FaListUl />
                </Tabs.Trigger>
                <Tabs.Trigger value="card" fontSize={'30px'}>
                  <AiTwotoneAppstore />
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="list" border={'1px solid'} rounded={'7px'} mt={'10px'}>
                <Table.Root size="sm" showColumnBorder>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'}>
                        {t('building_list_org.name')}
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'}>
                        {t('building_list_org.organization')}
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'}>
                        {t('building_list_org.address')}
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'}>
                        {t('building_list_org.city')}
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'}>
                        {t('building_list_org.postal_code')}
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'}>
                        {t('building_list_org.descriptions')}
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'}>
                        {t('building_list_org.image')}
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'}>
                        {t('building_list_org.building_rating')}
                      </Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold" fontSize={'16px'} px={'10px'} textAlign={'center'}>
                        {t('building_list_org.action')}
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  {buildings.length > 0 ? (
                    buildings
                      .filter((building) => building.organization === organization)
                      .map((item) => (
                        <Table.Body key={item.id}>
                          <Table.Row>
                            <Table.Cell>{item.name || 'N/A'}</Table.Cell>
                            <Table.Cell>{item.organization_name || 'N/A'}</Table.Cell>
                            <Table.Cell>{item.street}</Table.Cell>
                            <Table.Cell>{item.city || 'N/A'}</Table.Cell>
                            <Table.Cell>{item.postal_code || 'N/A'}</Table.Cell>
                            <Table.Cell>{item.description}</Table.Cell>
                            <Table.Cell>
                              <Image rounded={'md'} maxW={'70px'} maxH={'100px'} src={item.building_img} />
                            </Table.Cell>
                            <Table.Cell>
                              <HStack>
                                {Array.from({ length: 5 }, (_, index) => {
                                  const rating = item.room_average_rating || 0;
                                  const full = index + 1 <= Math.floor(rating);
                                  const half = rating - index > 0 && rating - index < 1;
                                  return (
                                    <ChakraText color={'yellow.500'} key={index}>
                                      {full ? <FaStar /> : half ? <FaStarHalfAlt /> : <FaRegStar />}
                                    </ChakraText>
                                  );
                                })}
                              </HStack>
                            </Table.Cell>
                            <Table.Cell>
                              {members.some(
                                (item) =>
                                  item.user === userInfo?.id &&
                                  item.organization === Number(orgId) &&
                                  item.role === 'editor'
                              ) ? (
                                <Dialog.Root size="xs">
                                  <Menu.Root>
                                    <Menu.Trigger asChild>
                                      <Button variant="surface" size="xs">
                                        <BsThreeDotsVertical />
                                      </Button>
                                    </Menu.Trigger>
                                    <Portal>
                                      <Menu.Positioner border={"1px solid"} rounded={"5px"} background="#99a3a4" >
                                        <Menu.Content>
                                          <Menu.Item value='view-room'>
                                            <Button
                                              variant="outline" size="xs"
                                              onClick={() => handleClickViewRoom(item.id, item.external_id, item.organization)}
                                            >
                                              {t('building_list_org.view_rooms')}
                                            </Button>
                                          </Menu.Item>
                                          <Menu.Item value='update'>
                                            <Button
                                              variant="outline"
                                              size="xs"
                                              onClick={() => handleUpdateBuilding(item.id)}
                                            >
                                              {t('building_list_org.update')}
                                            </Button>
                                          </Menu.Item>
                                          <Menu.Item value='delete'>
                                            <Dialog.Trigger asChild>
                                              <Button variant="outline" size="xs">
                                                {t('building_list_org.delete')}
                                              </Button>
                                            </Dialog.Trigger>
                                          </Menu.Item>
                                          <Menu.Item>
                                            <Button
                                              variant="outline"
                                              size="xs"
                                              onClick={() => handleDuplicateBuilding(item)}
                                            >
                                              {t('building_list_org.duplicate')}
                                            </Button>
                                          </Menu.Item>
                                        </Menu.Content>
                                      </Menu.Positioner>
                                    </Portal>
                                  </Menu.Root>
                                  <Portal>
                                    <Dialog.Backdrop />
                                    <Dialog.Positioner>
                                      <Dialog.Content>
                                        <Dialog.Header>
                                          <Dialog.Title>{t('building_list_org.delete_building_title')}</Dialog.Title>
                                        </Dialog.Header>
                                        <Dialog.Body>
                                          <ChakraText>{t('building_list_org.delete_building_confirm')}</ChakraText>
                                        </Dialog.Body>
                                        <Dialog.Footer>
                                          <Dialog.ActionTrigger asChild>
                                            <Button variant="outline">{t('building_list_org.cancel')}</Button>
                                          </Dialog.ActionTrigger>
                                          <Button onClick={() => handleDeleteBuilding(item.id)}>
                                            {t('building_list_org.delete')}
                                          </Button>
                                        </Dialog.Footer>
                                        <Dialog.CloseTrigger asChild>
                                          <CloseButton size="sm" />
                                        </Dialog.CloseTrigger>
                                      </Dialog.Content>
                                    </Dialog.Positioner>
                                  </Portal>
                                </Dialog.Root>
                              ) : (
                                <Dialog.Root size="xs">
                                  <Menu.Root>
                                    <Menu.Trigger asChild>
                                      <Button variant="surface" size="xs">
                                        <BsThreeDotsVertical />
                                      </Button>
                                    </Menu.Trigger>
                                    <Portal>
                                      <Menu.Positioner border={"1px solid"} rounded={"5px"} background="#99a3a4" >
                                        <Menu.Content>
                                          <Menu.Item>
                                            <Button
                                              variant="outline" size="xs"
                                              onClick={() => handleClickViewRoom(item.id, item.external_id, item.organization)}
                                            >
                                              {t('building_list_org.view_rooms')}
                                            </Button>
                                          </Menu.Item>
                                        </Menu.Content>
                                      </Menu.Positioner>
                                    </Portal>
                                  </Menu.Root>
                                </Dialog.Root>
                              )
                            }
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      ))
                  ) : (
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell colSpan={8} textAlign="center">
                          {t('building_list_org.no_buildings_found')}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  )}
                </Table.Root>
              </Tabs.Content>
              <Tabs.Content value="card">
                <HStack p={4} wrap={'wrap'} justifyContent={'space-evenly'} alignItems={'center'} >
                  {buildings
                    .filter((item) => item.organization === organization)
                    .map((building) => (
                      <Box
                        key={building.id}
                        w={'300px'}
                        h={'470px'}
                        my={'10px'}
                        shadow="1px 1px 15px 5px rgb(75, 75, 79)"
                        rounded={'8px'}
                        position={"relative"}
                      >
                        <VStack>
                          <Flex p={'10px'} gap={2} mb={'10px'} justifyContent={'space-between'} w={'100%'}>
                            <Box w={"100%"}>
                              <Center>
                                <Image
                                  p={'2px'}
                                  bg={'white'}
                                  rounded={'5px'}
                                  height="150px"
                                  src={building.building_img || '/building.png'}
                                />
                              </Center>
                            </Box>
                            {members.some(
                              (item) =>
                                item.user === userInfo?.id &&
                                item.organization === Number(orgId) &&
                                item.role === 'editor'
                              ) ? (
                              <Dialog.Root size="xs">
                                <Menu.Root>
                                  <Menu.Trigger asChild>
                                    <Button variant="surface" size="xs">
                                      <BsThreeDotsVertical />
                                    </Button>
                                  </Menu.Trigger>
                                  <Portal>
                                    <Menu.Positioner>
                                      <Menu.Content>
                                        <Menu.Item>
                                          <Button
                                            variant="outline"
                                            size="xs"
                                            onClick={() => handleClickViewRoom(building.id, building.external_id, building.organization)}
                                          >
                                            {t('building_list_org.view_rooms')}
                                          </Button>
                                        </Menu.Item>
                                        <Menu.Item>
                                          <Button
                                            variant="outline"
                                            size="xs"
                                            onClick={() => handleUpdateBuilding(building.id)}
                                          >
                                            {t('building_list_org.update')}
                                          </Button>
                                        </Menu.Item>
                                        <Menu.Item>
                                          <Dialog.Trigger asChild>
                                            <Button variant="outline" size="xs">
                                              {t('building_list_org.delete')}
                                            </Button>
                                          </Dialog.Trigger>
                                        </Menu.Item>
                                        <Menu.Item>
                                          <Button
                                            variant="outline"
                                            size="xs"
                                            onClick={() => handleDuplicateBuilding(building)}
                                          >
                                            {t('building_list_org.duplicate')}
                                          </Button>
                                        </Menu.Item>
                                      </Menu.Content>
                                    </Menu.Positioner>
                                  </Portal>
                                </Menu.Root>
                                <Portal>
                                  <Dialog.Backdrop />
                                  <Dialog.Positioner>
                                    <Dialog.Content>
                                      <Dialog.Header>
                                        <Dialog.Title>{t('building_list_org.delete_building_title')}</Dialog.Title>
                                      </Dialog.Header>
                                      <Dialog.Body>
                                        <ChakraText>{t('building_list_org.delete_building_confirm')}</ChakraText>
                                      </Dialog.Body>
                                      <Dialog.Footer>
                                        <Dialog.ActionTrigger asChild>
                                          <Button variant="outline">{t('building_list_org.cancel')}</Button>
                                        </Dialog.ActionTrigger>
                                        <Button onClick={() => handleDeleteBuilding(building.id)}>
                                          {t('building_list_org.delete')}
                                        </Button>
                                      </Dialog.Footer>
                                      <Dialog.CloseTrigger asChild>
                                        <CloseButton size="sm" />
                                      </Dialog.CloseTrigger>
                                    </Dialog.Content>
                                  </Dialog.Positioner>
                                </Portal>
                              </Dialog.Root>
                            ) : (
                              <Menu.Root>
                                <Menu.Trigger asChild>
                                  <Button variant="surface" size="xs">
                                    <BsThreeDotsVertical />
                                  </Button>
                                </Menu.Trigger>
                                <Portal>
                                  <Menu.Positioner>
                                    <Menu.Content>
                                      <Menu.Item>
                                        <Button
                                          variant="outline" size="xs"
                                          onClick={() => handleClickViewRoom(building.id, building.external_id, item.organization)}
                                        >
                                          {t('building_list_org.view_rooms')}
                                        </Button>
                                      </Menu.Item>
                                    </Menu.Content>
                                  </Menu.Positioner>
                                </Portal>
                              </Menu.Root>
                            )
                          }
                          </Flex>
                          <Box pl={2} h="220px" overflow={'auto'} mt={'10px'} maxW={'300px'}>
                            <Table.Root showColumnBorder>
                              <Table.Body>
                                <Table.Row>
                                  <Table.Cell fontWeight="bold" fontSize="18px">
                                    {t('building_list_org.name')}
                                  </Table.Cell>
                                  <Table.Cell
                                    fontWeight="bold"
                                    fontSize="18px"
                                    whiteSpace={'normal'}
                                    maxW={'160px'}
                                  >
                                    {building.name}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell>{t('building_list_org.organization')}</Table.Cell>
                                  <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                                    {building.organization_name}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell>{t('building_list_org.rating')}</Table.Cell>
                                  <Table.Cell>
                                    <HStack>
                                      {Array.from({ length: 5 }, (_, index) => {
                                        const rating = building.room_average_rating || 0;
                                        const full = index + 1 <= Math.floor(rating);
                                        const half = rating - index > 0 && rating - index < 1;
                                        return (
                                          <ChakraText color={'yellow.500'} key={index}>
                                            {full ? <FaStar /> : half ? <FaStarHalfAlt /> : <FaRegStar />}
                                          </ChakraText>
                                        );
                                      })}
                                    </HStack>
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell>{t('building_list_org.size')}</Table.Cell>
                                  <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                                    {building.building_size ? `${building.building_size}` : 'N/A'}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell>{t('building_list_org.street')}</Table.Cell>
                                  <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                                    {building.street}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell>{t('building_list_org.city')}</Table.Cell>
                                  <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                                    {building.city}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell>{t('building_list_org.postal_code')}</Table.Cell>
                                  <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                                    {building.postal_code}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell>{t('building_list_org.country')}</Table.Cell>
                                  <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                                    {building.country}
                                  </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                  <Table.Cell>{t('building_list_org.descriptions')}</Table.Cell>
                                  <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                                    {building.description}
                                  </Table.Cell>
                                </Table.Row>
                              </Table.Body>
                            </Table.Root>
                          </Box>
                        </VStack>
                      </Box>
                    ))}
                </HStack>
              </Tabs.Content>
            </Tabs.Root>
          </Box>
        </Box>
      ) : (
        <VStack p={"10px"} wrap={'wrap'} >
          {buildings
            .filter((item) => item.organization === organization)
            .map((building) => (
              <Box
                key={building.id}
                w={'300px'}
                h={'470px'}
                my={'10px'}
                shadow="1px 1px 15px 5px rgb(75, 75, 79)"
                rounded={'8px'}
                position={"relative"}
              >
                <VStack>
                  <Flex p={'10px'} gap={2} mb={'10px'} justifyContent={'space-between'} w={'100%'}>
                    <Box w={"100%"}>
                      <Center>
                        <Image
                          p={'2px'}
                          bg={'white'}
                          rounded={'5px'}
                          height="150px"
                          src={building.building_img || '/building.png'}
                        />
                      </Center>
                    </Box>
                    {members.some(
                      (item) =>
                        item.user === userInfo?.id &&
                        item.organization === Number(orgId) &&
                        item.role === 'editor'
                      ) ? (
                        <Dialog.Root size="xs">
                          <Menu.Root>
                            <Menu.Trigger asChild>
                              <Button variant="surface" size="xs">
                                <BsThreeDotsVertical />
                              </Button>
                            </Menu.Trigger>
                            <Portal>
                              <Menu.Positioner>
                                <Menu.Content>
                                  <Menu.Item>
                                    <Button
                                      variant="outline"
                                      size="xs"
                                      onClick={() => handleClickViewRoom(building.id, building.external_id, building.organization)}
                                    >
                                      {t('building_list_org.view_rooms')}
                                    </Button>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <Button
                                      variant="outline"
                                      size="xs"
                                      onClick={() => handleUpdateBuilding(building.id)}
                                    >
                                      {t('building_list_org.update')}
                                    </Button>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <Dialog.Trigger asChild>
                                      <Button variant="outline" size="xs">
                                        {t('building_list_org.delete')}
                                      </Button>
                                    </Dialog.Trigger>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <Button
                                      variant="outline"
                                      size="xs"
                                      onClick={() => handleDuplicateBuilding(building)}
                                    >
                                      {t('building_list_org.duplicate')}
                                    </Button>
                                  </Menu.Item>
                                </Menu.Content>
                              </Menu.Positioner>
                            </Portal>
                          </Menu.Root>
                          <Portal>
                            <Dialog.Backdrop />
                            <Dialog.Positioner>
                              <Dialog.Content>
                                <Dialog.Header>
                                  <Dialog.Title>{t('building_list_org.delete_building_title')}</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                  <ChakraText>{t('building_list_org.delete_building_confirm')}</ChakraText>
                                </Dialog.Body>
                                <Dialog.Footer>
                                  <Dialog.ActionTrigger asChild>
                                    <Button variant="outline">{t('building_list_org.cancel')}</Button>
                                  </Dialog.ActionTrigger>
                                  <Button onClick={() => handleDeleteBuilding(building.id)}>
                                    {t('building_list_org.delete')}
                                  </Button>
                                </Dialog.Footer>
                                <Dialog.CloseTrigger asChild>
                                  <CloseButton size="sm" />
                                </Dialog.CloseTrigger>
                              </Dialog.Content>
                            </Dialog.Positioner>
                          </Portal>
                        </Dialog.Root>
                      ) : (
                        <Menu.Root>
                          <Menu.Trigger asChild>
                            <Button variant="surface" size="xs">
                              <BsThreeDotsVertical />
                            </Button>
                          </Menu.Trigger>
                          <Portal>
                            <Menu.Positioner>
                              <Menu.Content>
                                <Menu.Item>
                                  <Button
                                    variant="outline" size="xs"
                                    onClick={() => handleClickViewRoom(building.id, building.external_id, item.organization)}
                                  >
                                    {t('building_list_org.view_rooms')}
                                  </Button>
                                </Menu.Item>
                              </Menu.Content>
                            </Menu.Positioner>
                          </Portal>
                        </Menu.Root>
                      )
                    }
                  </Flex>
                  <Box pl={2} h="220px" overflow={'auto'} mt={'10px'} maxW={'300px'}>
                    <Table.Root showColumnBorder>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell fontWeight="bold" fontSize="18px">
                            {t('building_list_org.name')}
                          </Table.Cell>
                          <Table.Cell
                            fontWeight="bold"
                            fontSize="18px"
                            whiteSpace={'normal'}
                            maxW={'160px'}
                          >
                            {building.name}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>{t('building_list_org.organization')}</Table.Cell>
                          <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                            {building.organization_name}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>{t('building_list_org.rating')}</Table.Cell>
                          <Table.Cell>
                            <HStack>
                              {Array.from({ length: 5 }, (_, index) => {
                                const rating = building.room_average_rating || 0;
                                const full = index + 1 <= Math.floor(rating);
                                const half = rating - index > 0 && rating - index < 1;
                                return (
                                  <ChakraText color={'yellow.500'} key={index}>
                                    {full ? <FaStar /> : half ? <FaStarHalfAlt /> : <FaRegStar />}
                                  </ChakraText>
                                );
                              })}
                            </HStack>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>{t('building_list_org.size')}</Table.Cell>
                          <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                            {building.building_size ? `${building.building_size}` : 'N/A'}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>{t('building_list_org.street')}</Table.Cell>
                          <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                            {building.street}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>{t('building_list_org.city')}</Table.Cell>
                          <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                            {building.city}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>{t('building_list_org.postal_code')}</Table.Cell>
                          <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                            {building.postal_code}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>{t('building_list_org.country')}</Table.Cell>
                          <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                            {building.country}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>{t('building_list_org.descriptions')}</Table.Cell>
                          <Table.Cell whiteSpace={'normal'} maxW={'160px'}>
                            {building.description}
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </Box>
                </VStack>
              </Box>
            ))}
        </VStack>
      )}
    </Box>
  );
};

export default BuildingListOrg;