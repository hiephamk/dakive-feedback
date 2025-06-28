import { Box, Container, HStack, VStack, Button, Table, Center, Tabs } from '@chakra-ui/react'
import { FaFrown, FaMeh, FaSmile, FaGrin, FaGrinStars } from 'react-icons/fa';
import UserFeedbackData_Building from '../UserFeedback/UserFeedbackData_Building'
import SensorDataRooms from '../Sensor-Data/SensorDataRooms';
import { useParams } from 'react-router-dom';


const BuldingReports = () => {
  
  const { id, roomId } = useParams();
  
  return (
    <>
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Trigger value='user-feedback'>User Feedback</Tabs.Trigger>
          <Tabs.Trigger value='sensor-data'>Sensor Data</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='user-feedback'>
          <UserFeedbackData_Building/>
        </Tabs.Content>
        <Tabs.Content value='sensor-data'>
          <SensorDataRooms/>
        </Tabs.Content>
      </Tabs.Root>
    </>
  )
}

export default BuldingReports