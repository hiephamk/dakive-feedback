import React from 'react'
import { Box, Tabs } from '@chakra-ui/react'
import SensorReportsList from '../Sensor-Data/SensorReportsList'

const BuildingReports = () => {
  return (
    <Box>
        <Tabs.Root defaultValue={"user-feedback"}>
            <Tabs.List>
                <Tabs.Trigger value="user-feedback">User Feedback</Tabs.Trigger>
                <Tabs.Trigger value="sensor-data">Sensor Data</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value='user-feedback'>
                <BuildingReports/>
            </Tabs.Content>
            <Tabs.Content value='sensor-data'>
                <SensorReportsList/>
            </Tabs.Content>
        </Tabs.Root>
    </Box>
  )
}

export default BuildingReports