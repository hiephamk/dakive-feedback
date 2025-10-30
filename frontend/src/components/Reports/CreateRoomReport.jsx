import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Input, VStack, Button, Center, Container, Heading, HStack, Flex, Textarea, Switch, Spinner } from '@chakra-ui/react';
import api from '../../services/api';
import { FaFrown, FaMeh, FaSmile, FaGrin, FaGrinStars } from 'react-icons/fa';
import NavUserReport from '../NavBars/NavUserReport';
import useOrganization from '../Organization/OrganizationHook';
import SyncSensorRoomData from '../Sensor-Data/SyncSensorRoomData';
import formatDate from '../formatDate';

const CreateRoomReport = () => {
  const { t } = useTranslation();
  const { roomId, showSensorData} = useParams();
  const { organizations } = useOrganization();
  const [syncTime, setSyncTime] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [isShow2, setIsShow2] = useState(false);
  const navigate = useNavigate();
  const token = "x8Kbf6R4Ti";
  const token2 = "sT2Hy4dgsU";
  const [selectedRoom, setSelectedRoom] = useState('');

  const fetchRoom = async () => {
    const url = import.meta.env.VITE_ROOM_LIST_FEEDBACK_URL;
    try {
      const response = await api.get(url);
      const filterItem = response.data.filter((room) => room.id === Number(roomId));
      if (filterItem.length > 0) {
        setRooms(filterItem);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error(t('error.cannot_list_rooms'), error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  useEffect(() => {
    console.log("rooms:", rooms);
  }, [rooms]);

  const fetchSensorData = async () => {
    setLoading(true);
    const url = import.meta.env.VITE_ROOM_SENSOR_REPORT_USERVIEW_URL;
    try {
      const res = await api.get(url);
      const items = res.data;
      const filteredItems = items
        .filter((room) => room.room === Number(roomId))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (filteredItems.length > 0) {
        setSensorData(filteredItems[0]);
      } else {
        setSensorData(null);
      }
    } catch (error) {
      console.error(t('error.fetch_sensor_data_error'), error.response.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isShow || !roomId) {
      return;
    }

    fetchSensorData();
  }, [isShow, roomId]);

  const [formData, setFormData] = useState({
    room: roomId || '',
    building: buildingId || '',
    organization: organizationId || '',
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
    food_rating:'',
    food_rating_note: '',
    support_rating:'',
    support_rating_note:''
  });

  useEffect(() => {
    if (roomId && rooms.length > 0) {
      const foundRoom = rooms.find(item => String(item.id) === String(roomId));
      if (foundRoom) {
        setSelectedRoom(foundRoom);
        setBuildingId(foundRoom.building);
        setOrganizationId(foundRoom.organization.id);
      }
    }
  }, [roomId, rooms]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      room: roomId,
      building: buildingId,
      organization: organizationId
    }));
  }, [roomId, buildingId, organizationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingClick = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      temperature_rating: parseInt(formData.temperature_rating || 0, 10),
      air_quality_rating: parseInt(formData.air_quality_rating || 0, 10),
      draft_rating: parseInt(formData.draft_rating || 0, 10),
      odor_rating: parseInt(formData.odor_rating || 0, 10),
      lighting_rating: parseInt(formData.lighting_rating || 0, 10),
      structural_change_rating: parseInt(formData.structural_change_rating || 0, 10),
      cleanliness_rating: parseInt(formData.cleanliness_rating || 0, 10),
      food_rating: parseInt(formData.food_rating || 0, 10),
      support_rating: parseInt(formData.support_rating || 0, 10),
    };
    const url = `${import.meta.env.VITE_ROOM_REPORT_CREATE_URL}${roomId}/`;
    try {
      await api.post(url, payload);
      // alert(t('create_room_report.report_sent'));
      navigate('/room/feedback/finished/', { state: { shouldRefresh: true } });
      window.location.href = '/room/feedback/finished/';
    } catch (error) {
      console.error(t('error.report_error'), error.message);
      alert(t('error.report_error'));
    }
  };


  const feedbackOptions = [
    { icon: <Box p={"10px"} rounded={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
      <FaFrown />
    </Box>, value: 1, label: t('create_room_report.disappointed') },
    { icon: <Box p={"10px"} rounded={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
      <FaMeh />
    </Box>, value: 2, label: t('create_room_report.neutral') },
    { icon: <Box p={"10px"} rounded={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
      <FaSmile />
    </Box>, value: 3, label: t('create_room_report.okay') },
    { icon: <Box p={"10px"} rounded={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
      <FaGrin />
    </Box>, value: 4, label: t('create_room_report.happy') },
    { icon: <Box p={"10px"} rounded={"5px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
      <FaGrinStars />
    </Box>, value: 5, label: t('create_room_report.very_happy') },
  ];

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

  useEffect(() => {
    console.log("syncTime:", syncTime);
  }, [syncTime]);

  return (
    <Container>
      <NavUserReport />
      <Container mt={5} p={4} rounded={8} justifyContent="center" maxW="500px" shadow="3px 3px 15px 5px rgb(75, 75, 79)">
        {
          <Box rounded={8} p={4} gap={4} minW="100%">
            <Center>
              <Heading fontSize={"24px"}>{t('report.heading')}</Heading>
            </Center>
            <Box p={4} rounded={5}>
              <Box w="100%">
                <Box>
                  <HStack>
                    <label>{t('report.rooms')}:</label>
                    <Input
                      value={rooms.find((room) => room.id === Number(roomId))?.name || ''}
                      readOnly
                    />
                  </HStack>
                  <HStack>
                    <label>{t('report.buildings')}:</label>
                    <Input
                      value={rooms.find((room) => room.id === Number(roomId))?.building_name || ''}
                      readOnly
                    />
                  </HStack>

                  <Box>
                    {showSensorData.includes(token) ? (
                      <Box border={"1px solid"} rounded={"7px"} p={"10px"} my={"10px"}>
                        <Switch.Root
                          checked={isShow}
                          onCheckedChange={(e) => setIsShow(e.checked)}
                        >
                          <Switch.HiddenInput />
                          <Switch.Control>
                            <Switch.Thumb />
                          </Switch.Control>
                          <Switch.Label>{t('report.show_sensor_data')}</Switch.Label>
                        </Switch.Root>
                      </Box>
                    ) : ("")}
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
                              ) : (t('report.no_sync'))}
                            </Box>
                            <HStack key={sensorData && sensorData.id} my={"5px"} p={"5px"} justifyContent={"space-between"}>
                              <Box rounded={"3px"} p={"10px"}>{t('report.temperature')}: {sensorData ? sensorData.temperature : '-'}°C</Box>
                              <Box rounded={"3px"} p={"10px"}>{t('report.humidity')}: {sensorData ? sensorData.humidity : '-'}%</Box>
                              <Box rounded={"3px"} p={"10px"}>{t('report.co2')}: {sensorData ? sensorData.co2 : '-'}</Box>
                              <Box rounded={"3px"} p={"10px"}>{t('report.updated')}: {sensorData ? formatDate(new Date(sensorData.created_at).getTime() + 3 * 60 * 60 * 1000) : '-'}</Box>
                            </HStack>
                          </VStack>
                        ))
                      }
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Box my={6}>
                    <Box my={4}><label>{t('report.temperature_rating')}:</label></Box>
                    <Box my={4}>{renderRatingIcons('temperature_rating')}</Box>
                    <Textarea
                      mt={2}
                      p={3}
                      name="temperature_notes"
                      value={formData.temperature_notes}
                      onChange={handleChange}
                      placeholder={t('report.temperature_notes')}
                    />
                  </Box>
                  <Box>
                    <Box my={4}><label>{t('report.air_quality_rating')}:</label></Box>
                    <Box my={4}>{renderRatingIcons('air_quality_rating')}</Box>
                    <Textarea
                      mt={2}
                      name="air_quality_notes"
                      value={formData.air_quality_notes}
                      onChange={handleChange}
                      placeholder={t('report.air_quality_notes')}
                    />
                  </Box>
                  <Box>
                    <Box my={4}><label>{t('report.draft_rating')}:</label></Box>
                    <Box my={4}>{renderRatingIcons('draft_rating')}</Box>
                    <Textarea
                      mt={2}
                      name="draft_notes"
                      value={formData.draft_notes}
                      onChange={handleChange}
                      placeholder={t('report.draft_notes')}
                    />
                  </Box>
                  <Box>
                    <Box my={4}><label>{t('report.odor_rating')}:</label></Box>
                    <Box my={4}>{renderRatingIcons('odor_rating')}</Box>
                    <Textarea
                      mt={2}
                      name="odor_notes"
                      value={formData.odor_notes}
                      onChange={handleChange}
                      placeholder={t('report.odor_notes')}
                    />
                  </Box>
                  <Box>
                    <Box my={4}><label>{t('report.lighting_rating')}:</label></Box>
                    <Box my={4}>{renderRatingIcons('lighting_rating')}</Box>
                    <Textarea
                      mt={2}
                      name="lighting_notes"
                      value={formData.lighting_notes}
                      onChange={handleChange}
                      placeholder={t('report.lighting_notes')}
                    />
                  </Box>
                  <Box>
                    <Box my={4}><label>{t('report.structural_change_rating')}:</label></Box>
                    <Box my={4}>{renderRatingIcons('structural_change_rating')}</Box>
                    <Textarea
                      mt={2}
                      name="structural_change_notes"
                      value={formData.structural_change_notes}
                      onChange={handleChange}
                      placeholder={t('report.structural_change_notes')}
                    />
                  </Box>
                  <Box m={4}>
                    <Box my={4}><label>{t('report.cleanliness_rating')}:</label></Box>
                    <Box my={4}>{renderRatingIcons('cleanliness_rating')}</Box>
                    <Textarea
                      name="cleanliness_notes"
                      value={formData.cleanliness_notes}
                      onChange={handleChange}
                      placeholder={t('report.cleanliness_notes')}
                      w="100%"
                      my={4}
                    />
                  </Box>
                  {/* additional feedback */}
                  {showSensorData.includes(token2) ? (
                    <Box>
                      <Box m={4}>
                        <Box my={4}><label>{t('report.food_rating')}:</label></Box>
                        <Box my={4}>{renderRatingIcons('food_rating')}</Box>
                        <Textarea
                          name="food_rating"
                          value={formData.food_rating_note}
                          onChange={handleChange}
                          placeholder={t('report.food_rating_note')}
                          w="100%"
                          my={4}
                        />
                    </Box>
                    <Box m={4}>
                      <Box my={4}><label>{t('report.support_rating')}:</label></Box>
                      <Box my={4}>{renderRatingIcons('support_rating')}</Box>
                      <Textarea
                        name="support_rating"
                        value={formData.support_rating_note}
                        onChange={handleChange}
                        placeholder={t('report.support_rating_note')}
                        w="100%"
                        my={4}
                      />
                    </Box>
                  </Box>
                  ):("")}
                  

                  <Box w="100%">
                    <Box my={4}><label>{t('report.maintenance_notes')}:</label></Box>
                    <Textarea
                      name="maintenance_notes"
                      value={formData.maintenance_notes}
                      onChange={handleChange}
                      placeholder={t('report.maintenance_notes')}
                    />
                  </Box>
                  <Box w="100%">
                    <Box my={4}><label>{t('report.general_notes')}:</label></Box>
                    <Textarea
                      name="general_notes"
                      value={formData.general_notes}
                      onChange={handleChange}
                      placeholder={t('report.general_notes')}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            <VStack>
              <Button onClick={handleSubmit} textAlign="center">
                {t('report.send')}
              </Button>
            </VStack>
          </Box>
        }
      </Container>
    </Container>
  );
};

export default CreateRoomReport;