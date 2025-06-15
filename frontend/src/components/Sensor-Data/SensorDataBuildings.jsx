import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Table, VStack, Flex, Image, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const SensorDataBuildings = () => {
  const [buildings, setBuildings] = useState([]);
  const navigate = useNavigate();

  const listSensorDataBuilding = async () => {
    const url = 'https://iot.research.hamk.fi/api/v1/hamk/buildings';
    try {
      const res = await axios.get(url, {
        headers: {
          // 'User-Agent': 'insomnia/10.3.0', // ❌ Not allowed in browser
          'x-api-key': 'II6dsQDctGjWeoHgnT5wPjXlyJVmmUbvASnh2Zay',
        },
      });
      setBuildings(res.data);
    } catch (error) {
      console.error(error.response?.status || error.message);
    }
  };

  useEffect(() => {
    listSensorDataBuilding();
    console.log("building-data:", buildings)
  }, [buildings]);

  const handleViewRooms = (id) => {
    navigate(`/home/management/sensor-data/room-list/${id}`);
  };

  return (
    <Box>
      <Flex p={4} wrap="wrap" justifyContent="space-evenly" alignItems="center">
        {buildings.length > 0 ? (
          buildings.map((building) => {
            const buildingId = building['building-id'];

            return (
              <Box key={buildingId}>
                <Box
                  shadow="1px 1px 15px 5px rgb(75, 75, 79)"
                  rounded={8}
                  w="300px"
                  h="470px"
                  my="10px"
                >
                  <VStack>
                    <Flex justifyContent="space-between" p="10px" w="100%">
                      <Image
                        p="2px"
                        bg="white"
                        w="85%"
                        rounded="5px"
                        height="150px"
                        src={building.building_img || '/building.png'}
                      />
                    </Flex>

                    <Box pl={2} h="220px" overflow="auto" mt="10px" maxW="300px">
                      <Table.Root showColumnBorder>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell fontWeight="bold" fontSize="18px">
                              Building ID
                            </Table.Cell>
                            <Table.Cell
                              fontWeight="bold"
                              fontSize="18px"
                              whiteSpace="normal"
                              maxW="160px"
                            >
                              {buildingId}
                            </Table.Cell>
                          </Table.Row>
                     
                          <Table.Row>
                            <Table.Cell>Street</Table.Cell>
                            <Table.Cell whiteSpace="normal" maxW="160px">
                              {building['street-address']}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>City</Table.Cell>
                            <Table.Cell whiteSpace="normal" maxW="160px">
                              {building.city || 'N/A'}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Post-Code</Table.Cell>
                            <Table.Cell whiteSpace="normal" maxW="160px">
                              {building['postal-code']}
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table.Root>
                    </Box>

                    <Box>
                      <Button onClick={() => handleViewRooms(building['building-id'])}>View Rooms</Button>

                    </Box>
                  </VStack>
                </Box>
              </Box>
            );
          })
        ) : (
          <Box>You have no building.</Box>
        )}
      </Flex>
    </Box>
  );
};

export default SensorDataBuildings;
