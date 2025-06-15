import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Table, VStack, Flex, Button, Spinner, Text, HStack, Collapsible, Center } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import SyncSensorReports from './SyncSensorReports';

const SensorDataRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const { id } = useParams();

  const [loading, setLoading] = useState(false)

  const API_KEY = 'II6dsQDctGjWeoHgnT5wPjXlyJVmmUbvASnh2Zay';

  const listRooms = async () => {
    const url = `https://iot.research.hamk.fi/api/v1/hamk/rooms?building-id=${id}`;
    try {
      const res = await axios.get(url, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      setRooms(res.data);
    } catch (error) {
      console.error('Error fetching rooms:', error.response?.status || error.message);
    }
  };

  const fetchRoomData = async (roomId) => {
    setSelectedRoomId(roomId); 
    setRoomData([]); 
    setLoading(true);
    const url = `https://iot.research.hamk.fi/api/v1/hamk/rooms/tsdata?room-id=${roomId}&startTime=2025-06-02T00%3A00%3A00Z&endTime=2025-06-02T01%3A00%3A00Z&fields=temperature%2Chumidity%2Cco2%2Clight%2Cmotion`;
    try {
      const res = await axios.get(url, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      const values = res.data?.results?.[0]?.series?.[0]?.values || [];
      setRoomData(values);
    } catch (error) {
      console.error('Error fetching room data:', error.response?.status || error.message);
    }finally {
        setLoading(false)
    }
  };

  useEffect(() => {
    listRooms();
  }, [id]);

  
  return (
    <Box>
      <Box>
        <SyncSensorReports onSyncSuccess={fetchRoomData}/>
      </Box>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Box key={room['room-id']} borderWidth="1px" p={4} rounded="md" direction="column">
              <HStack justifyContent="space-between" mb={2}>
                <Collapsible.Root w={"100%"}>
                  <Collapsible.Trigger paddingY="3" onClick={() => fetchRoomData(room['room-id'])} isLoading={loading && selectedRoomId === room['room-id']} >
                          Room {room.room} - Building {room.building}
                  </Collapsible.Trigger>
                  <Collapsible.Content w={"100vw"}>
                    <Box padding="4" borderWidth="1px">
                      {selectedRoomId === room['room-id'] && (
                          <>
                          {loading ? (
                              <Flex align="center" justify="center" py={4}>
                              <Spinner size="lg" mr={2} />
                              <Text>Loading sensor data...</Text>
                              </Flex>
                          ) : roomData.length > 0 ? (
                              <Table.Root variant="simple" mt={4} size="sm">
                              <Table.Header>
                                  <Table.Row>
                                  <Table.ColumnHeader textAlign="center">Time</Table.ColumnHeader>
                                  <Table.ColumnHeader textAlign="center">Temperature</Table.ColumnHeader>
                                  <Table.ColumnHeader textAlign="center">Humidity</Table.ColumnHeader>
                                  <Table.ColumnHeader textAlign="center">CO2</Table.ColumnHeader>
                                  <Table.ColumnHeader textAlign="center">Light</Table.ColumnHeader>
                                  <Table.ColumnHeader textAlign="center">Motion</Table.ColumnHeader>
                                  </Table.Row>
                              </Table.Header>
                              <Table.Body>
                                  {roomData.map((entry, idx) => (
                                  <Table.Row key={idx}>
                                      {entry.map((val, i) => (
                                      <Table.Cell key={i} textAlign="center">{val}</Table.Cell>
                                      ))}
                                  </Table.Row>
                                  ))}
                              </Table.Body>
                              </Table.Root>
                          ) : (
                              <Text mt={2}>No sensor data available for this room.</Text>
                          )}
                          </>
                      )}
                    </Box>
                  </Collapsible.Content>
                </Collapsible.Root>
              </HStack>
            </Box>
          ))
        ) : (
          <Box>No rooms found for this building.</Box>
        )}
      <HStack spacing={4} align="stretch">
      </HStack>
    </Box>
  );
};

export default SensorDataRooms;