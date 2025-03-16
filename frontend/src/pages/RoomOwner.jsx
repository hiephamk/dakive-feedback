import { Box } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from 'react-router-dom'

const RoomOwner = () => {
  return (
    <Box>
        <Nav/>
        <Box>
            <Outlet/>
        </Box>
    </Box>
  )
}

export default RoomOwner