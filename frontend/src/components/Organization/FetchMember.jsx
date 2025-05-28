import React from 'react'
import useOrganization_Member_Details from './Organization_Member_Details'
import { useSelector } from 'react-redux'
import { Box, Text } from '@chakra-ui/react'

const FetchMember = () => {
    const { user, userInfo} = useSelector(state => state.auth)
    const { members, role, organizationId} = useOrganization_Member_Details(userInfo?.id)
    console.log("Member_organ: ", organizationId)
    console.log("Members: ", members)
  return (
    <Box>
       <Text>Role: {role} </Text>
       <Box>
          Organization:
          {organizationId
          .filter(index => index === 3)
          .map((index) => (
              
          <Box key={index}>ID: {index &&
              <Text>This is index 3</Text>
          }</Box>
              
          ))}
        </Box>
       <Box> Members: 
           {members.map(member => (
            <Box key={member.id}>
                <Text>{member.members_full_name}</Text>
                <Text>{member.members_email}</Text>
            </Box>
           ))}
       </Box>
    </Box>
  )
}

export default FetchMember