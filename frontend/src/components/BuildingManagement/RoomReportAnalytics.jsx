import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import axios from 'axios';
import { Container, Box, Heading, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import useOrganization_Membership from '../Organization/Organization_Membership_Hook';
import useBuilding from './BuildingHook';
// import useRoom from '../RoomOwner/RoomHook';
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
  const { buildings } = useBuilding()
  // const { rooms } = useRoom()
  // Fetch analytics data for all rooms
  const fetchAnalytics = async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    const url = import.meta.env.VITE_ROOM_REPORT_ANALYTICS_URL;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const reportChart = res.data
      // console.log("roomdata:", res.data)
      if (reportChart.length > 0) {
        setRoomAnalytics(reportChart);
      } else {
        console.warn("Unexpected response format:", res.data);
        setRoomAnalytics([]);
      }
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
  }, [accessToken, userInfo?.id]);

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

  return (
    <Container maxW="container.xl" my={4}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">Average Rating of Room's Conditions</Heading>
        {loading ? (
          <Text textAlign="center">Loading...</Text>
        ) : error ? (
          <Text color="red.500" textAlign="center">{error}</Text>
        ) : roomAnalytics.length > 0 ? (
          <Wrap spacing={6} justify="center" p={2}>
            {members.length > 0 && 
              members
                .filter(mem => mem.user === userInfo?.id)
                .flatMap(mem => {
                  // Find the building for this member's organization
                  const memberBuilding = buildings.find(building => building.organization === mem.organization);
                  
                  // Only proceed if building exists
                  if (!memberBuilding) return [];
                  
                  // Filter room analytics for this specific building
                  const buildingRooms = roomAnalytics.filter(room => 
                    room.building === memberBuilding.id || 
                    room.building_name === memberBuilding.name
                  );
                  
                  return buildingRooms.map(room => (
                    <Box 
                      key={`member-${mem.id}-room-${room.id || room.room_name}`} // Unique key for each combination
                      w={{ base: "100%", md: "400px" }}
                      h="420px"
                      border="1px solid"
                      borderColor="gray.200"
                      p={4}
                      borderRadius="md"
                      boxShadow="md"
                      bg="white"
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
                  ));
                })
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