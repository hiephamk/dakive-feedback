
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useAccessToken from '../../services/token';
import { Box, Text, HStack, Input, VStack, Button, Center, Heading, Container, Field, Select } from '@chakra-ui/react';
import axios from 'axios';
import useBuilding from '../BuildingManagement/BuildingHook';
import { useParams, useNavigate } from 'react-router-dom';

const CreateRoomAsBuildingId = () => {
  const { t } = useTranslation();
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const navigate = useNavigate();
  const { buildings } = useBuilding(userInfo?.id);
  const { buildingId, externalId, orgId } = useParams();

  const generateRandom = (length = 8) => {
    return Math.random().toString(36).substring(2, 2 + length);
  };

  const [formData, setFormData] = useState({
    name: "",
    room_size: "",
    floor: "",
    description: "",
    building: Number(buildingId) || "",
    external_id: generateRandom(),
  });

  // Update formData when buildingId changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, building: Number(buildingId) }));
  }, [buildingId]);

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const url = import.meta.env.VITE_ROOM_CREATE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = {
      name: t('update_room.name'),
      floor: t('update_room.floor'),
      building: t('update_room.building'),
    };
    for (const field in requiredFields) {
      if (!formData[field]) {
        alert(t('update_room.required_field', { field: requiredFields[field] }));
        return;
      }
    }
    try {
      await axios.post(url, formData, config);
      alert(t('update_room.room_created'));
      setFormData({
        name: "",
        room_size: "",
        floor: "",
        description: "",
        building: Number(buildingId),
        external_id: generateRandom(),
      });
      navigate(`/home/management/room-list/${buildingId}/${externalId}/${orgId}`);
    } catch (error) {
      console.error("Error creating room:", error.response?.data || error.message);
      alert(error.response?.data?.message || t('admin_page.unexpected_error'));
    }
  };

  return (
    <Container justifyContent="center" maxW="500px" mt={10}>
      <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" m={4} p={4} rounded={8} minW="100%">
        <HStack w="100%" justifyContent="space-between">
          <Box p={1}>
            {buildings
              .filter((item) => item.id === Number(buildingId))
              .map((building) => (
                <Box key={building.id}>
                  <Heading>
                    {t('room_list.create_new_rooms')} - {building.name}
                  </Heading>
                </Box>
              ))}
          </Box>

        </HStack>
        <Field.Root required>
          <HStack>
            <Field.Label w="200px">
              {t('update_room.name')}: <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('update_room.placeholder_name')}
            />
          </HStack>
        </Field.Root>
        <Field.Root required>
          <HStack>
            <Field.Label w="200px">
              {t('update_room.floor')}: <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="text"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              placeholder={t('update_room.placeholder_floor')}
            />
          </HStack>
        </Field.Root>
        <Field.Root>
          <HStack>
            <Field.Label w="200px">{t('update_room.room_size')}:</Field.Label>
            <Input
              type="text"
              name="room_size"
              value={formData.room_size}
              onChange={handleChange}
              placeholder={t('update_room.placeholder_room_size')}
            />
          </HStack>
        </Field.Root>
        <Field.Root>
          <HStack>
            <Field.Label w="200px">{t('update_room.description')}:</Field.Label>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('update_room.placeholder_description')}
            />
          </HStack>
        </Field.Root>
        <Button onClick={handleSubmit}>{t('room_list.create_new_rooms')}</Button>
      </VStack>
    </Container>
  );
};

export default CreateRoomAsBuildingId;