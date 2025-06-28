import { Box, Collapsible, Flex, List,HStack, Stack, Text, VStack, Heading, Dialog, CloseButton, Button, Portal } from '@chakra-ui/react'
import {useState, useEffect} from 'react'
import AddMembersToCircle from '../components/community/Circles/AddMembersToCircle'
import Circle_Notifications from '../components/community/Circles/Circle_Notifications'
import Circles from '../components/community/Circles/Circles'
import PostAndComment from '../components/community/Post/PostAndComment'
import useCircle from '../components/community/Circles/useCircle'
import { useSelector } from 'react-redux'
import AddMembersToGroup from '../components/community/Groups/AddMembersToGroup'
import CreateGroup from '../components/community/Groups/CreateGroup'
import useListGroups from '../components/community/Groups/ListGroupsHook'
import useGroupMember from '../components/community/Groups/Group_Member_Hook'

import { RiUserAddFill } from "react-icons/ri";
import { Outlet } from 'react-router-dom'

const Community_Dashboard = () => {
    const { userInfo } = useSelector(state => state.auth)
    const {circles} = useCircle()
    const { groups } = useListGroups()
    const {groupMembers} = useGroupMember()
    const [refetchGroupMember, setRefetchGroupMembers] = useState(0);

    const handleGroupMemberAdded = () => {
        setRefetchGroupMembers((prev) => prev + 1);
    };

    console.log("groupMember:", groupMembers)

  return (
    <Box mt={"20px"}>
        <Flex justifyContent={"space-between"} gap={"10px"}>
            <Stack flexBasis={"25%"} h={"100vh"} p={"10px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={"7px"}>
                <Heading>Members</Heading>
                <Box h={"fit-content"} p={"10px"} rounded={"5px"} >
                    <Collapsible.Root>
                        <Collapsible.Trigger cursor={"pointer"}>
                            <HStack><RiUserAddFill/> Add friends</HStack>
                        </Collapsible.Trigger>
                        <Collapsible.Content border={"1px solid"} rounded={"5px"} p={"10px"}>
                            <AddMembersToCircle/>
                        </Collapsible.Content>
                    </Collapsible.Root>
                </Box>
                <Box rounded={"5px"} p={"10px"}>
                    <Circle_Notifications/>
                </Box>
                <Box rounded={"5px"} p={"10px"}>
                    <Text>Member List:</Text>
                    <List.Root ml={"20px"}>
                        <List.Item>
                            <Circles/>
                        </List.Item>
                    </List.Root>
                </Box>
                <Box>
                    <Heading>Group</Heading>
                {circles.length > 0 ? (
                    circles.filter(item => item.owner === userInfo?.id).length > 0 ? (
                    circles
                        .filter(item => item.owner === userInfo?.id)
                        .map(item => (
                        <Box key={item.id} mb={4} p={4} borderWidth="1px" borderRadius="md">
                            <Collapsible.Root>
                                <Collapsible.Trigger>Create Groups</Collapsible.Trigger>
                                <Collapsible.Content>
                                    <CreateGroup circleId={item.id} />
                                </Collapsible.Content>
                            </Collapsible.Root>
                            
                            <Box>
                                <Box mx={"10px"}>
                                    {groups.length > 0 ? (
                                        groups
                                        .filter(g => g.circle === item.id)
                                        .map(group => (
                                            <HStack key={group.id}>
                                                <Collapsible.Root>
                                                    <Collapsible.Trigger>{group.name}</Collapsible.Trigger>
                                                    <Collapsible.Content>
                                                        {groupMembers.length > 0 ? (
                                                            groupMembers
                                                            .filter(item => item.group === group.id && item.member !== userInfo?.id)
                                                            .map(member => (
                                                            <Box key={member.id}>
                                                                <Box>{member.member_name}</Box>
                                                            </Box>
                                                            ))):(<AddMembersToGroup groupId = {group.id} />)
                                                    }
                                                    </Collapsible.Content>
                                                </Collapsible.Root>
                                                <Dialog.Root>
                                                    <Dialog.Trigger asChild>
                                                        <RiUserAddFill/>
                                                    </Dialog.Trigger>
                                                    <Portal>
                                                        <Dialog.Backdrop />
                                                        <Dialog.Positioner>
                                                        <Dialog.Content>
                                                            <Dialog.Header>
                                                            <Dialog.Title>Add Group Members</Dialog.Title>
                                                            </Dialog.Header>
                                                            <Dialog.Body>
                                                                <AddMembersToGroup groupId = {group.id} />
                                                            </Dialog.Body>
                                                            <Dialog.CloseTrigger asChild>
                                                            <CloseButton size="sm" />
                                                            </Dialog.CloseTrigger>
                                                        </Dialog.Content>
                                                        </Dialog.Positioner>
                                                    </Portal>
                                                </Dialog.Root>
                                            </HStack>
                                        ))
                                    ):("")}
                                </Box>
                            </Box>
                        </Box>
                        ))
                    ) : (
                    <Text>You don't own any circles.</Text>
                    )
                ) : (
                    <Text>You have no circles.</Text>
                )}
                </Box>

            </Stack>
            <Box flexBasis={"50%"} shadow="3px 3px 15px 5px rgb(75, 75, 79)" h={"100vh"} p={"10px"} rounded={"7px "}>
                <Box>
                    <Outlet/>
                    hello
                </Box>
            </Box>
            <Box flexBasis={"25%"} border={"1px solid"} h={"100vh"} p={"10px"} rounded={"7px"}>right side</Box>
        </Flex>
    </Box>
  )
}

export default Community_Dashboard