import {useState, useEffect} from 'react'
import {Box, Button, HStack, Flex, VStack, Heading, Text, Image, Center, List, Table, Stack} from '@chakra-ui/react'
// import FetchProfile from '../FetchProfile'
// import useProfile from '../../services/ProfileHook'
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

    console.log("buildings:", buildings)

    const Org = organizations
    .filter(item => item.owner === userInfo.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const org_members = members.filter(item => item.user === userInfo.id && item.organizations === Org.id)

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 500px)");
    setIsDesktop(mediaQuery.matches);
    const handleResize = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

return (
    <Box>
      <Box>
          {isDesktop?(
          <Flex justify={"space-between"} gap={2} m={"10px"} w={"100%"} maxW={"100vw"}> 
            <Box shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={"7px"} p={"10px"}>
              <Center my={"7px"}>
                <Heading>Building Reports</Heading>
              </Center>
                <Box mx={"auto"}>
                  {org_members.length > 0 ? (
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
                            {org_members
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
                                              {item.report_count > 0 &&
                                                <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                    {item.report_count}
                                                </Table.Cell>
                                              }
                                              {bestBuilding &&
                                                <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                  {bestBuilding.room_average_rating > 0? `${bestBuilding.name} - avg. ${bestBuilding.room_average_rating}` : "no feedback"}
                                                </Table.Cell>
                                              }
                                              {worstBuilding &&
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
                </Box>
            </Box>
            <Box shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={"7px"} p={"10px"} mx={"auto"}>
              <Center my={"7px"}><Heading>Room Reports</Heading></Center>
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
            </Box>
            <VStack rounded={"7px"} p={"10px"} border={"1px solid"} mx={"auto"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
                <Heading>Latest User Feedback</Heading>
                <ReportBarChartHook/>
            </VStack>
          </Flex>
        ):(
          <VStack m={"10px"} gap={"20px"} alignItems={"center"} maxW={"100%"} mx={"auto"}>
              <VStack gap={"20px"}> 
                <Box shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={"7px"} p={"10px"}>
                  <Center my={"7px"}>
                    <Heading>Building Reports</Heading>
                  </Center>
                    {org_members.length > 0 ? (
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>No. Feedback</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>The best building</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>The worst building</Table.ColumnHeader>
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
                                            const bestBuilding = buildings
                                              .filter(b => b.organization === item.id)
                                              .sort((a, b) => b.room_average_rating - a.room_average_rating)[0];
                                            const worstBuilding = buildings
                                              .filter(b => b.organization === item.id)
                                              .sort((a, b) => a.room_average_rating - b.room_average_rating)[0];
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
                                                  {bestBuilding &&
                                                    <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                      {bestBuilding.room_average_rating > 0? `${bestBuilding.name} - avg. ${bestBuilding.room_average_rating}` : "no feedback"}
                                                    </Table.Cell>
                                                  }
                                                  {worstBuilding && 
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
                    ) : ("You have no organization")}
                </Box>
                <Box shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={"7px"} p={"10px"}>
                  <Center my={"7px"}><Heading>Room Reports</Heading></Center>
                    {org_members.length > 0 ? (
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>No. Feedback</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>The best room</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>The worst room</Table.ColumnHeader>
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
                </Box>
              </VStack>
              <VStack boxSizing={"border-box"} px={"10px"}>
                  <Heading>Latest User Feedback</Heading>
                  <ReportBarChartHook/>
              </VStack>
          </VStack>
        )}
      </Box>
    </Box>
  )
}

export default HomePage