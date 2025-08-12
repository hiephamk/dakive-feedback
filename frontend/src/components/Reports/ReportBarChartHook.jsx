
// import {useState, useEffect} from 'react'
// import { useSelector } from 'react-redux'
// import useAccessToken from '../../services/token'
// import api from '../../services/api'
// import useBuilding from '../BuildingManagement/BuildingHook'
// import { Chart, useChart } from "@chakra-ui/charts"
// import { Box, HStack, Text, VStack, Spinner, Heading } from "@chakra-ui/react"
// import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts"
// import { useTranslation } from 'react-i18next';

// const ReportBarChartHook = ({orgId}) => {
//   const { user, userInfo } = useSelector((state) => state.auth);
//   const accessToken = useAccessToken(user);
//   const {buildings} = useBuilding()
//   const [loading, setLoading]=useState(false)
//   const [builidingAVG, setBuildingAVG] = useState([])
//   const [chartData, setChartData] = useState([])
//     const { t } = useTranslation();

//   const fetchAnalytics = async () => {
//     if (!accessToken) return;
//     setLoading(true);
//     const url = `${import.meta.env.VITE_ORGANIZATION_BUILDING_AVG_RATING_URL}${orgId}/`
//     // console.log("url:", url)
//     try {
//       const res = await api.get(url, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           // 'Content-Type': 'application/json',
//         },
//     });
//     const sortedData = res.data
//     console.log("barchart res.data:", res.data)
//     setBuildingAVG(sortedData);
    
//     // Process data for single chart with multiple buildings
//     processBuildingsData(sortedData);
    
//     } catch (error) {
//       if(error.response && error.response.status === 401) {
//           alert("Please login again.");
//       }else {
//           console.error(error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const processBuildingsData = (data) => {
//     if (!data || !data.buildings) return;
    
//     // Create chart data where each building is a separate bar
//     const processedBuildings = data.buildings
//       .filter(building => building.building_summary && building.room_average_rating)
//       .sort((a,b) => a.room_average_rating - b.room_average_rating)
//       .slice(0, 5)
//        // Only include buildings with summary data
//       .map(building => ({
//         name: building.name, // Building name will be on X-axis
//         organization_name:building.organization_name,
//         Air_Quality: building.building_summary.avg_air_quality || 0,
//         Light: building.building_summary.avg_lighting || 0,
//         Temperature: building.building_summary.avg_temperature || 0,
//         Draft: building.building_summary.avg_draft || 0,
//         Odor: building.building_summary.avg_odor || 0,
//         Cleanliness: building.building_summary.avg_cleanliness || 0,
//         Structural_Change: building.building_summary.avg_structural_change || 0,
//       }));
    
//     setChartData(processedBuildings);
//   };

//   // Custom tooltip to show individual values
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <Box bg="white" p={3} border="1px" borderColor="gray.200" borderRadius="md" shadow="md">
//           <Text fontWeight="bold" mb={2}>{`Building: ${label}`}</Text>
//           {payload.map((entry, index) => (
//             <Text key={index} color={entry.color} fontSize="sm">
//               {`${entry.name}: ${entry.value.toFixed(2)}`}
//             </Text>
//           ))}
//         </Box>
//       );
//     }
//     return null;
//   };

//   useEffect(()=>{
//     fetchAnalytics()
//   },[accessToken, orgId])

//   useEffect(()=>{
//     console.log("ChartData:", chartData)
//   },[builidingAVG])

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" h="400px">
//         <Spinner size="xl" />
//       </Box>
//     );
//   }
// const organizationName = chartData[0]?.organization_name || "Organization";
//   return (
//     <Box w={"400px"}>
//       <VStack>
//         {chartData.length > 0 && (
//           <VStack h="500px" maxW="100%" border={"1px solid"} rounded={"7px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
//             <Chart.Root height="100%">
//               <BarChart
//                 data={chartData}
//                 margin={{
//                   top: 10,
//                   right: 10,
//                   left: 10,
//                   bottom: 10,
//                 }}
//                 >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="name"
//                   angle={-45}
//                   textAnchor="end"
//                   height={80}
//                   interval={0}
//                 />
//                 <YAxis
//                   label={{ value: 'Average Rating of Building', angle: -90}}
//                   domain={[0, 'dataMax + 1']}
//                   // yAxisId="left" orientation="left"
//                   wrapperStyle={{ padding: '10px', marginRight:'20px' }}
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend
//                   verticalAlign="top"
//                   wrapperStyle={{ padding: '10px', marginBottom:'20px' }}
//                   iconType="circle"
//                 />
      
//                 {/* Stacked bars for each metric with labels */}
//                 <Bar
//                   dataKey="Temperature"
//                   stackId="a"
//                   fill="#a04000"
//                   name="Temperature"
//                 >
//                   <LabelList
//                     dataKey="Temperature"
//                     position="center"
//                     fill="white"
//                     fontSize={10}
//                     fontWeight="bold"
//                     formatter={(value) => value > 0 ? value.toFixed(1) : ''}
//                   />
//                 </Bar>
//                 <Bar
//                   dataKey="Air_Quality"
//                   stackId="a"
//                   fill="#d68910"
//                   name="Air Quality"
//                 >
//                   <LabelList
//                     dataKey="Air_Quality"
//                     position="center"
//                     fill="white"
//                     fontSize={10}
//                     fontWeight="bold"
//                     formatter={(value) => value > 0 ? value.toFixed(1) : ''}
//                   />
//                 </Bar>
//                 <Bar
//                   dataKey="Light"
//                   stackId="a"
//                   fill="#229954"
//                   name="Light"
//                 >
//                   <LabelList
//                     dataKey="Light"
//                     position="center"
//                     fill="white"
//                     fontSize={10}
//                     fontWeight="bold"
//                     formatter={(value) => value > 0 ? value.toFixed(1) : ''}
//                   />
//                 </Bar>
//                 <Bar
//                   dataKey="Draft"
//                   stackId="a"
//                   fill="#f1c40f"
//                   name="Draft"
//                 >
//                   <LabelList
//                     dataKey="Draft"
//                     position="center"
//                     fill="black"
//                     fontSize={10}
//                     fontWeight="bold"
//                     formatter={(value) => value > 0 ? value.toFixed(1) : ''}
//                   />
//                 </Bar>
//                 <Bar
//                   dataKey="Odor"
//                   stackId="a"
//                   fill="#000080"
//                   name="Odor"
//                 >
//                   <LabelList
//                     dataKey="Odor"
//                     position="center"
//                     fill="white"
//                     fontSize={10}
//                     fontWeight="bold"
//                     formatter={(value) => value > 0 ? value.toFixed(1) : ''}
//                   />
//                 </Bar>
//                 <Bar
//                   dataKey="Cleanliness"
//                   stackId="a"
//                   fill="#2980b9"
//                   name="Cleanliness"
//                 >
//                   <LabelList
//                     dataKey="Cleanliness"
//                     position="center"
//                     fill="white"
//                     fontSize={10}
//                     fontWeight="bold"
//                     formatter={(value) => value > 0 ? value.toFixed(1) : ''}
//                   />
//                 </Bar>
//                 <Bar
//                   dataKey="Structural_Change"
//                   stackId="a"
//                   fill="#8e44ad"
//                   name="Structural Change"
//                 >
//                   <LabelList
//                     dataKey="Structural_Change"
//                     position="center"
//                     fill="white"
//                     fontSize={10}
//                     fontWeight="bold"
//                     formatter={(value) => value > 0 ? value.toFixed(1) : ''}
//                   />
//                 </Bar>
//               </BarChart>
//             </Chart.Root>
//             <Text fontStyle={"italic"}>Organization {organizationName} </Text>
//           </VStack>
//         )}
//       </VStack>
//     </Box>
//   )
// }

// export default ReportBarChartHook;

import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import api from '../../services/api'
import useBuilding from '../BuildingManagement/BuildingHook'
import { Chart, useChart } from "@chakra-ui/charts"
import { Box, HStack, Text, VStack, Spinner, Heading } from "@chakra-ui/react"
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts"
import { useTranslation } from 'react-i18next';

const ReportBarChartHook = ({orgId}) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const {buildings} = useBuilding()
  const [loading, setLoading]=useState(false)
  const [builidingAVG, setBuildingAVG] = useState([])
  const [chartData, setChartData] = useState([])
  const { t } = useTranslation();

  const fetchAnalytics = async () => {
    if (!accessToken) return;
    setLoading(true);
    const url = `${import.meta.env.VITE_ORGANIZATION_BUILDING_AVG_RATING_URL}${orgId}/`
    try {
      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
    });
    const sortedData = res.data
    console.log("barchart res.data:", res.data)
    setBuildingAVG(sortedData);
    
    // Process data for single chart with multiple buildings
    processBuildingsData(sortedData);
    
    } catch (error) {
      if(error.response && error.response.status === 401) {
          alert(t('error.please_login_again'));
      }else {
          console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const processBuildingsData = (data) => {
    if (!data || !data.buildings) return;
    
    // Create chart data where each building is a separate bar
    const processedBuildings = data.buildings
      .filter(building => building.building_summary && building.room_average_rating)
      .sort((a,b) => a.room_average_rating - b.room_average_rating)
      .slice(0, 5)
      .map(building => ({
        name: building.name,
        organization_name: building.organization_name,
        Air_Quality: building.building_summary.avg_air_quality || 0,
        Light: building.building_summary.avg_lighting || 0,
        Temperature: building.building_summary.avg_temperature || 0,
        Draft: building.building_summary.avg_draft || 0,
        Odor: building.building_summary.avg_odor || 0,
        Cleanliness: building.building_summary.avg_cleanliness || 0,
        Structural_Change: building.building_summary.avg_structural_change || 0,
      }));
    
    setChartData(processedBuildings);
  };

  // Custom tooltip to show individual values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="white" p={3} border="1px" borderColor="gray.200" borderRadius="md" shadow="md">
          <Text fontWeight="bold" mb={2}>{t('chart.building')}: {label}</Text>
          {payload.map((entry, index) => (
            <Text key={index} color={entry.color} fontSize="sm">
              {`${t(`chart.${entry.name.toLowerCase()}`)}: ${entry.value.toFixed(2)}`}
            </Text>
          ))}
        </Box>
      );
    }
    return null;
  };

  useEffect(()=>{
    fetchAnalytics()
  },[accessToken, orgId])

  useEffect(()=>{
    console.log("ChartData:", chartData)
  },[builidingAVG])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="400px">
        <Spinner size="xl" />
      </Box>
    );
  }
  const organizationName = chartData[0]?.organization_name || t('chart.organization');
  return (
    <Box w={"400px"}>
      <VStack>
        {chartData.length > 0 && (
          <VStack h="500px" maxW="100%" border={"1px solid"} rounded={"7px"} shadow="3px 3px 15px 5px rgb(75, 75, 79)">
            <Chart.Root height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 10,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis
                  label={{ value: t('chart.average_rating'), angle: -90}}
                  domain={[0, 'dataMax + 1']}
                  wrapperStyle={{ padding: '10px', marginRight:'20px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  wrapperStyle={{ padding: '10px', marginBottom:'20px' }}
                  iconType="circle"
                />
      
                <Bar
                  dataKey="Temperature"
                  stackId="a"
                  fill="#a04000"
                  name={t('chart.temperature')}
                >
                  <LabelList
                    dataKey="Temperature"
                    position="center"
                    fill=" black"
                    fontSize={10}
                    fontWeight="bold"
                    formatter={(value) => value > 0 ? value.toFixed(1) : ''}
                  />
                </Bar>
                <Bar
                  dataKey="Air_Quality"
                  stackId="a"
                  fill="#d68910"
                  name={t('chart.air_quality')}
                >
                  <LabelList
                    dataKey="Air_Quality"
                    position="center"
                    fill="black"
                    fontSize={10}
                    fontWeight="bold"
                    formatter={(value) => value > 0 ? value.toFixed(1) : ''}
                  />
                </Bar>
                <Bar
                  dataKey="Light"
                  stackId="a"
                  fill="#229954"
                  name={t('chart.light')}
                >
                  <LabelList
                    dataKey="Light"
                    position="center"
                    fill="black"
                    fontSize={10}
                    fontWeight="bold"
                    formatter={(value) => value > 0 ? value.toFixed(1) : ''}
                  />
                </Bar>
                <Bar
                  dataKey="Draft"
                  stackId="a"
                  fill="#f1c40f"
                  name={t('chart.draft')}
                >
                  <LabelList
                    dataKey="Draft"
                    position="center"
                    fill="black"
                    fontSize={10}
                    fontWeight="bold"
                    formatter={(value) => value > 0 ? value.toFixed(1) : ''}
                  />
                </Bar>
                <Bar
                  dataKey="Odor"
                  stackId="a"
                  fill="#000080"
                  name={t('chart.odor')}
                >
                  <LabelList
                    dataKey="Odor"
                    position="center"
                    fill="black"
                    fontSize={10}
                    fontWeight="bold"
                    formatter={(value) => value > 0 ? value.toFixed(1) : ''}
                  />
                </Bar>
                <Bar
                  dataKey="Cleanliness"
                  stackId="a"
                  fill="#2980b9"
                  name={t('chart.cleanliness')}
                >
                  <LabelList
                    dataKey="Cleanliness"
                    position="center"
                    fill="black"
                    fontSize={10}
                    fontWeight="bold"
                    formatter={(value) => value > 0 ? value.toFixed(1) : ''}
                  />
                </Bar>
                <Bar
                  dataKey="Structural_Change"
                  stackId="a"
                  fill="#8e44ad"
                  name={t('chart.structural_change')}
                >
                  <LabelList
                    dataKey="Structural_Change"
                    position="center"
                    fill="black"
                    fontSize={10}
                    fontWeight="bold"
                    formatter={(value) => value > 0 ? value.toFixed(1) : ''}
                  />
                </Bar>
              </BarChart>
            </Chart.Root>
            <Text fontStyle={"italic"}>{t('chart.organization')} {organizationName}</Text>
          </VStack>
        )}
      </VStack>
      </Box>
  )
}

export default ReportBarChartHook;