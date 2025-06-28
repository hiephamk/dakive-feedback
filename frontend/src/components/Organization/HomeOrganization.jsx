import {useState, useEffect} from 'react'
import {Box, Button, HStack, Flex, VStack, Heading, Text, Image, Center, List, Table} from '@chakra-ui/react'
import FetchProfile from '../FetchProfile'
import useProfile from '../../services/ProfileHook'
import { useSelector } from 'react-redux'
import useOrganization from './OrganizationHook'
import formatDate from '../formatDate'
import useOrganization_Membership from './Organization_Membership_Hook'
import ReportBarChartHook from '../Reports/ReportBarChartHook'

const HomeOrganization = () => {
    const {user, userInfo} = useSelector(state => state.auth)
    const {full_name, profile_img} = useProfile(userInfo?.id)
    const [isView, setIView] = useState(false)
    const {organizations} = useOrganization()
    const { members } = useOrganization_Membership()

    const Org = organizations
    .filter(item => item.owner === userInfo.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const org_members = members.filter(item => item.user === userInfo.id && item.organizations === Org.id)

  return (
    <Box w={"100%"} ml={"10px"}>
        <Flex justifyContent={"space-between"}>
            <VStack maxW={"50%"} rounded={"7px"}  py={"20px"}>
                <VStack mx={"20px"} mb={"10px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} w={"100%"} rounded={"7px"}>
                    <Heading>Your own Organizations:</Heading>
                    <Center>
                        {Org.length > 0 ? (
                            <Table.Root w={"fit-content"} maxW={"50%"}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader textAlign={"center"} border={"1px solid"}>Name</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign={"center"} border={"1px solid"}>No. Buildings</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign={"center"} border={"1px solid"}>No. Rooms</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign={"center"} border={"1px solid"}>No. Feedback</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign={"center"} border={"1px solid"}>No. Members</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                {Org
                                    .filter(item => item.owner === userInfo?.id)
                                    .sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at))
                                    .map(item => (
                                    <Table.Body key={item.id}>
                                    <Table.Row>
                                        <Table.Cell textAlign={"center"} border={"1px solid"}>{item.name}</Table.Cell>
                                        <Table.Cell textAlign={"center"} border={"1px solid"}>{item.building_count}</Table.Cell>
                                        <Table.Cell textAlign={"center"} border={"1px solid"}>{item.totalRoom_count}</Table.Cell>
                                        <Table.Cell textAlign={"center"} border={"1px solid"}>{item.report_count}</Table.Cell>
                                        <Table.Cell textAlign={"center"} border={"1px solid"}>{item.member_count}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                ))}
                            </Table.Root>
                        ):("You have no ogranization")}
                    </Center>
                </VStack>
                <VStack mx={"10px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" w={"100%"} p={"10px"} rounded={"7px"}>
                    <Heading>You are an member of Organizations:</Heading>
                    <Center>
                        {org_members.length > 0 ? (
                            <Table.Root w={"fit-content"} maxW={"50%"}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader textAlign={"center"} border={"1px solid"}>Name</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign={"center"} border={"1px solid"}>No. Buildings</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign={"center"} border={"1px solid"}>No. Rooms</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign={"center"} border={"1px solid"}>No. Feedback</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign={"center"} border={"1px solid"}>Role</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                {org_members
                                    .map(m => organizations
                                        .filter(o => o.id === m.organization)
                                        .map(item =>(
                                    <Table.Body key={item.id}>
                                    <Table.Row>
                                        <Table.Cell textAlign={"center"} border={"1px solid"}>{m.organization_name}</Table.Cell>
                                        <Table.Cell textAlign={"center"} border={"1px solid"}>{item.building_count}</Table.Cell>
                                        <Table.Cell textAlign={"center"} border={"1px solid"}>{item.totalRoom_count}</Table.Cell>
                                        <Table.Cell textAlign={"center"} border={"1px solid"}>{item.report_count}</Table.Cell>
                                        <Table.Cell textAlign={"center"} border={"1px solid"}>{m.role}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                )))}
                            </Table.Root>
                        ):("You have no ogranization")}
                    </Center>
                </VStack>
            </VStack>
            <Box>
                <Heading>Latest User Feedback</Heading>
                <ReportBarChartHook/>
            </Box>
        </Flex>
    </Box>
  )
}

export default HomeOrganization