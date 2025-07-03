import {useState, useEffect} from 'react'
import {Box, Container, Button, HStack, Flex, VStack, Heading, Text, Image, Center, List, Table, Stack} from '@chakra-ui/react'
import FetchProfile from '../FetchProfile'
import useProfile from '../../services/ProfileHook'
import { useSelector } from 'react-redux'
import useOrganization from './OrganizationHook'
import formatDate from '../formatDate'
import useOrganization_Membership from './Organization_Membership_Hook'
import ReportBarChartHook from '../Reports/ReportBarChartHook'
import UserFeedbackHook from '../Reports/UserFeedbackHook'

const HomeOrganization = () => {
    const {userInfo} = useSelector(state => state.auth)
    const {organizations} = useOrganization()
    const { members } = useOrganization_Membership()
    const {reports, reportChart} = UserFeedbackHook()
    const [bestRoom, setBestRoom] = useState([])

    console.log("reportChart", reportChart)
    console.log("reports", reports)

    const Org = organizations
    .filter(item => item.owner === userInfo.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const org_members = members.filter(item => item.user === userInfo.id && item.organizations === Org.id)
    console.log("Org:", Org)

    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 450px)");
        setIsDesktop(mediaQuery.matches);
        const handleResize = (e) => setIsDesktop(e.matches);
        mediaQuery.addEventListener("change", handleResize);
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

return (
    <Box w={"100%"} maxW={"70vw"}>
        {isDesktop?(
            <Flex justify={"space-between"} gap={4}>
            <VStack border={"1px solid"} rounded={"7px"} p={"20px"} w={"fit-content"}>
                <VStack mt={'20px'} shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} w={"100%"} rounded={"7px"}>
                    <Heading>Your organizations</Heading>
                    <Box>
                        {org_members.length > 0 ? (
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Organization</Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>No. Members</Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>No. Buildings</Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>No. Rooms</Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>No. Feedback</Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Role</Table.ColumnHeader>
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
                                                        <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                            {m.organization_name}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                            {item.member_count}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                            {item.building_count}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                            {item.totalRoom_count}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                            {item.report_count}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign={"center"} border={"1px solid"}>
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
            </VStack>
            <VStack rounded={"7px"} p={"20px"} border={"1px solid"} w={"fit-content"}>
                <Heading>Latest User Feedback</Heading>
                <ReportBarChartHook/>
            </VStack>
        </Flex>
        ):(
        <Container>
            <Flex direction={"column"} gap={4} p={"10px"}>
                <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} rounded={"7px"}>
                    <Heading>Your organizations</Heading>
                    {org_members.length > 0 ? (
                            <Table.ScrollArea maxW={"80%"} borderWidth="1px">
                                <Table.Root size={"400px"}>
                                    <Table.Header >
                                        <Table.Row >
                                            <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Organization</Table.ColumnHeader>
                                            <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>No. Members</Table.ColumnHeader>
                                            <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>No. Buildings</Table.ColumnHeader>
                                            <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>No. Rooms</Table.ColumnHeader>
                                            <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>No. Feedback</Table.ColumnHeader>
                                            {/* <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>Role</Table.ColumnHeader> */}
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
                                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {m.organization_name}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {item.member_count}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {item.building_count}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {item.totalRoom_count}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {item.report_count}
                                                            </Table.Cell>
                                                            {/* <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {item.owner === userInfo?.id ? "owner/editor" : m.role}
                                                            </Table.Cell> */}
                                                        </Table.Row>
                                                    );
                                                })
                                            )
                                        }
                                    </Table.Body>
                                </Table.Root>
                            </Table.ScrollArea>
                        ) : ("You have no organization")
                        }
                </VStack>
                <VStack rounded={"7px"} p={"20px"} border={"1px solid"} w={"fit-content"}>
                    <Heading>Latest User Feedback</Heading>
                    <ReportBarChartHook/>
                </VStack>
            </Flex>
        </Container>
    )}
    </Box>
  )
}

export default HomeOrganization
