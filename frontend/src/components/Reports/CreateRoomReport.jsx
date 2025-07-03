import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link as RouterLink, useNavigate } from 'react-router';
import { Box, Input, VStack, Button, Center, Container, Heading, HStack, Flex, Textarea, Switch, Spinner } from '@chakra-ui/react';
import api from '../../services/api';
import { FaFrown, FaMeh, FaSmile, FaGrin, FaGrinStars } from 'react-icons/fa';
import NavUserReport from '../NavBars/NavUserReport';
import useOrganization from '../Organization/OrganizationHook';
import SyncSensorRoomData from '../Sensor-Data/SyncSensorRoomData';
import formatDate from '../formatDate';
// import formatDate from '../formatDate'

const CreateRoomReport = () => {
  const { roomId, showSensorData} = useParams();
  const { organizations } = useOrganization()
  const [syncTime, setSyncTime] = useState('')
  const [buildingId, setBuildingId] = useState('');
  const [organizationId, setOrganizationId] = useState('')
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState([])
  const [sensorData, setSensorData] = useState([])
  const [isShow, setIsShow ] = useState(false)
  const navigate = useNavigate()
  const token = "x8Kbf6R4Ti"
  const [selectedRoom, setSelectedRoom] = useState('')

  const fetchRoom = async ()=> {
    const url = import.meta.env.VITE_ROOM_LIST_FEEDBACK_URL
    try {
      const response = await api.get(url)
      const filterItem = response.data.filter((room) => room.id === Number(roomId))
      if(filterItem.length > 0){
        setRooms(filterItem)

      }else {
        setRooms([])
      }
  }catch(error) {
      console.error("Cannot list user's room", error.response?.data || error.message);
  }
  }
  useEffect(()=> {
    if(roomId){
      fetchRoom()
    }
  },[roomId])

useEffect(()=>{
  console.log("rooms:", rooms)
},[rooms])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSensorData = async() => {
    setLoading(true)
    const url = import.meta.env.VITE_ROOM_SENSOR_REPORT_USERVIEW_URL
    try {
      const res = await api.get(url)
      const items = res.data
      const filteredItems = items
        .filter((room) => room.room === Number(roomId))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (filteredItems.length > 0) {
        setSensorData(filteredItems[0]);
      } else {
        setSensorData(null);
      }
    }catch(error){
      console.error("fetch sensor data error", error.response.data || error.message)
    }finally{
      setLoading(false)
    }
  }
  
    useEffect(() => {
    if (!isShow || !roomId) {
      return; // Don't start auto-refresh if toggle is off or no roomId
    }

    fetchSensorData();
  }, [isShow, roomId]);

  const [formData, setFormData] = useState({
    room: roomId|| '',
    building: buildingId || '',
    organization:organizationId || '',
    temperature_rating: '',
    temperature_notes: '',
    air_quality_rating: '',
    air_quality_notes: '',
    draft_rating: '',
    draft_notes: '',
    odor_rating: '',
    odor_notes: '',
    lighting_rating: '',
    lighting_notes: '',
    structural_change_rating: '',
    structural_change_notes: '',
    cleanliness_rating: '',
    cleanliness_notes: '',
    maintenance_notes: '',
    general_notes: '',
    feedback_status: '',
  });

  // Sync roomId and buildingId from URL params

  useEffect(() => {
    if (roomId) {
      setSelectedRoom(rooms.find(item => String(item.id) === String(roomId)));
      if (selectedRoom) {
        setBuildingId(selectedRoom?.building);
        setOrganizationId(selectedRoom?.organization.id);
      }
    }
  }, [roomId, rooms]);

  // Update formData when roomId or buildingId changes

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      room: roomId,
      building: buildingId,
      organization: organizationId
    }));
  }, [roomId, buildingId, organizationId]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle rating icon clicks
  const handleRatingClick = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = {
      temperature_rating: 'Temperature rating',
      air_quality_rating: 'Air quality rating',
      draft_rating: 'Draft rating',
      odor_rating: 'Odor rating',
      lighting_rating: 'Lighting rating',
      structural_change_rating: 'Structural change rating',
      cleanliness_rating: 'Cleanliness rating',
    };
    for (const field in requiredFields){
        if (!formData[field]){
            alert(`Please fill in the required field: ${requiredFields[field]}`)
            return
        }
    }
    const url = `${import.meta.env.VITE_ROOM_REPORT_CREATE_URL}${roomId}/`;
    try {
      await api.post(url, formData);
      // alert('The room report was sent.');
      
      navigate('/room/feedback/finished/')

      // Reset form fields
      setFormData({
        room: roomId || '',
        building: buildingId || '',
        temperature_rating: '',
        temperature_notes: '',
        air_quality_rating: '',
        air_quality_notes: '',
        draft_rating: '',
        draft_notes: '',
        odor_rating: '',
        odor_notes: '',
        lighting_rating: '',
        lighting_notes: '',
        structural_change_rating: '',
        structural_change_notes: '',
        cleanliness_rating: '',
        cleanliness_notes: '',
        maintenance_notes: '',
        general_notes: '',
        feedback_status: '',
      });
    } catch (error) {
      console.error('Error creating room report:', error.message);
      alert('Error sending room report');
    }
  };

  // Feedback icons and values
  const feedbackOptions = [
    { icon: <Box p={"10px"} rounded={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
      <FaFrown />
    </Box>, value: 1, label: 'Disappointed' },
    { icon: <Box p={"10px"} rounded={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
      <FaMeh />
    </Box>, value: 2, label: 'Neutral' },
    { icon: <Box p={"10px"} rounded={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
      <FaSmile />
    </Box>, value: 3, label: 'Okay' },
    { icon: <Box p={"10px"} rounded={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
      <FaGrin />
    </Box>, value: 4, label: 'Happy' },
    { icon: <Box p={"10px"} rounded={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
      <FaGrinStars />
    </Box>, value: 5, label: 'Very Happy' },
  ];

  // Render rating icons for a specific field
  const renderRatingIcons = (fieldName) => (
    <Flex justifyContent="space-between">
      {feedbackOptions.map((option) => (
        <Box
          key={option.value}
          as="button"
          type="button"
          onClick={() => handleRatingClick(fieldName, option.value)}
          fontSize="2xl"
          color={formData[fieldName] === option.value ? 'blue.500' : 'gray.300'}
          _hover={{ color: 'blue.300' }}
          title={option.label}
        >
          {option.icon}
        </Box>
      ))}
    </Flex>
  );
 useEffect(() => {
    const now = new Date();
    setSyncTime(new Date(now.getTime()));

  }, []);
  useEffect(()=>{
    console.log("syncTime:", syncTime)
  },[syncTime])
  return (
    <Container>
        <NavUserReport/>
      <Container mt={5} p={4} rounded={8} justifyContent="center" maxW="500px" shadow="3px 3px 15px 5px rgb(75, 75, 79)">
        {
          <Box rounded={8} p={4} gap={4} minW="100%">
            <Heading>Create Room Report</Heading>
            <Box p={4} rounded={5}>
              {/* Room and Building Info */}
              <Box w="100%">
                <Box>
                  <HStack>
                    <label>Room:</label>
                    <Input
                      // value={rooms.name}
                      value={rooms.find((room) => room.id === Number(roomId))?.name || ''}
                      readOnly
                    />
                  </HStack>
                  <HStack>
                    <label>Building:</label>
                    <Input
                      // value={rooms.building_name}
                      value={rooms.find((room) => room.id === Number(roomId))?.building_name || ''}
                      readOnly
                    />
                  </HStack>

                  <Box>
                      {showSensorData.includes(token) ? (
                        <Box  border={"1px solid"} rounded={"7px"} p={"10px"} my={"10px"}>
                          <Switch.Root
                            checked={isShow}
                            onCheckedChange={(e) => setIsShow(e.checked)}
                          >
                            <Switch.HiddenInput />
                            <Switch.Control>
                              <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Label>Show Sensor Data</Switch.Label>
                          </Switch.Root>
                        </Box>
                      ):("")}
                    <Box>
                      {isShow && (
                        (
                          <VStack>
                            <Box>
                              {selectedRoom ? (
                              <SyncSensorRoomData
                                onSyncSuccess={fetchSensorData}
                                roomid={selectedRoom.id}
                                buildingid={selectedRoom.building}
                                created_at={syncTime}
                              />
                            ) : ("no sync")}
                            </Box>
                            <HStack key={sensorData && sensorData.id} my={"5px"} p={"5px"} justifyContent={"space-between"}>
                            
                              {/* <Box border={"1px solid"} rounded={"3px"} p={"5px"}>Room Name: {sensorData.room_name}</Box> */}
                              <Box rounded={"3px"} p={"10px"}>Temp: {sensorData? sensorData.temperature : '-'}°C</Box>
                              <Box rounded={"3px"} p={"10px"}>Humid: {sensorData?sensorData.humidity : '-'}%</Box>
                              <Box rounded={"3px"} p={"10px"}>CO2: {sensorData? sensorData.co2 : '-'}</Box>
                              <Box rounded={"3px"} p={"10px"}>updated: {sensorData ? formatDate(new Date(sensorData.created_at).getTime() + 3 * 60 * 60 * 1000) : '-'}</Box>
                            </HStack>
                          </VStack>
                      ))
                  
                      }
                    </Box>
                  
                  </Box>
                </Box>
                {/* Rating Fields */}
                <Box>
                  <Box my={6}>
                    <Box my={4}><label>Temperature Rating:</label></Box>
                    <Box my={4}>{renderRatingIcons('temperature_rating')}</Box>
                    <Textarea
                      mt={2}
                      p={3}
                      name="temperature_notes"
                      value={formData.temperature_notes}
                      onChange={handleChange}
                      placeholder="Temperature notes"
                    />
                  </Box>
                  <Box>
                    <Box my={4}><label>Air Quality Rating:</label></Box>
                    <Box my={4}>{renderRatingIcons('air_quality_rating')}</Box>
                    <Textarea
                      mt={2}
                      name="air_quality_notes"
                      value={formData.air_quality_notes}
                      onChange={handleChange}
                      placeholder="Air quality notes"
                    />
                  </Box>
                  <Box>
                    <Box my={4}><label>Draft Rating:</label></Box>
                    <Box my={4}>{renderRatingIcons('draft_rating')}</Box>
                    <Textarea
                      mt={2}
                      name="draft_notes"
                      value={formData.draft_notes}
                      onChange={handleChange}
                      placeholder="Draft notes"
                    />
                  </Box>
                  <Box>
                    <Box my={4}><label>Odor Rating:</label></Box>
                    <Box my={4}>{renderRatingIcons('odor_rating')}</Box>
                    <Textarea
                      mt={2}
                      name="odor_notes"
                      value={formData.odor_notes}
                      onChange={handleChange}
                      placeholder="Odor notes"
                    />
                  </Box>
                  <Box>
                    <Box my={4}><label>Lighting Rating:</label></Box>
                    <Box my={4}>{renderRatingIcons('lighting_rating')}</Box>
                    <Textarea
                      mt={2}
                      name="lighting_notes"
                      value={formData.lighting_notes}
                      onChange={handleChange}
                      placeholder="Lighting notes"
                    />
                  </Box>
                  <Box>
                    <Box my={4}><label>Structural Change Rating:</label></Box>
                    <Box my={4}>{renderRatingIcons('structural_change_rating')}</Box>
                    <Textarea
                      mt={2}
                      name="structural_change_notes"
                      value={formData.structural_change_notes}
                      onChange={handleChange}
                      placeholder="Structural change notes"
                    />
                  </Box>
                  <Box m={4}>
                      <Box my={4}><label>Cleanliness Rating:</label></Box>
                      <Box my={4}>{renderRatingIcons('cleanliness_rating')}</Box>
                    <Textarea
                      name="cleanliness_notes"
                      value={formData.cleanliness_notes}
                      onChange={handleChange}
                      placeholder="Cleanliness notes"
                      w="100%"
                      my={4}
                    />
                  </Box>
                  <Box w="100%">
                    <Box my={4}><label>Maintenance Notes:</label></Box>
                    <Textarea
                      name="maintenance_notes"
                      value={formData.maintenance_notes}
                      onChange={handleChange}
                      placeholder="Maintenance notes"
                    />
                  </Box>
                  <Box w="100%">
                    <Box my={4}><label>General Notes:</label></Box>
                    <Textarea
                      name="general_notes"
                      value={formData.general_notes}
                      onChange={handleChange}
                      placeholder="General notes"
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
              <VStack>
                <Button onClick={handleSubmit} textAlign="center">
                  Send
                </Button>
              </VStack>
          </Box>
        }
      </Container>
    </Container>
  );
};

export default CreateRoomReport;