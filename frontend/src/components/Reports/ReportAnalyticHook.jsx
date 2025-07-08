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
import formatDate from '../formatDate';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportAnalyticHook = ({selectedId}) => {
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
  const org_members = members.filter(item => item.user === userInfo.id && item.organization === selectedId)

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
      reportChart = reportChart.filter(item => item.organization_id === selectedId)
      console.log("reportChart:", reportChart)
      reportChart = reportChart.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRoomAnalytics(reportChart[0]);
    
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

  useEffect(()=>{
  console.log("roomAnalytic:", roomAnalytics)
}, [roomAnalytics])

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

  const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
      const mediaQuery = window.matchMedia("(min-width: 450px)");
      setIsDesktop(mediaQuery.matches);
      const handleResize = (e) => setIsDesktop(e.matches);
      mediaQuery.addEventListener("change", handleResize);
      return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);


  return (
    <Box>
        {loading ? (
          <Text textAlign="center">Loading...</Text>
        ) : (
            <Wrap spacing={6} justify="center" p={2}>
                <Box 
                    h="420px"
                    p={4}
                    borderRadius="md"
                    boxShadow="md"
                    shadow="3px 3px 15px 5px rgb(75, 75, 79)"
                >
                    <Heading size="md" mb={2} color="gray.700">
                        {roomAnalytics.room_name} - {roomAnalytics.building_name} - {roomAnalytics.organization_name}
                    </Heading>
                    <Text mb={2} fontSize="sm" color="gray.600">
                        {/* Updated: {new Date(roomAnalytics.created_at).toLocaleDateString()} */}
                        Updated: {formatDate(roomAnalytics.created_at)}
                    </Text>
                    
                    <Box h="300px">
                        <Bar 
                        data={getChartData(roomAnalytics)} 
                        options={{
                            ...chartOptions,
                            maintainAspectRatio: false,
                            responsive: true
                        }} 
                        />
                    </Box>
                </Box>
            </Wrap>
            )
        }
    </Box>
  );
};

export default ReportAnalyticHook;
