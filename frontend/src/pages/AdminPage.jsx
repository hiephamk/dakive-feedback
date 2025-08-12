
import { useEffect, useState, useRef} from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from "react-redux"
import { useTranslation } from 'react-i18next';
import { Box, Collapsible, Dialog, InputGroup, Text, Input, Button, CloseButton, HStack, VStack, Menu, Portal, Spinner, Center, Flex, Heading} from '@chakra-ui/react'
import { LuSearch } from "react-icons/lu"
import HomeOrganization from '../components/Organization/HomeOrganization'

import useAccessToken from '../services/token'
import { BsThreeDotsVertical } from "react-icons/bs";
import api from '../services/api'

const AdminPage = () => {
  const { t } = useTranslation();
  const {user, userInfo } = useSelector(state => state.auth)
  const accessToken = useAccessToken(user)
  const navigate = useNavigate()
  const location = useLocation()
  const hasTriedToLoad = useRef(false);
  const inputRef = useRef(null);
  
  const [members, setMembers ] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError ] = useState(null)
  const [selectedOrgId, setSelectedOrgId] = useState(null)
  const [organizations, setOrganizations ] = useState([])

  const [org_name, setOrgName ] = useState('')
  const [org_street, setOrgStreet ] = useState('')
  const [org_city, setOrgCity ] = useState('')
  const [org_postcode, setOrgPostcode ] = useState('')

  const [keyword, setKeyword] = useState("")

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
      const sortedItem = response.data
      setMembers(Array.isArray(sortedItem) ? sortedItem : sortedItem.items || []);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(t('admin_page.error_fetching_members'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && userInfo?.id) {
      fetchMembers()
    }
  }, [accessToken, userInfo?.id])

  const ListOrganizations = async () => {
    if (!accessToken) return
    setLoading(true)
    const url = import.meta.env.VITE_ORGANIZATION_LIST_URL
    try {
        const response = await api.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        let filterItem = response.data
        filterItem = filterItem.sort((a, b) => b.created_at - a.created_at);
        if (org_city) {
          filterItem = filterItem.filter(item => item.city === org_city)
        }
        if (org_postcode) {
          filterItem = filterItem.filter(item => item.postal_code === org_postcode)
        }
        if (org_street) {
          filterItem = filterItem.filter(item => item.street === org_street)
        }
        if (org_name) {
          filterItem = filterItem.filter(item => item.name === org_name)
        }
        setOrganizations(filterItem)
        setLoading(false)
        return filterItem
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert(t('error.please_login_again'));
        } else {
            console.error(error);
            setError(t('admin_page.error_fetching_organizations'));
        }
        setLoading(false)
        return []
    }
  }

  useEffect(() => {
    if (accessToken && userInfo?.id) {
        ListOrganizations();
    }
  }, [accessToken, org_city, org_postcode, org_street, org_name]);

  const handleCityChange = (e) => {
        setOrgCity(e.target.value);
  }
  const handlePostcodeChange = (e) => {
        setOrgPostcode(e.target.value);
  }
  const handleStreeChange = (e) => {
        setOrgStreet(e.target.value);
  }
  const handleNameChange = (e) => {
        setOrgName(e.target.value);
  }

  const handleClearFilters = () => {
    setOrgCity('');
    setOrgPostcode('');
    setOrgStreet('');
    setOrgName('');
  };

  const handleOrgSelect = (orgId) => {
    setSelectedOrgId(orgId);
    navigate(`/home/admin/organization/details/${orgId}`);
  };

  const handleCreateNewOrg = () => {
    navigate('/home/admin/add_organization')
  }
  
  const deleteOrganization = async (id) => {
    if (!accessToken || !userInfo?.id || members.length == 0 || organizations.length == 0) return false;
    setLoading(true);
    setError(null);
    const url = `${import.meta.env.VITE_ORGANIZATION_DELETE_URL}${id}/`;
    try {
      await api.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      await ListOrganizations()
      return true
    } catch (err) {
      console.error('Error deleting organization:', err);
      setError(t('admin_page.error_deleting_organization'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAdminRootPath = location.pathname === '/home/admin' || location.pathname === '/home/admin/';
    const shouldRefresh = location.state?.shouldRefresh;

    if (hasTriedToLoad.current && !shouldRefresh) {
      return;
    }

    if (isAdminRootPath || shouldRefresh || (location.pathname.startsWith('/home/admin') && !selectedOrgId)) {
      const loadAndSelect = async () => {
        await fetchMembers();
        await ListOrganizations()
        hasTriedToLoad.current = true;
      };

      loadAndSelect();

      if (shouldRefresh) {
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.pathname, location.state?.shouldRefresh, userInfo?.id, organizations, members, selectedOrgId]);

  const handleUpdateOrg = async (id) => {
    hasTriedToLoad.current = false;
    navigate(`/home/admin/organization/update/${id}`)
  }

  const handleDuplicateOrganization = async (organization) => {
    const url = import.meta.env.VITE_ORGANIZATION_CREATE_URL
    const duplicatedData = {
      name: `${organization.name} ${t('admin_page.copy')}`,
      owner: organization.owner,
      street: organization.street,
      city: organization.city,
      state: organization.state,
      postal_code: organization.postal_code,
      country: organization.country,
      email: organization.email,
      website: organization.website
    }

    try {
      const res = await api.post(url, duplicatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      })
      await ListOrganizations()
      alert(t('admin_page.organization_duplicated'));
      hasTriedToLoad.current = false;
      navigate('/home/admin', { state: { shouldRefresh: true } });
    } catch (error) {
      console.error("Error duplicating organization:", error);
      if (error.response?.status === 400) {
        alert(t('admin_page.name_exists'));
      } else {
        alert(t('admin_page.error_duplicating'));
      }
    }
  }

  const handleOrganizationSearch = async (e) => {
    if (e) e.preventDefault();
    const searchKeyword = keyword.trim()
    setLoading(true)
    const url = `${import.meta.env.VITE_ORGANIZATION_SEARCH_URL}?keyword=${searchKeyword}`
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    try {
      const res = await api.get(url, config);
      console.log("search res:", res.data)
      let searchfilter = Array.isArray(res.data) ? res.data : [];
      setOrganizations(searchfilter)
    } catch (error) {
      console.error("Error searching organization:", error);
      alert(t('admin_page.error_searching'));
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (event) => {
    if (event && event.key === "Enter") {
      handleOrganizationSearch();
    }
  };

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value.trim() === "") {
      handleOrganizationSearch();
    }
  };

  useEffect(() => {
    if (keyword.trim() === "") {
      ListOrganizations();
    }
  }, [keyword]);

  const endElement = keyword ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setKeyword("")
        inputRef.current?.focus()
      }}
      me="-2"
    />
  ) : undefined

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 450px)");
    setIsDesktop(mediaQuery.matches);
    const handleResize = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <Box p="10px" boxSizing={"border-box"}>
      {isDesktop ? (
        <Flex justifyContent={"space-between"} gap={"10px"} width="100vw" p="10px" boxSizing={"border-box"}>
          <Box p={"10px"} mx={"10px"} h="85vh" rounded={"8px"} minW={"fit-content"} minH={"100vh"} overflow={"auto"} flexBasis={"20%"}>
            <Center>
              <Button onClick={handleCreateNewOrg} shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} my={"20px"}>
                {t('admin_page.create_new_organization')}
              </Button>
            </Center>
            <Center my={"20px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} rounded={"7px"} w={"100%"}>
              <form onSubmit={handleOrganizationSearch}>
                <InputGroup flex="1" startElement={<LuSearch />} endElement={endElement} rounded={"5px"}>
                  <Input 
                    ref={inputRef}
                    id='search-org'
                    type="search"
                    value={keyword}
                    onChange={handleKeywordChange}
                    onKeyDown={handleKeyDown}
                    placeholder={t('admin_page.search_placeholder')}
                  />
                </InputGroup>
              </form>
            </Center>
            <Center>
              <Collapsible.Root rounded={"7px"} w={"100%"}>
                <Flex justifyContent={"space-between"} gap={"10px"}>
                  <Collapsible.Trigger p={"7px"} w={'100%'} shadow="3px 3px 15px 5px rgb(75, 75, 79)" my={"20px"} rounded={"7px"}>
                    {t('admin_page.filter_organizations')}
                  </Collapsible.Trigger>
                  <Button onClick={handleClearFilters} px={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" my={"20px"} rounded={"7px"}>{t('admin_page.clear')}</Button>
                </Flex>
                <Collapsible.Content>
                  <VStack gap={"10px"} rounded={"7px"} p={"10px"} mb={"20px"}>
                    <Box p={2} w={"100%"} fontSize="14px" border={"1px solid"} rounded={"7px"}>
                      <label htmlFor="city">{t('admin_page.city')}</label>
                      <select value={org_city} onChange={handleCityChange} id='city'>
                        <option value="">{t('admin_page.all_cities')}</option>
                        {members.length > 0 && (() => {
                          const userMemberships = members.filter(mem => mem.user === userInfo.id);
                          const orgIds = userMemberships.map(mem => mem.organization);
                          const cities = (Array.isArray(organizations) ? organizations : [])
                            .filter(org => orgIds.includes(org.id))
                            .map(org => org.city);
                          const uniqueCities = [...new Set(cities)];
                          return uniqueCities.map((city, idx) => (
                            <option key={idx} value={city}>
                              {city}
                            </option>
                          ));
                        })()}
                      </select>
                    </Box>
                    <Box p={2} w={"100%"} fontSize="14px" border={"1px solid"} rounded={"7px"}>
                      <label htmlFor="postal_code">{t('admin_page.postal_code')}</label>
                      <select value={org_postcode} onChange={handlePostcodeChange} id='postal_code'>
                        <option value="">{t('admin_page.all_postcodes')}</option>
                        {members.length > 0 && (() => {
                          const userMemberships = members.filter(mem => mem.user === userInfo.id);
                          const orgIds = userMemberships.map(mem => mem.organization);
                          const postal_code = (Array.isArray(organizations) ? organizations : [])
                            .filter(org => orgIds.includes(org.id))
                            .map(org => org.postal_code);
                          const uniqueCities = [...new Set(postal_code)];
                          return uniqueCities.map((postal_code, idx) => (
                            <option key={idx} value={postal_code}>
                              {postal_code}
                            </option>
                          ));
                        })()}
                      </select>
                    </Box>
                    <Box p={2} w={"100%"} fontSize="14px" border={"1px solid"} rounded={"7px"}>
                      <label htmlFor="org_street">{t('admin_page.street')}</label>
                      <select value={org_street} onChange={handleStreeChange} id='org_street'>
                        <option value="">{t('admin_page.all_streets')}</option>
                        {members.length > 0 && (() => {
                          const userMemberships = members.filter(mem => mem.user === userInfo.id);
                          const orgIds = userMemberships.map(mem => mem.organization);
                          const street = (Array.isArray(organizations) ? organizations : [])
                            .filter(org => orgIds.includes(org.id))
                            .map(org => org.street);
                          const uniqueCities = [...new Set(street)];
                          return uniqueCities.map((street, idx) => (
                            <option key={idx} value={street}>
                              {street}
                            </option>
                          ));
                        })()}
                      </select>
                    </Box>
                    <Box w={"100%"} p={2} fontSize="14px" border={"1px solid"} rounded={"7px"}>
                      <label htmlFor="name">{t('admin_page.name')}</label>
                      <select value={org_name} onChange={handleNameChange} id='name'>
                        <option value="">{t('admin_page.all_names')}</option>
                        {members.length > 0 && (() => {
                          const userMemberships = members.filter(mem => mem.user === userInfo.id);
                          const orgIds = userMemberships.map(mem => mem.organization);
                          const name = (Array.isArray(organizations) ? organizations : [])
                            .filter(org => orgIds.includes(org.id))
                            .map(org => org.name);
                          const uniqueCities = [...new Set(name)];
                          return uniqueCities.map((name, idx) => (
                            <option key={idx} value={name}>
                              {name}
                            </option>
                          ));
                        })()}
                      </select>
                    </Box>
                  </VStack>
                </Collapsible.Content>
              </Collapsible.Root>
            </Center>
            <Box py={"5px"} px={"10px"} rounded={'5px'} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
              <Box>
                {members.length > 0 && members
                  .filter(member => member.user === userInfo.id && member.is_admin)
                  .map(member => organizations
                    .filter(org => org.id === member.organization)
                    .map(org => (
                      <HStack key={org.id} justifyContent={"space-between"} p={"10px"}>
                        <Button
                          variant={"surface"}
                          m={"10px"}
                          onClick={() => handleOrgSelect(org.id)}
                          colorScheme={selectedOrgId === org.id ? "blue" : "gray"}
                        >
                          {org.name}
                        </Button>
                        {org.owner === userInfo?.id ? (
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
                                        onClick={() => handleUpdateOrg(org.id)}
                                      >
                                        {t('admin_page.update')}
                                      </Button>
                                    </Menu.Item>
                                    <Menu.Item>
                                      <Dialog.Trigger asChild>
                                        <Button variant="outline" size="xs">
                                          {t('admin_page.delete')}
                                        </Button>
                                      </Dialog.Trigger>
                                    </Menu.Item>
                                    <Menu.Item>
                                      <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => handleDuplicateOrganization(org)}
                                      >
                                        {t('admin_page.duplicate')}
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
                                    <Dialog.Title>{t('admin_page.delete_organization_title')}</Dialog.Title>
                                  </Dialog.Header>
                                  <Dialog.Body>
                                    <Text>{t('admin_page.delete_organization_confirm')}</Text>
                                  </Dialog.Body>
                                  <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                      <Button variant="outline">{t('admin_page.cancel')}</Button>
                                    </Dialog.ActionTrigger>
                                    <Button onClick={() => deleteOrganization(org.id)}>
                                      {t('admin_page.delete')}
                                    </Button>
                                  </Dialog.Footer>
                                  <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                  </Dialog.CloseTrigger>
                                </Dialog.Content>
                              </Dialog.Positioner>
                            </Portal>
                          </Dialog.Root>
                        ) : ("")}
                      </HStack>
                    )))
                }
              </Box>
              <Box py={"5px"} px={"10px"} rounded={'5px'}>
                {members.length > 0 && members
                  .filter(member => member.user === userInfo.id && !member.is_admin && member.role === "editor")
                  .map(member => organizations
                    .filter(org => org.id === member.organization)
                    .map(org => (
                      <HStack key={org.id} justifyContent={"space-between"} p={"10px"}>
                        <Button
                          variant={"surface"}
                          m={"10px"}
                          onClick={() => handleOrgSelect(org.id)}
                          colorScheme={selectedOrgId === org.id ? "blue" : "gray"}
                        >
                          {org.name}
                        </Button>
                        {org.owner === userInfo?.id ? (
                          <Menu.Root>
                            <Menu.Trigger asChild>
                              <Button variant="outline" size="sm">
                                <BsThreeDotsVertical />
                              </Button>
                            </Menu.Trigger>
                            <Portal>
                              <Menu.Positioner>
                                <Menu.Content>
                                  <Menu.Item value="update">
                                    <Button onClick={() => handleUpdateOrg(org.id)}>{t('admin_page.update')}</Button>
                                  </Menu.Item>
                                  <Menu.Item value="delete">
                                    <Button w={"fit-content"} onClick={() => deleteOrganization(org.id)}>{t('admin_page.delete')}</Button>
                                  </Menu.Item>
                                  <Menu.Item value="duplicate">
                                    <Button w={"fit-content"} onClick={() => handleDuplicateOrganization(org)}>{t('admin_page.duplicate')}</Button>
                                  </Menu.Item>
                                </Menu.Content>
                              </Menu.Positioner>
                            </Portal>
                          </Menu.Root>
                        ) : ("")}
                      </HStack>
                    )))
                }
              </Box>
              <Box>
                {members.length > 0 && members
                  .filter(member => member.user === userInfo.id && !member.is_admin && member.role === "viewer")
                  .map(member => organizations
                    .filter(org => org.id === member.organization)
                    .map(org => (
                      <HStack key={org.id} justifyContent={"space-between"} p={"10px"}>
                        <Button
                          variant={"surface"}
                          m={"10px"}
                          onClick={() => handleOrgSelect(org.id)}
                          colorScheme={selectedOrgId === org.id ? "blue" : "gray"}
                        >
                          {org.name}
                        </Button>
                        {org.owner === userInfo?.id ? (
                          <Menu.Root>
                            <Menu.Trigger asChild>
                              <Button variant="outline" size="sm">
                                <BsThreeDotsVertical />
                              </Button>
                            </Menu.Trigger>
                            <Portal>
                              <Menu.Positioner>
                                <Menu.Content>
                                  <Menu.Item value="update">
                                    <Button onClick={() => handleUpdateOrg(org.id)}>{t('admin_page.update')}</Button>
                                  </Menu.Item>
                                  <Menu.Item value="delete">
                                    <Button w={"fit-content"} onClick={() => deleteOrganization(org.id)}>{t('admin_page.delete')}</Button>
                                  </Menu.Item>
                                  <Menu.Item value="duplicate">
                                    <Button w={"fit-content"} onClick={() => handleDuplicateOrganization(org)}>{t('admin_page.duplicate')}</Button>
                                  </Menu.Item>
                                </Menu.Content>
                              </Menu.Positioner>
                            </Portal>
                          </Menu.Root>
                        ) : ("")}
                      </HStack>
                    )))
                }
              </Box>
            </Box>
          </Box>
          <Box flexBasis={"80%"} mx={"10px"}>
            <Outlet />
          </Box>
        </Flex>
      ) : (
        <VStack width="100%" p="10px" boxSizing={"border-box"}>
          <VStack p={"10px"} minW={"fit-content"} overflow={"auto"}>
            <Button onClick={handleCreateNewOrg} shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} my={"20px"}>
              {t('admin_page.create_new_organization')}
            </Button>
            <Box my={"20px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} rounded={"7px"} w={"100%"}>
              <form onSubmit={handleOrganizationSearch}>
                <InputGroup flex="1" startElement={<LuSearch />} endElement={endElement} rounded={"5px"}>
                  <Input 
                    ref={inputRef}
                    id='search-org'
                    type="search"
                    value={keyword}
                    onChange={handleKeywordChange}
                    onKeyDown={handleKeyDown}
                    placeholder={t('admin_page.search_placeholder')}
                  />
                </InputGroup>
              </form>
            </Box>
            <Box>
              <Collapsible.Root rounded={"7px"} w={"100%"}>
                <Flex justifyContent={"space-between"} gap={"10px"}>
                  <Collapsible.Trigger p={"7px"} w={'100%'} shadow="3px 3px 15px 5px rgb(75, 75, 79)" my={"20px"} rounded={"7px"}>
                    {t('admin_page.filter_organizations')}
                  </Collapsible.Trigger>
                  <Button onClick={handleClearFilters} px={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" my={"20px"} rounded={"7px"}>{t('admin_page.clear')}</Button>
                </Flex>
                <Collapsible.Content>
                  <VStack gap={"10px"} rounded={"7px"} p={"10px"} mb={"20px"}>
                    <Box p={2} w={"100%"} fontSize="14px" border={"1px solid"} rounded={"7px"}>
                      <label htmlFor="city">{t('admin_page.city')}</label>
                      <select value={org_city} onChange={handleCityChange} id='city'>
                        <option value="">{t('admin_page.all_cities')}</option>
                        {members.length > 0 && (() => {
                          const userMemberships = members.filter(mem => mem.user === userInfo.id);
                          const orgIds = userMemberships.map(mem => mem.organization);
                          const cities = (Array.isArray(organizations) ? organizations : [])
                            .filter(org => orgIds.includes(org.id))
                            .map(org => org.city);
                          const uniqueCities = [...new Set(cities)];
                          return uniqueCities.map((city, idx) => (
                            <option key={idx} value={city}>
                              {city}
                            </option>
                          ));
                        })()}
                      </select>
                    </Box>
                    <Box p={2} w={"100%"} fontSize="14px" border={"1px solid"} rounded={"7px"}>
                      <label htmlFor="postal_code">{t('admin_page.postal_code')}</label>
                      <select value={org_postcode} onChange={handlePostcodeChange} id='postal_code'>
                        <option value="">{t('admin_page.all_postcodes')}</option>
                        {members.length > 0 && (() => {
                          const userMemberships = members.filter(mem => mem.user === userInfo.id);
                          const orgIds = userMemberships.map(mem => mem.organization);
                          const postal_code = (Array.isArray(organizations) ? organizations : [])
                            .filter(org => orgIds.includes(org.id))
                            .map(org => org.postal_code);
                          const uniqueCities = [...new Set(postal_code)];
                          return uniqueCities.map((postal_code, idx) => (
                            <option key={idx} value={postal_code}>
                              {postal_code}
                            </option>
                          ));
                        })()}
                      </select>
                    </Box>
                    <Box p={2} w={"100%"} fontSize="14px" border={"1px solid"} rounded={"7px"}>
                      <label htmlFor="org_street">{t('admin_page.street')}</label>
                      <select value={org_street} onChange={handleStreeChange} id='org_street'>
                        <option value="">{t('admin_page.all_streets')}</option>
                        {members.length > 0 && (() => {
                          const userMemberships = members.filter(mem => mem.user === userInfo.id);
                          const orgIds = userMemberships.map(mem => mem.organization);
                          const street = (Array.isArray(organizations) ? organizations : [])
                            .filter(org => orgIds.includes(org.id))
                            .map(org => org.street);
                          const uniqueCities = [...new Set(street)];
                          return uniqueCities.map((street, idx) => (
                            <option key={idx} value={street}>
                              {street}
                            </option>
                          ));
                        })()}
                      </select>
                    </Box>
                    <Box w={"100%"} p={2} fontSize="14px" border={"1px solid"} rounded={"7px"}>
                      <label htmlFor="name">{t('admin_page.name')}</label>
                      <select value={org_name} onChange={handleNameChange} id='name'>
                        <option value="">{t('admin_page.all_names')}</option>
                        {members.length > 0 && (() => {
                          const userMemberships = members.filter(mem => mem.user === userInfo.id);
                          const orgIds = userMemberships.map(mem => mem.organization);
                          const name = (Array.isArray(organizations) ? organizations : [])
                            .filter(org => orgIds.includes(org.id))
                            .map(org => org.name);
                          const uniqueCities = [...new Set(name)];
                          return uniqueCities.map((name, idx) => (
                            <option key={idx} value={name}>
                              {name}
                            </option>
                          ));
                        })()}
                      </select>
                    </Box>
                  </VStack>
                </Collapsible.Content>
              </Collapsible.Root>
            </Box>
            <Box py={"5px"} px={"10px"} w={"100%"} rounded={'5px'} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
              <Box>
                {members.length > 0 && members
                  .filter(member => member.user === userInfo.id && member.is_admin)
                  .map(member => organizations
                    .filter(org => org.id === member.organization)
                    .map(org => (
                      <HStack key={org.id} justifyContent={"space-between"} p={"10px"}>
                        <Button
                          variant={"surface"}
                          m={"10px"}
                          onClick={() => handleOrgSelect(org.id)}
                          colorScheme={selectedOrgId === org.id ? "blue" : "gray"}
                        >
                          {org.name}
                        </Button>
                        {org.owner === userInfo?.id ? (
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
                                        onClick={() => handleUpdateOrg(org.id)}
                                      >
                                        {t('admin_page.update')}
                                      </Button>
                                    </Menu.Item>
                                    <Menu.Item>
                                      <Dialog.Trigger asChild>
                                        <Button variant="outline" size="xs">
                                          {t('admin_page.delete')}
                                        </Button>
                                      </Dialog.Trigger>
                                    </Menu.Item>
                                    <Menu.Item>
                                      <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => handleDuplicateOrganization(org)}
                                      >
                                        {t('admin_page.duplicate')}
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
                                    <Dialog.Title>{t('admin_page.delete_organization_title')}</Dialog.Title>
                                  </Dialog.Header>
                                  <Dialog.Body>
                                    <Text>{t('admin_page.delete_organization_confirm')}</Text>
                                  </Dialog.Body>
                                  <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                      <Button variant="outline">{t('admin_page.cancel')}</Button>
                                    </Dialog.ActionTrigger>
                                    <Button onClick={() => deleteOrganization(org.id)}>
                                      {t('admin_page.delete')}
                                    </Button>
                                  </Dialog.Footer>
                                  <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                  </Dialog.CloseTrigger>
                                </Dialog.Content>
                              </Dialog.Positioner>
                            </Portal>
                          </Dialog.Root>
                        ) : ("")}
                      </HStack>
                    )))
                }
              </Box>
              <Box py={"5px"} px={"10px"} rounded={'5px'}>
                {members.length > 0 && members
                  .filter(member => member.user === userInfo.id && !member.is_admin && member.role === "editor")
                  .map(member => organizations
                    .filter(org => org.id === member.organization)
                    .map(org => (
                      <HStack key={org.id} justifyContent={"space-between"} p={"10px"}>
                        <Button
                          variant={"surface"}
                          m={"10px"}
                          onClick={() => handleOrgSelect(org.id)}
                          colorScheme={selectedOrgId === org.id ? "blue" : "gray"}
                        >
                          {org.name}
                        </Button>
                        {org.owner === userInfo?.id ? (
                          <Menu.Root>
                            <Menu.Trigger asChild>
                              <Button variant="outline" size="sm">
                                <BsThreeDotsVertical />
                              </Button>
                            </Menu.Trigger>
                            <Portal>
                              <Menu.Positioner>
                                <Menu.Content>
                                  <Menu.Item value="update">
                                    <Button onClick={() => handleUpdateOrg(org.id)}>{t('admin_page.update')}</Button>
                                  </Menu.Item>
                                  <Menu.Item value="delete">
                                    <Button w={"fit-content"} onClick={() => deleteOrganization(org.id)}>{t('admin_page.delete')}</Button>
                                  </Menu.Item>
                                  <Menu.Item value="duplicate">
                                    <Button w={"fit-content"} onClick={() => handleDuplicateOrganization(org)}>{t('admin_page.duplicate')}</Button>
                                  </Menu.Item>
                                </Menu.Content>
                              </Menu.Positioner>
                            </Portal>
                          </Menu.Root>
                        ) : ("")}
                      </HStack>
                    )))
                }
              </Box>
              <Box>
                {members.length > 0 && members
                  .filter(member => member.user === userInfo.id && !member.is_admin && member.role === "viewer")
                  .map(member => organizations
                    .filter(org => org.id === member.organization)
                    .map(org => (
                      <HStack key={org.id} justifyContent={"space-between"} p={"10px"}>
                        <Button
                          variant={"surface"}
                          m={"10px"}
                          onClick={() => handleOrgSelect(org.id)}
                          colorScheme={selectedOrgId === org.id ? "blue" : "gray"}
                        >
                          {org.name}
                        </Button>
                        {org.owner === userInfo?.id ? (
                          <Menu.Root>
                            <Menu.Trigger asChild>
                              <Button variant="outline" size="sm">
                                <BsThreeDotsVertical />
                              </Button>
                            </Menu.Trigger>
                            <Portal>
                              <Menu.Positioner>
                                <Menu.Content>
                                  <Menu.Item value="update">
                                    <Button onClick={() => handleUpdateOrg(org.id)}>{t('admin_page.update')}</Button>
                                  </Menu.Item>
                                  <Menu.Item value="delete">
                                    <Button w={"fit-content"} onClick={() => deleteOrganization(org.id)}>{t('admin_page.delete')}</Button>
                                  </Menu.Item>
                                  <Menu.Item value="duplicate">
                                    <Button w={"fit-content"} onClick={() => handleDuplicateOrganization(org)}>{t('admin_page.duplicate')}</Button>
                                  </Menu.Item>
                                </Menu.Content>
                              </Menu.Positioner>
                            </Portal>
                          </Menu.Root>
                        ) : ("")}
                      </HStack>
                    )))
                }
              </Box>
            </Box>
          </VStack>
          <Box>
            <Outlet />
          </Box>
        </VStack>
      )}
    </Box>
  )
}

export default AdminPage