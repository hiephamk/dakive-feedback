import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import axios from 'axios';
import { Container, Box, Heading, Text, Flex, HStack, Wrap, WrapItem, VStack } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
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

const Report = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [roomAnalytics, setRoomAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setRoomAnalytics(res.data);
    } catch (error) {
      console.error('Fetch analytics error:', error.message);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && userInfo?.id) {
      fetchAnalytics();
    }
  }, [accessToken, userInfo?.id]);

  // Chart options (shared across all charts)
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Rating (1-5)',
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

  // Chart labels (shared across all charts)
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
          room.temperature || 0,
          room.air_quality || 0,
          room.draft || 0,
          room.odor || 0,
          room.lighting || 0,
          room.structural || 0,
          room.cleanliness || 0,
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
    <Container m={4} mx="auto" my={4}>
        <HStack gap={4} maxW="400px">
              {loading ? (
                <Text>Loading...</Text>
              ) : error ? (
                <Text color="red.500">{error}</Text>
              ) : roomAnalytics.length > 0 ? (
                roomAnalytics.map((room) => (
                <Box key={room.id} minW="100%" border="1px solid" p={4}>
                  <Heading size="md" mb={4}>
                    Feedback for {room.room_name} in {room.building_name}
                  </Heading>
                  <Text mb={4}>
                    Latest Report Date: {new Date(room.created_at).toLocaleDateString()}
                  </Text>
                  <Bar data={getChartData(room)} options={chartOptions} />
                </Box>
                ))
              ) : (
                <Text>No data available for any rooms</Text>
              )}
        </HStack>
    </Container>
  );
};

export default Report;