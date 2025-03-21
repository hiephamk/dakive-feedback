import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router'; // Fixed import for Link
import { Box, Input, VStack, Button, Center, Container, Heading, HStack, Flex, Textarea } from '@chakra-ui/react';
import axios from 'axios';
import { FaFrown, FaMeh, FaSmile, FaGrin, FaGrinStars } from 'react-icons/fa';
import useAccessToken from '../../services/token';
import useBuilding from '../BuildingManagement/BuildingHook';
import NavUserReport from '../NavUserReport';

const CreateRoomReport = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const { buildings } = useBuilding(userInfo?.id);
  const { roomId} = useParams();
  

  const [buildingId, setBuildingId] = useState('');
  
  const [rooms, setRooms] = useState([])

  const fetchRoom = async ()=> {
    const url = import.meta.env.VITE_ROOM_LIST_URL
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      const filterItem = response.data.filter((room) => room.id === Number(roomId))
      if(filterItem.length > 0){

        setRooms(filterItem)
      }else {
        setRooms("")
      }
  }catch(error) {
      console.error("Cannot list user's room", error.response?.data || error.message);
      alert("Cannot list user's room");
  }
  }
  useEffect(()=> {
    if(roomId && accessToken){
      fetchRoom()
    }
  },[roomId, accessToken])

  const [formData, setFormData] = useState({
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
    feedback_status: '', // Fixed typo: removed comma
  });

  // Sync roomId and buildingId from URL params
  useEffect(() => {
    if (roomId) {
      const selectedRoom = rooms.find((room) => room.id === Number(roomId));
      if (selectedRoom) {
        setBuildingId(selectedRoom.building);
      }
    }
  }, [roomId, rooms]);

  // Update formData when roomId or buildingId changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      room: roomId,
      building: buildingId,
    }));
  }, [roomId, buildingId]);

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
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      alert('The room report was sent.');
      console.log('Send room report', response.data);

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
    { icon: <FaFrown />, value: 1, label: 'Disappointed' },
    { icon: <FaMeh />, value: 2, label: 'Neutral' },
    { icon: <FaSmile />, value: 3, label: 'Okay' },
    { icon: <FaGrin />, value: 4, label: 'Happy' },
    { icon: <FaGrinStars />, value: 5, label: 'Very Happy' },
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

  return (
    <Container>
        <NavUserReport/>
      <Container mt={5} p={4} rounded={8} justifyContent="center" maxW="500px" shadow="3px 3px 15px 5px rgb(75, 75, 79)">
        {rooms.length > 0 ? (
          <Box rounded={8} p={4} gap={4} minW="100%">
            <Heading>Create Room Report</Heading>
            <Box p={4} rounded={5}>
              {/* Room and Building Info */}
              <Box w="100%">
                <HStack>
                  <label>Room:</label>
                  <Input
                    value={rooms.find((room) => room.id === Number(roomId))?.name || ''}
                    readOnly
                  />
                </HStack>
                <HStack>
                  <label>Building:</label>
                  <Input
                    value={buildings.find((building) => building.id === Number(buildingId))?.name || ''}
                    readOnly
                  />
                </HStack>
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
      
        ) : (
          <Center>
            <HStack>
              <Heading>You have no rooms. Please </Heading>
              <RouterLink to="/room/create-room">Click here</RouterLink>
              <Heading>to create a room first</Heading>
            </HStack>
          </Center>
        )}
      </Container>
    </Container>
  );
};

export default CreateRoomReport;