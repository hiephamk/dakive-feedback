import {useState, useEffect} from 'react'
import {Box,Stack, HStack, Flex, VStack, Heading, Wrap, Center, Table, Tabs} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import useOrganization from '../components/Organization/OrganizationHook'
import formatDate from '../components/formatDate'
import useOrganization_Membership from '../components/Organization/Organization_Membership_Hook'
import ReportBarChartHook from '../components/Reports/ReportBarChartHook'
import UserFeedbackHook from '../components/Reports/UserFeedbackHook'
import useBuilding from '../components/BuildingManagement/BuildingHook'

const HomePage= () => {
  const {userInfo} = useSelector(state => state.auth)
  const {organizations} = useOrganization()
  const { members } = useOrganization_Membership()
  const {reportChart} = UserFeedbackHook()
  const {buildings} = useBuilding()
  const [selectedOrgId, setSelectedOrgId] = useState([]);
  const [orgIdForSelect, setOrgIdForSelect] = useState('')
  const [checked, setChecked] = useState(true)
  
  const Org = organizations
    .filter(item => item.owner === userInfo.id && item.buildings.length > 0 )
    .map(item =>item.id)

  const org_members = members
    .filter(item => item.user === userInfo.id && Org.includes(Number(item.organization)));

  const Org1 = organizations
    .filter(item => item.owner === userInfo.id && item.buildings.length > 0 && item.report_count > 0 )
    .map(item =>item.id)
  
  const org_members1 = members
    .filter(item => item.user === userInfo.id && Org1.includes(Number(item.organization)));

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 500px)");
    setIsDesktop(mediaQuery.matches);
    const handleResize = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleCheckboxChange = (orgId) => {
    setSelectedOrgId((prev) =>
      prev.includes(orgId)
        ? prev.filter((id) => id !== orgId) // Remove if already selected
        : [...prev, orgId] // Add if not selected
    );
    setChecked(false)
  };
  const handleCheckedAll = (e) => {
    setChecked(e.target.checked)
    setSelectedOrgId([])
  }
return (
  <Box>
    {isDesktop ? (
    <Stack>
      <Center>
        <Heading fontSize={"30px"} my={"20px"} fontWeight={"bold"}>Dakive Feedback</Heading>
      </Center>
      <Flex w={"100%"} ml={"10px"}>
        <Box w={"70%"}>
          <VStack p={"10px"}>
            <Box shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={"7px"} mb={"10px"}>
              <HStack p={"10px"} wrap={"wrap"}>
                <HStack>
                  <input
                    type='checkbox'
                    checked={checked}
                    onChange={handleCheckedAll}
                    id='all'
                  >
                  </input>
                  <label htmlFor="all">All Organization</label>
                </HStack>
                {org_members1.map((org) => (
                  <HStack key={org.id}>
                    <input
                      type="checkbox"
                      checked={selectedOrgId.includes(org.organization)}
                      onChange={() => handleCheckboxChange(org.organization)}
                    />
                    <label>{org.organization_name}</label>
                  </HStack>
                ))}
              </HStack>
            </Box>
            <HStack>
                {/* <Heading mb={"20px"}>Organization Average Rating</Heading> */}
                <HStack justify={"space-between"} gap={"10px"} wrap={"wrap"}>
                  {selectedOrgId.length > 0 ? (selectedOrgId.map(i=>(
                    <Box key={i}>
                      <ReportBarChartHook orgId={i}/>
                    </Box>
                  ))):(
                      checked && org_members1
                        // .filter(org => org.owner === userInfo?.id)
                        // .slice(0,2)
                      .map(org => (
                        <Box key={org.id} >
                          <ReportBarChartHook orgId = {org.organization}/>
                        </Box>
                      ))
                  )}
                </HStack>
            </HStack>
          </VStack>
        </Box>
        <Box border={"1px solid"} mt={"20px"} rounded={"7px"}>
          <VStack rounded={"7px"} w={"100%"} p={"5px"} h={"fit-content"} justify={"center"} gap={"10px"}>
            <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} rounded={"7px"} w={"100%"}>
              <Heading>Your organizations</Heading>
              <Box>
                {org_members.length > 0 ? (
                  <Table.Root size={"100%"}>
                      <Table.Header>
                          <Table.Row>
                              <Table.ColumnHeader p={"3px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Organization</Table.ColumnHeader>
                              <Table.ColumnHeader p={"3px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Members</Table.ColumnHeader>
                              <Table.ColumnHeader p={"3px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Buildings</Table.ColumnHeader>
                              <Table.ColumnHeader p={"3px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Rooms</Table.ColumnHeader>
                              <Table.ColumnHeader p={"3px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Feedback</Table.ColumnHeader>
                              <Table.ColumnHeader p={"3px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Role</Table.ColumnHeader>
                          </Table.Row>
                      </Table.Header>
                      <Table.Body>
                          {org_members
                              .map(m => organizations
                                  .filter(o => o.id === m.organization)
                                  .map(item => {
                                      const bestRoom = reportChart
                                          .filter(r => r.organization_id === item.id)
                                          .sort((a, b) => b.overall_avg_rating - a.overall_avg_rating)[0];
                                      const worstRoom = reportChart
                                          .filter(r => r.organization_id === item.id)
                                          .sort((a, b) => a.overall_avg_rating - b.overall_avg_rating)[0];
                                      return (
                                          <Table.Row key={item.id}>
                                              <Table.Cell textAlign={"center"} p={"2px"} border={"1px solid"}>
                                                  {m.organization_name}
                                              </Table.Cell>
                                              <Table.Cell textAlign={"center"} p={"2px"} border={"1px solid"}>
                                                  {item.member_count}
                                              </Table.Cell>
                                              <Table.Cell textAlign={"center"} p={"2px"} border={"1px solid"}>
                                                  {item.building_count}
                                              </Table.Cell>
                                              <Table.Cell textAlign={"center"} p={"2px"} border={"1px solid"}>
                                                  {item.totalRoom_count}
                                              </Table.Cell>
                                              <Table.Cell textAlign={"center"} p={"2px"} border={"1px solid"}>
                                                  {item.report_count}
                                              </Table.Cell>
                                              <Table.Cell textAlign={"center"} p={"2px"} border={"1px solid"}>
                                                  {item.owner === userInfo?.id ? "owner/editor" : m.role}
                                              </Table.Cell>
                                          </Table.Row>
                                      );
                                  })
                              )
                          }
                      </Table.Body>
                  </Table.Root>
                ) : ("You have no organization")}
              </Box>
            </VStack>
            <Box w={"100%"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={"7px"} p={"10px"}>
              <Center my={"7px"}>
                  <Heading>Building Reports</Heading>
              </Center>
              <Center>
                {org_members1.length > 0 ? (
                <Table.Root maxW={"sm"}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Organization</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>No. Feedback</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>The best building</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>The worst building</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {org_members1
                            .map(m => organizations
                                .filter(o => o.id === m.organization)
                                .map(item => {
                                    const bestBuilding = buildings
                                        .filter(b => b.organization === item.id)
                                        .sort((a, b) => b.room_average_rating - a.room_average_rating)[0];
                                    const worstBuilding = buildings
                                        .filter(b => b.organization === item.id)
                                        .sort((a, b) => a.room_average_rating - b.room_average_rating)[0];
                                    return (
                                        <Table.Row key={item.id}>
                                            {bestBuilding &&
                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                {bestBuilding.organization_name}
                                            </Table.Cell>
                                            }
                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                {item.report_count > 0 ? (item.report_count) : 'no feedback'}
                                            </Table.Cell>
      
                                            {bestBuilding &&
                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                {bestBuilding.room_average_rating > 0 ? `${bestBuilding.name} - avg. ${bestBuilding.room_average_rating}` : "no feedback"}
                                            </Table.Cell>
                                            }
                                            {bestBuilding &&
                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                              {worstBuilding.room_average_rating > 0 ? `${worstBuilding.name} - avg. ${worstBuilding.room_average_rating}` : "no feedback"}
                                            </Table.Cell>
                                            }
                                        </Table.Row>
                                    );
                                })
                            )
                        }
                    </Table.Body>
                </Table.Root>
                ) : ("You have no organization")
                }
              </Center>
            </Box>
            <Box w={"100%"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={"7px"} p={"10px"}>
              <Center my={"7px"}><Heading>Room Reports</Heading></Center>
              <Center>
                {org_members.length > 0 ? (
                <Table.Root maxW={"sm"}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Organization</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>No. Feedback</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>The best room</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>The worst room</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {org_members
                            .map(m => organizations
                                .filter(o => o.id === m.organization)
                                .map(item => {
                                    const bestRoom = reportChart
                                        .filter(r => r.organization_id === item.id)
                                        .sort((a, b) => b.overall_avg_rating - a.overall_avg_rating)[0];
                                    const worstRoom = reportChart
                                        .filter(r => r.organization_id === item.id)
                                        .sort((a, b) => a.overall_avg_rating - b.overall_avg_rating)[0];
                                    return (
                                        <Table.Row key={item.id}>
                                            {worstRoom &&
                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                {worstRoom.organization_name}
                                            </Table.Cell>
                                            }
                                            {bestRoom &&
                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                {item.report_count}
                                            </Table.Cell>
                                            }
                                            {bestRoom &&
                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                {bestRoom.room_name}-{bestRoom.building_name}  (avg. {bestRoom.overall_avg_rating})
                                            </Table.Cell>
                                            }
                                            {worstRoom &&
                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                {worstRoom.room_name}-{worstRoom.building_name} (avg. {worstRoom.overall_avg_rating})
                                            </Table.Cell>
                                            }
                                        </Table.Row>
                                    );
                                })
                            )
                        }
                    </Table.Body>
                </Table.Root>
                ) : ("You have no organization")}
              </Center>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Stack>
    ):(
      <VStack m={"10px"} gap={"20px"} alignItems={"center"} maxW={"100%"} mx={"auto"}>
        <Box w={"100%"}>
          <VStack p={"10px"}>
            <select
              value={orgIdForSelect}
              onChange={e => setOrgIdForSelect(e.target.value)}
              style={{border:'1px solid', padding:"20px", borderRadius:"5px"}}
            >
              <option value="">All organizations</option>
              {org_members.length > 0 && org_members
                .map(item => (
                  <option key={item.id} value={item.organization}>{item.organization_name}</option>
                ))
              }
            </select>
            <Box overflow={"auto"} maxH={"100vh"}>
              {orgIdForSelect && orgIdForSelect !== "" ? (
                <ReportBarChartHook orgId = {orgIdForSelect}/>
              ) : (org_members
                    // .filter(org => org.owner === userInfo?.id)
                    .slice(0,5)
                    .map(org => (
                      <Box key={org.id} mt={"20px"}>
                        <ReportBarChartHook orgId = {org.organization}/>
                      </Box>
                    ))
              )}
            </Box>
          </VStack>
        </Box>
      </VStack>
    )}
  </Box>
  )
}

export default HomePage
