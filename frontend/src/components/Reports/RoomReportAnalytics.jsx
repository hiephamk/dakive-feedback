import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import api from '../../services/api';
import { Container, Box, Heading, Text, VStack,HStack, Wrap, Button, Center } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import useOrganization_Membership from '../Organization/Organization_Membership_Hook';
import useBuilding from '../BuildingManagement/BuildingHook';
import useOrganization from '../Organization/OrganizationHook';
import useRoom from '../RoomOwner/RoomHook';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RoomReportAnalytics = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [roomAnalytics, setRoomAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { members } = useOrganization_Membership()
  const { organizations } = useOrganization()

  const [buildingId, setBuildingId] = useState('')
  const [roomId, setRoomId] = useState('')
  const [orgId, setOrgId] = useState('')
  
  const { buildings } = useBuilding();
  const { rooms } = useRoom(buildingId)

  const fetchAnalytics = async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    const url = import.meta.env.VITE_ROOM_REPORT_ANALYTICS_URL;
    try {
      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      let reportChart = res.data

      if(orgId){
        reportChart = reportChart.filter(r => r.organization_id === Number(orgId))
      }
      if(buildingId){
        reportChart = reportChart.filter(r => r.building_id === Number(buildingId))
      }
      if(roomId){
        reportChart = reportChart.filter(r => r.room_id === Number(roomId))
      }
      setRoomAnalytics(reportChart);
    } catch (error) {
      if(error.response && error.response.status === 401) {
          alert("Please login again.");
      }else {
          console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchAnalytics();
    }
  }, [accessToken, userInfo?.id, buildingId, roomId, orgId]);

  // Chart options
  const chartOptions = {
    responsive: true, // Ensure chart resizes with container
    maintainAspectRatio: false, // Allow custom height
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Average Rating (1-5)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Categories',
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Rating: ${context.raw}`,
        },
      },
    },
  };

  // Chart labels
  const chartLabels = [
    'Temperature',
    'Air Quality',
    'Draft',
    'Odor',
    'Lighting',
    'Structural',
    'Cleanliness',
  ];

  // Function to create chart data for a room
  const getChartData = (room) => ({
    labels: chartLabels,
    datasets: [
      {
        label: 'Rating',
        data: [
          room.avg_temperature || 0,
          room.avg_air_quality || 0,
          room.avg_draft || 0,
          room.avg_odor || 0,
          room.avg_lighting || 0,
          room.avg_structural || 0,
          room.avg_cleanliness || 0,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });
  const handleOrgChange = (e) => {
    const selectedOrgId = e.target.value;
    setOrgId(selectedOrgId);
    setBuildingId('');
  };
  const handleBuildingChange = (e) => {
    const selectedBuildingId = e.target.value;
    setBuildingId(selectedBuildingId);
    setRoomId('');
  };

  const handleRoomChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleClearItem = () => {
    setBuildingId("");
    setRoomId("");
    setOrgId("");
  };

  const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
      const mediaQuery = window.matchMedia("(min-width: 450px)");
      setIsDesktop(mediaQuery.matches);
      const handleResize = (e) => setIsDesktop(e.matches);
      mediaQuery.addEventListener("change", handleResize);
      return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

  return (
    <Container maxW="container.xl" my={4}>
      <VStack spacing={6} align="stretch">
        <Center>
          {isDesktop?(<HStack my={10} maxW={"100%"} justifyContent={"space-evenly"}>
            <Box border="1px solid" p={4} fontSize="18px" rounded={7}>
              <label htmlFor="org"></label>
              <select
                value={orgId}
                onChange={handleOrgChange}
                id="org"
              >
                <option value="">All Organizations</option>
                {members.length > 0 && 
                  members
                    .filter(mem => mem.user === userInfo.id)
                    .flatMap(mem => 
                      organizations
                        .filter(org => org.id === mem.organization)
                        .flatMap(org => 
                          roomAnalytics.length > 0 
                            ? [...new Set(roomAnalytics
                                .filter(report => report.organization_id === org.id)
                                .map(report => ({
                                  id: report.organization_id,
                                  name: report.organization_name
                                }))
                              )]
                            : []
                        )
                    )
                    .filter((org, index, self) => 
                      index === self.findIndex(b => b.id === org.id)
                    )
                    .map(org => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))
                }
              </select>
            </Box>
            <Box border="1px solid" p={4} fontSize="16px" rounded={7}>
              <label htmlFor="building"></label>
              <select
                value={buildingId}
                onChange={handleBuildingChange}
                id="building"
              >
                <option value="">All Buildings</option>
                {members.length > 0 && 
                  members
                    .filter(mem => mem.user === userInfo.id)
                    .flatMap(mem => 
                      buildings
                        .filter(building => building.organization === mem.organization)
                        .flatMap(building => 
                            roomAnalytics.length > 0 
                              ? [...new Set(roomAnalytics
                                  .filter(report => report.building_id === building.id)
                                  .map(report => ({  
                                      id: report.building_id,
                                      name: report.building_name
                                    }))
                                  )]
                                  : []
                            )
                          )
                            .filter((building, index, self) => 
                              index === self.findIndex(b => b.id === building.id)
                          )
                          .map(building => (
                            <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))
                  }

              </select>
            </Box>
            <Box border="1px solid" p={4} rounded={7} fontSize="16px">
              <label id="room"></label>
              <select
                value={roomId}
                onChange={handleRoomChange}
                disabled={!buildingId}
                id="room"
              >
                <option value="">All Rooms</option>
                {buildingId && rooms.length > 0 && rooms
                .flatMap(room => roomAnalytics.length > 0 ? 
                  [...new Set(roomAnalytics
                    .filter(item => item.room_id === room.id && item.building_id == room.building)
                    .map(item => ({
                      id: item.room_id,
                      name: item.room_name
                    })))]:[])
                    .filter((room, index, self) => index === self.findIndex(r => r.id === room.id))
                  .map((room)=>(
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
              </select>
            </Box>
            <Box>
              <Button onClick={handleClearItem}>Clear</Button>
            </Box>
          </HStack>
          ):(
            <VStack my={10} maxW={"100%"} justifyContent={"space-evenly"}>
            <Box border="1px solid" p={4} fontSize="18px" rounded={7}>
              <label htmlFor="org"></label>
              <select
                value={orgId}
                onChange={handleOrgChange}
                id="org"
              >
                <option value="">All Organizations</option>
                {members.length > 0 && 
                  members
                    .filter(mem => mem.user === userInfo.id)
                    .flatMap(mem => 
                      organizations
                        .filter(org => org.id === mem.organization)
                        .flatMap(org => 
                          roomAnalytics.length > 0 
                            ? [...new Set(roomAnalytics
                                .filter(report => report.organization_id === org.id)
                                .map(report => ({
                                  id: report.organization_id,
                                  name: report.organization_name
                                }))
                              )]
                            : []
                        )
                    )
                    .filter((org, index, self) => 
                      index === self.findIndex(b => b.id === org.id)
                    )
                    .map(org => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))
                }
              </select>
            </Box>
            <Box border="1px solid" p={4} fontSize="16px" rounded={7}>
              <label htmlFor="building"></label>
              <select
                value={buildingId}
                onChange={handleBuildingChange}
                id="building"
              >
                <option value="">All Buildings</option>
                {members.length > 0 && 
                  members
                    .filter(mem => mem.user === userInfo.id)
                    .flatMap(mem => 
                      buildings
                        .filter(building => building.organization === mem.organization)
                        .flatMap(building => 
                            roomAnalytics.length > 0 
                              ? [...new Set(roomAnalytics
                                  .filter(report => report.building_id === building.id)
                                  .map(report => ({  
                                      id: report.building_id,
                                      name: report.building_name
                                    }))
                                  )]
                                  : []
                            )
                          )
                            .filter((building, index, self) => 
                              index === self.findIndex(b => b.id === building.id)
                          )
                          .map(building => (
                            <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))
                  }

              </select>
            </Box>
            <Box border="1px solid" p={4} rounded={7} fontSize="16px">
              <label id="room"></label>
              <select
                value={roomId}
                onChange={handleRoomChange}
                disabled={!buildingId}
                id="room"
              >
                <option value="">All Rooms</option>
                {buildingId && rooms.length > 0 && rooms
                .flatMap(room => roomAnalytics.length > 0 ? 
                  [...new Set(roomAnalytics
                    .filter(item => item.room_id === room.id && item.building_id == room.building)
                    .map(item => ({
                      id: item.room_id,
                      name: item.room_name
                    })))]:[])
                    .filter((room, index, self) => index === self.findIndex(r => r.id === room.id))
                  .map((room)=>(
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
              </select>
            </Box>
            <Box>
              <Button onClick={handleClearItem}>Clear</Button>
            </Box>
          </VStack>)}
        </Center>
        <Heading size="lg" textAlign="center">Average Rating of Room's Conditions</Heading>

        {loading ? (
          <Text textAlign="center">Loading...</Text>
        ) : error ? (
          <Text color="red.500" textAlign="center">{error}</Text>
        ) : roomAnalytics.length > 0 ? (
          <Wrap spacing={6} justify="center" p={2}>
            {members
                .filter(mem => mem.user === userInfo?.id || mem.owner === userInfo?.id)
                .map(mem => organizations
                    .filter(item => item.id === mem.organization)
                    .map(item => roomAnalytics
                      .filter(room => room.organization_id === item.id)
                      .map(room => (
                    <Box 
                      // key={`member-${mem.id}-room-${room.id || room.room_name}`} // Unique key for each combination
                      key={room.id}
                      // w={{ base: "100%", md: "400px" }}
                      h="420px"
                      // border="1px solid"
                      // borderColor="gray.200"
                      p={4}
                      borderRadius="md"
                      boxShadow="md"
                      // bg="white"
                      shadow="3px 3px 15px 5px rgb(75, 75, 79)"
                    >
                      <Heading size="md" mb={2} color="gray.700">
                        {room.room_name} - {room.building_name}
                      </Heading>
                      <Text mb={2} fontSize="sm" color="gray.600">
                        Updated: {new Date(room.created_at).toLocaleDateString()}
                      </Text>
                      
                      <Box h="300px">
                        <Bar 
                          data={getChartData(room)} 
                          options={{
                            ...chartOptions,
                            maintainAspectRatio: false,
                            responsive: true
                          }} 
                        />
                      </Box>
                    </Box>
                    
                  ))))
            }
          </Wrap>
        ) : (
          <Text textAlign="center">No data available for any rooms</Text>
        )}
      </VStack>
    </Container>
  );
};

export default RoomReportAnalytics;
