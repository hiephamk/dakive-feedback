
import { useEffect, useState, useRef} from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {useSelector} from "react-redux"
import { Box,Collapsible,Dialog, InputGroup,Text, Input, Button,CloseButton, HStack, VStack, Menu, Portal, Spinner, Center, Flex, Heading} from '@chakra-ui/react'
import { LuSearch } from "react-icons/lu"
import HomeOrganization from '../components/Organization/HomeOrganization'

import useAccessToken from '../services/token'
import { BsThreeDotsVertical } from "react-icons/bs";
import api from '../services/api'
// import useOrganization_Membership from '../components/Organization/Organization_Membership_Hook'

const AdminPage = () => {
  const {user, userInfo } = useSelector(state => state.auth)
  const accessToken = useAccessToken(user)
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const hasTriedToLoad = useRef(false);

  // const { members: memberid } = useOrganization_Membership()
  
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

  //  useEffect(() => {
  //   if (!members.length || !organizations.length || selectedOrgId) return;

  //   const orgMember = members.find(item => item.user === userInfo?.id && item.is_admin);
  //   const orgid = orgMember?.organization;

  //   console.log("orgId:", orgid);

  //   if (orgid) {
  //     const firstOrg = organizations.find(item => item.id === orgid);

  //     if (firstOrg) {
  //       setSelectedOrgId(firstOrg.id);
  //       navigate(`/home/admin/organization/details/${firstOrg.id}`, { replace: true });
  //     }
  //   }
  // }, [members, organizations, selectedOrgId, navigate, userInfo?.id]);

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
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=> {
    if(accessToken && userInfo?.id) {
      fetchMembers()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const ListOrganizations = async () => {
    if(!accessToken) return
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
        if(org_city){
          filterItem = filterItem.filter(item => item.city === org_city)
        }
        if(org_postcode){
          filterItem = filterItem.filter(item => item.postal_code === org_postcode)
        }
        if(org_street){
          filterItem = filterItem.filter(item => item.street === org_street)
        }
        if(org_name){
          filterItem = filterItem.filter(item => item.name === org_name)
        }
        setOrganizations(filterItem)
        setLoading(false)
        return filterItem
    }catch(error) {
        if(error.response && error.response.status === 401) {
            alert("Please login again.");
        }else {
            console.error(error);
        }
        setLoading(false)
        return []
    }
  }

  // Initial load of organizations
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
      console.error('Error deleting member:', err);
      setError(err.response?.data?.message || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  const isAdminRootPath = location.pathname === '/home/admin' || location.pathname === '/home/admin/';
  const shouldRefresh = location.state?.shouldRefresh;

  // Prevent repeated calls if no orgs/members and already tried
  if ( hasTriedToLoad.current && !shouldRefresh) {
    return;
  }

  if (isAdminRootPath || shouldRefresh || (location.pathname.startsWith('/home/admin') && !selectedOrgId)) {
    const loadAndSelect = async () => {
      // const freshOrganizations = await ListOrganizations();
      await fetchMembers();
      await ListOrganizations()
      hasTriedToLoad.current = true;
    };

    loadAndSelect();

    if (shouldRefresh) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [location.pathname, location.state?.shouldRefresh, userInfo?.id, organizations, members, selectedOrgId]);



  const handleUpdateOrg = async (id) => {
    hasTriedToLoad.current = false;
    navigate(`/home/admin/organization/update/${id}`)
  }
  const handleDuplicateOrganization = async (organization) => {
        const url = import.meta.env.VITE_ORGANIZATION_CREATE_URL
        const duplicatedData = {
            name: `${organization.name} Copy`,
            owner: organization.owner,
            street: organization.street,
            city: organization.city,
            state: organization.state,
            postal_code: organization.postal_code,
            country: organization.country,
            email:organization.email,
            website:organization.website
        }

        try {
            const res = await api.post(url, duplicatedData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            })
            // setOrganizations(prev => [...prev, res.data])
            await ListOrganizations()
            alert("Organization duplicated successfully!")
            hasTriedToLoad.current = false;
            navigate('/home/admin', { state: { shouldRefresh: true } });
        } catch (error) {
            console.error("Error duplicating building:", error);
            if(error.response.data === 400) {
                alert("This name already exist");
            }
        }
    }

  const handleOrganizationSearch = async (e) => {
        e.preventDefault();
        const searchKeyword = keyword.trim()
        setLoading(true)
        // if (!searchKeyword) {
        //     alert("Please enter a keyword to search.")
        //     return
        // }
        setLoading(true)
        const url = `${import.meta.env.VITE_ORGANIZATION_SEARCH_URL}?keyword=${searchKeyword}`
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        try {
            const res = await api.get(url, config);
            let searchfilter = Array.isArray(res.data) ? res.data : [];
            setOrganizations(searchfilter)
        } catch (error) {
            console.error("Error searching building:", error);
            alert("Cannot search this building name. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (event) => {
        if (event && event.key === "Enter") {
            // event.preventDefault();
            handleOrganizationSearch();
        }
    };

    const handleKeywordChange = (e) => {
      const value = e.target.value;
      setKeyword(value);

      // When keyword is cleared (e.g. backspace to empty), fetch all
      if (value.trim() === "") {
          handleOrganizationSearch(); // Call without event
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
      {isDesktop?(
      <Flex justifyContent={"space-between"} gap={"10px"} width="100vw" p="10px" boxSizing={"border-box"}>
        <Box p={"10px"} mx={"10px"} h="85vh" rounded={"8px"} minW={"fit-content"} minH={"100vh"} overflow={"auto"} flexBasis={"20%"}>
          <Center>
            <Button onClick={handleCreateNewOrg} shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} my={"20px"}>
              Create New Organizations
            </Button>
          </Center>
          <Center my={"20px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} rounded={"7px"} w={"100%"}>
              <form onSubmit={handleOrganizationSearch}>
                <InputGroup flex="1" startElement={<LuSearch />} endElement={endElement} rounded={"5px"}>
                  <Input 
                    // ref={inputRef}
                    id='search-org'
                    type="search"
                    value={keyword}
                    onChange={handleKeywordChange}
                    // onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter keyword to search"
                  />
                </InputGroup>
              </form>
          </Center>
          
          <Center>
            <Collapsible.Root rounded={"7px"} w={"100%"}>
              <Flex justifyContent={"space-between"} gap={"10px"}>
                <Collapsible.Trigger  p={"7px"} w={'100%'} shadow="3px 3px 15px 5px rgb(75, 75, 79)" my={"20px"} rounded={"7px"}>
                  Filter Organizations
                </Collapsible.Trigger>
                <Button onClick={handleClearFilters} px={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" my={"20px"} rounded={"7px"}>Clear</Button>
              </Flex>
              <Collapsible.Content >
                <VStack gap={"10px"} rounded={"7px"} p={"10px"} mb={"20px"}>
                  <Box p={2} w={"100%"} fontSize="14px" border={"1px solid"} rounded={"7px"}>
                    <label htmlFor="city"></label>
                    <select
                        value={org_city}
                        onChange={handleCityChange}
                        id='city'
                    >
                        <option value="">All Cities</option>
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
                      <label htmlFor="postal_code"></label>
                      <select
                          value={org_postcode}
                          onChange={handlePostcodeChange}
                          id='postal_code'
                      >
                          <option value="">All Postcodes</option>
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
                      <label htmlFor="org_street"></label>
                      <select
                          value={org_street}
                          onChange={handleStreeChange}
                          id='org_street'
                      >
                          <option value="">All Streets</option>
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
                    <label htmlFor="name"></label>
                    <select
                        value={org_name}
                        onChange={handleNameChange}
                        id='name'
                    >
                        <option value="">All Names</option>
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
                  .map(org =>(
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
                                      Update
                                    </Button>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <Dialog.Trigger asChild>
                                      <Button variant="outline" size="xs">
                                        Delete
                                      </Button>
                                    </Dialog.Trigger>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <Button
                                      variant="outline"
                                      size="xs"
                                      onClick={() => handleDuplicateOrganization(org)}
                                    >
                                      Duplicate
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
                                  <Dialog.Title>Delete Organization</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                  <Text>Do you really want to delete the organization?</Text>
                                </Dialog.Body>
                                <Dialog.Footer>
                                  <Dialog.ActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </Dialog.ActionTrigger>
                                  <Button onClick={() => deleteOrganization(org.id)}>
                                    Delete
                                  </Button>
                                </Dialog.Footer>
                                <Dialog.CloseTrigger asChild>
                                  <CloseButton size="sm" />
                                </Dialog.CloseTrigger>
                              </Dialog.Content>
                            </Dialog.Positioner>
                          </Portal>
                        </Dialog.Root>
                    ):("")}
                  </HStack>
                )))
              }
            </Box>
            <Box py={"5px"} px={"10px"} rounded={'5px'}>
              {members.length > 0 && members
                .filter(member => member.user === userInfo.id && !member.is_admin && member.role === "editor")
                .map(member => organizations
                  .filter(org => org.id === member.organization)
                  .map(org =>(
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
                              <Button onClick={() => handleUpdateOrg(org.id)}>update</Button>
                            </Menu.Item>
                            <Menu.Item value="delete">
                              <Button w={"fit-content"} onClick={()=> deleteOrganization(org.id)}>Delete</Button>
                            </Menu.Item>
                            <Menu.Item value="duplicate">
                              <Button w={"fit-content"} onClick={()=> handleDuplicateOrganization(org)}>Duplicate</Button>
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                    ):("")}
                  </HStack>
                )))
              }
            </Box >
            <Box>
              {members.length > 0 && members
                .filter(member => member.user === userInfo.id && !member.is_admin && member.role === "viewer")
                .map(member => organizations
                  .filter(org => org.id === member.organization)
                  .map(org =>(
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
                              <Button onClick={() => handleUpdateOrg(org.id)}>update</Button>
                            </Menu.Item>
                            <Menu.Item value="delete">
                              <Button w={"fit-content"} onClick={()=> deleteOrganization(org.id)}>Delete</Button>
                            </Menu.Item>
                            <Menu.Item value="duplicate">
                              <Button w={"fit-content"} onClick={()=> handleDuplicateOrganization(org)}>Duplicate</Button>
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                    ):("")}
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
      ):(
      <HomeOrganization/>
    )}
    </Box>
  )
}

export default AdminPage

