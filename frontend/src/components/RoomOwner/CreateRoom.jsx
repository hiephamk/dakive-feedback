// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import useAccessToken from '../../services/token';
// import { Box, Stack, Input, VStack, Button, Center, Heading, Container } from '@chakra-ui/react';
// import axios from 'axios';
// import useBuilding from '../BuildingManagement/BuildingHook';
// import useOrganization_Membership from '../Organization/Organization_Membership_Hook';

// const CreateRoom = () => {
//     const { user, userInfo } = useSelector((state) => state.auth);
//     const accessToken = useAccessToken(user);
//     const {members} = useOrganization_Membership()
//     // Fetch organizations
//     const {buildings} = useBuilding(userInfo?.id);
//     const [buildingId, setBuildingId] = useState('');

//     const generateRandom = (length = 8) => {
//         return Math.random().toString(36).substring(2, 2 + length)
//      }
//     const [formData, setFormData] = useState({
//         name: "",
//         room_size:"",
//         floor: "",
//         description: "",
//         building: buildingId || "",
//         external_id:generateRandom()
//     });

//     // Update formData when organizationId changes
//     useEffect(() => {
//         setFormData((prev) => ({ ...prev, building: buildingId }));
//     }, [buildingId]);

//     const config = {
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//         },
//     };

//     const url = import.meta.env.VITE_ROOM_CREATE_URL;

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post(url, formData, config);
//             alert("Created the room successfully");
//             setFormData({
//                 name: "",
//                 room_size:"",
//                 floor: "",
//                 description:"",
//                 building: buildingId, 
//                 external_id:""
//             });
//         } catch (error) {
//             console.error("Error creating room:", error.response?.data || error.message);
//         }
//     };

//     return (
//         <Container justifyContent="center" maxW="500px" mt={10}>
//             <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" m={4} p={4} rounded={8} minW="100%">
//                 <Heading>Create New Room</Heading>
//                 <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
//                 <Input type="text" name="room_size" value={formData.room_size} onChange={handleChange} placeholder="Room size" />
//                 <Input type="text" name="floor" value={formData.floor} onChange={handleChange} placeholder="Floor" />
//                 <Input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Descriptions" />
//                 <Box border="1px solid" p={1} rounded={5}>
//                 <select
//                 name="Room"
//                 id="room"
//                 value={buildingId}
//                 onChange={(e) => setBuildingId(e.target.value)}
//                 style={{height:'100%', padding:'5px'}}
//                 >
//                 <option value="">Choose Building</option>
//                 {members
//                     .filter(member => member.user === userInfo?.id && member.role === "editor")
//                     .map(org => (
//                         <Box key={org.id}>
//                             {buildings
//                                 .filter(building => building.organization === org.organization)
//                                 .map(building => (
//                                     <option key={building.id} value={building.id}>
//                                         {building.name}
//                                     </option>
//                                 ))
                                
//                             }
//                         </Box>
//                     ))
//                 }
//                 </select>
//                 </Box>
//                 <Button onClick={handleSubmit}>Create</Button>
//             </VStack>
//         </Container>
//     );
// };

// export default CreateRoom;

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useAccessToken from '../../services/token';
import { Box, Input, VStack, Button, Heading, Container, Field, HStack } from '@chakra-ui/react';
import axios from 'axios';
import useBuilding from '../BuildingManagement/BuildingHook';
import useOrganization_Membership from '../Organization/Organization_Membership_Hook';

const CreateRoom = () => {
  const { t } = useTranslation();
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const { members } = useOrganization_Membership();
  const { buildings } = useBuilding(userInfo?.id);
  const [buildingId, setBuildingId] = useState('');

  const generateRandom = (length = 8) => {
    return Math.random().toString(36).substring(2, 2 + length);
  };

  const [formData, setFormData] = useState({
    name: "",
    room_size: "",
    floor: "",
    description: "",
    building: buildingId || "",
    external_id: generateRandom(),
  });

  // Update formData when buildingId changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, building: buildingId }));
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
      alert("Created the room successfully");
      setFormData({
        name: "",
        room_size: "",
        floor: "",
        description: "",
        building: buildingId,
        external_id: generateRandom(),
      });
    } catch (error) {
      console.error("Error creating room:", error.response?.data || error.message);
      alert("Created the room is unsuccessful");
    }
  };

  return (
    <Container justifyContent="center" maxW="500px" mt={10}>
      <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" m={4} p={4} rounded={8} minW="100%">
        <HStack w="100%" justifyContent="space-between">
          <Heading>{t('room_list.create_new_rooms')}</Heading>
        </HStack>
        <Field.Root required>
          <HStack>
            <Field.Label w="200px">{t('update_room.name')}: <Field.RequiredIndicator /></Field.Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('update_room.placeholder_name')}
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
            <Field.Label w="200px">{t('update_room.floor')}:</Field.Label>
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
        <Field.Root required>
          <HStack>
            <Field.Label w="200px">{t('update_room.building')}: <Field.RequiredIndicator /></Field.Label>
            <Box border="1px solid" p={1} rounded={5} w="100%">
              <Select
                name="building"
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                placeholder={t('update_room.choose_building')}
              >
                {members
                  .filter((member) => member.user === userInfo?.id && member.role === "editor")
                  .map((org) => (
                    <Box key={org.id}>
                      {buildings
                        .filter((building) => building.organization === org.organization)
                        .map((building) => (
                          <option key={building.id} value={building.id}>
                            {building.name}
                          </option>
                        ))}
                    </Box>
                  ))}
              </Select>
            </Box>
          </HStack>
        </Field.Root>
        <Button onClick={handleSubmit}>{t('room_list.create_new_rooms')}</Button>
      </VStack>
    </Container>
  );
};

export default CreateRoom;