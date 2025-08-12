
import {useState, useEffect} from 'react'
import {Box, Container, Button, HStack, Flex, VStack, Heading, Text, Image, Center, List, Table, Stack} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next';
import FetchProfile from '../FetchProfile'
import useProfile from '../../services/ProfileHook'
import { useSelector } from 'react-redux'
import useOrganization from './OrganizationHook'
import formatDate from '../formatDate'
import useOrganization_Membership from './Organization_Membership_Hook'
import ReportBarChartHook from '../Reports/ReportBarChartHook'
import UserFeedbackHook from '../Reports/UserFeedbackHook'
import useBuilding from '../BuildingManagement/BuildingHook'
import ReportAnalyticHook from '../Reports/ReportAnalyticHook'

const HomeOrganization = () => {
    const { t } = useTranslation();
    const {userInfo} = useSelector(state => state.auth)
    const {organizations} = useOrganization()
    const { members } = useOrganization_Membership()
    const {reports, reportChart} = UserFeedbackHook()
    const [bestRoom, setBestRoom] = useState([])

    const Org = organizations
    .filter(item => item.owner === userInfo.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const org_members = members.filter(item => item.user === userInfo.id && item.organizations === Org.id)
    const {buildings} = useBuilding()

    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 450px)");
        setIsDesktop(mediaQuery.matches);
        const handleResize = (e) => setIsDesktop(e.matches);
        mediaQuery.addEventListener("change", handleResize);
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

return (
    <Box w={"100%"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={"7px"}>
        {isDesktop?(
        <Center>
            <VStack justify={"space-between"} gap={4}>
                <VStack border={"1px solid"} rounded={"7px"} my={"10px"}>
                    <Heading my={"10px"}>{t('home.latest_user_feedback')}</Heading>
                    <HStack rounded={"7px"} p={"20px"} w={"fit-content"}>
                        {org_members.length > 0 && org_members
                        .slice(0,2)
                        .map(org => (
                            <Box key={org.id}>
                                <ReportAnalyticHook selectedId={org.organization}/>
                            </Box>
                        ))}
                    </HStack>
                </VStack>
                <VStack border={"1px solid"} rounded={"7px"} p={"20px"} w={"fit-content"}>
                    <VStack mt={'20px'} shadow="3px 3px 15px 5px rgb(75, 75, 79)" p={"10px"} w={"100%"} rounded={"7px"}>
                        <Heading>{t('home.your_organizations')}</Heading>
                        <Box>
                            {org_members.length > 0 ? (
                                <Table.Root>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.organization')}</Table.ColumnHeader>
                                            <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.members')}</Table.ColumnHeader>
                                            <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.buildings')}</Table.ColumnHeader>
                                            <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.rooms')}</Table.ColumnHeader>
                                            <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.feedback')}</Table.ColumnHeader>
                                            <Table.ColumnHeader fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.role')}</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {org_members
                                            .map(m => organizations
                                                .filter(o => o.id === m.organization)
                                                .map(item => (
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
                                                                {item.owner === userInfo?.id ? t('home.owner_editor') : m.role}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    )
                                                )
                                            )
                                        }
                                    </Table.Body>
                                </Table.Root>
                            ) : (t('home.you_have_no_organization'))}
                        </Box>
                    </VStack>
                        <Flex gap={"10px"}>
                            <Box shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={"7px"} p={"10px"}>
                                <Center my={"7px"}>
                                    <Heading>{t('home.building_reports')}</Heading>
                                </Center>
                                {org_members.length > 0 ? (
                                <Table.Root maxW={"sm"}>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.organization')}</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.no_feedback')}</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.best_building')}</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.worst_building')}</Table.ColumnHeader>
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
                                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {item.name}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {item.report_count > 0 ? (item.report_count) : t('home.no_feedback')}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {bestBuilding && bestBuilding.room_average_rating > 0 ? t('home.avg_rating', { rating: bestBuilding.room_average_rating }) : t('home.no_feedback')}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {worstBuilding && worstBuilding.room_average_rating > 0 ? t('home.avg_rating', { rating: worstBuilding.room_average_rating }) : t('home.no_feedback')}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    );
                                                })
                                            )
                                        }
                                    </Table.Body>
                                </Table.Root>
                                ) : (t('home.you_have_no_organization'))
                                }
                            </Box>
                            <Box shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={"7px"} p={"10px"} mx={"auto"}>
                            <Center my={"7px"}><Heading>{t('home.room_reports')}</Heading></Center>
                                {org_members.length > 0 ? (
                                <Table.Root maxW={"sm"}>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.organization')}</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.no_feedback')}</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.best_room')}</Table.ColumnHeader>
                                            <Table.ColumnHeader fontSize={"14px"} fontWeight={"bold"} textAlign={"center"} border={"1px solid"}>{t('home.worst_room')}</Table.ColumnHeader>
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
                                                                {item.name}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {item.report_count}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {bestRoom ? `${bestRoom.room_name}-${bestRoom.building_name} (${t('home.avg_rating', { rating: bestRoom.overall_avg_rating })})` : t('home.no_feedback')}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign={"center"} border={"1px solid"}>
                                                                {worstRoom ? `${worstRoom.room_name}-${worstRoom.building_name} (${t('home.avg_rating', { rating: worstRoom.overall_avg_rating })})` : t('home.no_feedback')}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    );
                                                })
                                            )
                                        }
                                    </Table.Body>
                                </Table.Root>
                                ) : (t('home.you_have_no_organization'))}
                            </Box>
                        </Flex>
                </VStack>
            </VStack>
        </Center>
        ):(
            <VStack rounded={"7px"} mx={"auto"} py={"10px"} maxW={"100%"}>
                <Heading>{t('home.latest_user_feedback')}</Heading>
                {org_members.length > 0 && org_members
                .slice(0,2)
                .map(org => (
                    <Box key={org.id}>
                        <ReportAnalyticHook selectedId={org.organization}/>
                    </Box>
                ))}
            </VStack>
        )}
    </Box>
  )
}

export default HomeOrganization