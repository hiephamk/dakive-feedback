// import { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import useAccessToken from '../../services/token';
// import api from '../../services/api';
// import { Box, Container, VStack, HStack, Table, Text, Flex, Button, Center, Switch, Spinner } from '@chakra-ui/react';
// import { FaFrown, FaMeh, FaSmile, FaGrin, FaGrinStars } from 'react-icons/fa';
// import useRoom from '../RoomOwner/RoomHook';
// import useBuilding from '../BuildingManagement/BuildingHook';
// import * as XLSX from "xlsx";
// import formatDate from '../formatDate'
// import SyncSensorRoomData from '../Sensor-Data/SyncSensorRoomData';
// import useOrganization from '../Organization/OrganizationHook';
// import SensorReportsList from '../Sensor-Data/SensorReportsList';

// const Report = () => {
//   const { user, userInfo } = useSelector((state) => state.auth);
//   const accessToken = useAccessToken(user);
//   const [reports, setReports] = useState([]);

//   const [roomId, setRoomId] = useState('');
//   const [orgId, setOrgId] = useState('');
//   const [buildingId, setBuildingId] = useState('');
//   const [time, setTime] = useState('');

//   const [iShow, setIShow] = useState(false);
//   const { buildings } = useBuilding();
//   const { rooms } = useRoom(buildingId);
//   const { organizations } = useOrganization();

//   const [sensorData, setSensorData] = useState([]);
//   const [members, setMembers] = useState([]);
//   const frozenSensorData = useRef([]);

//   const [loading, setLoading] = useState(false);

//   const fetchMembers = async () => {
//     if (!accessToken || !userInfo?.id) return;
    
//     const url = import.meta.env.VITE_ORGANIZATION_MEMBERSHIP_LIST_URL;
//     const config = {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//     };
//     try {
//       const response = await api.get(url, config);
//       const sortedItem = response.data;
//       setMembers(Array.isArray(sortedItem) ? sortedItem : sortedItem.items || []);
//     } catch (err) {
//       console.error('Error fetching members:', err);
//     } 
//   };

//   useEffect(() => {
//     if (accessToken && userInfo?.id) {
//       fetchMembers();
//     }
//   }, [accessToken, userInfo?.id]);

//   const fetchRoomReport = async () => {
//     if (!accessToken) return;
//     const url = import.meta.env.VITE_ROOM_REPORT_LIST_URL;
//     try {
//       const res = await api.get(url, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       let filteredReports = res.data;
      
//       if (orgId) {
//         filteredReports = filteredReports.filter((item) => item.organization === Number(orgId));
//       }
//       if (buildingId) {
//         filteredReports = filteredReports.filter((item) => item.building === Number(buildingId));
//       }
//       if (roomId) {
//         filteredReports = filteredReports.filter((item) => item.room === Number(roomId));
//       }
//       if (time) {
//         filteredReports = filteredReports.filter(t => t.created_at === time);
//       }
      
//       // Sort by created_at in descending order (newest first)
//       filteredReports = filteredReports.sort((a, b) => 
//         new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//       );
      
//       console.log("filter report:", filteredReports);
//       setReports(filteredReports);
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         alert("Please login again.");
//       } else {
//         console.error(error);
//       }
//     }
//   };

//   useEffect(() => {
//     if (accessToken && userInfo?.id) {
//       fetchRoomReport();
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [accessToken, userInfo?.id, buildingId, roomId, orgId, time]);

//   const fetchSensorReport = async () => {
//     if (!accessToken || reports.length === 0) return;
//     setLoading(true);
//     const url = import.meta.env.VITE_ROOM_REPORT_SENSOR_LIST_URL;
    
//     try {
//       const resp = await api.get(url, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       });
      
//       // Filter sensor data based on time proximity to any report
//       const filteredSensorData = resp.data.filter(sensorItem => {
//         const sensorTime = new Date(sensorItem.created_at).getTime() + 180 * 60 * 1000; // Add 3 hours
        
//         // Check if this sensor data is within 15 minutes of any report
//         return reports.some(report => {
//           const reportTime = new Date(report.created_at).getTime();
//           const timeDiff = Math.abs(sensorTime - reportTime) / (1000 * 60); // Difference in minutes
//           return timeDiff <= 15;
//         });
//       });
      
//       setSensorData(filteredSensorData);
//     } catch (error) {
//       console.error("fetch sensor data error", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (iShow === true && reports.length > 0) {
//       fetchSensorReport();
//     }
//   }, [iShow, reports]);

//   const feedbackIcons = {
//     1: { icon: <FaFrown color="red" />, desc: "Very poor/Significant issues" },
//     2: { icon: <FaMeh color="orange" />, desc: "Poor/Noticeable issues" },
//     3: { icon: <FaSmile color="yellow" />, desc: "Neutral/Acceptable" },
//     4: { icon: <FaGrin color="green" />, desc: "Good/Satisfactory" },
//     5: { icon: <FaGrinStars color="blue" />, desc: "Excellent/No issues" },
//   };

//   const renderRating = (rating) => {
//     if (!rating) return '-';
//     const feedback = feedbackIcons[rating];
//     return feedback ? (
//       <VStack>
//         <Box>{feedback.icon}</Box>
//         <Box>{feedback.desc}</Box>
//       </VStack>
//     ) : (
//       rating
//     );
//   };

//   // Helper function to find matching sensor data for a report
//   const findMatchingSensorData = (report) => {
//     return sensorData.find(sensor => {
//       const sensorTime = new Date(sensor.created_at).getTime() + 180 * 60 * 1000;
//       const reportTime = new Date(report.created_at).getTime();
//       const timeDiff = Math.abs(sensorTime - reportTime) / (1000 * 60);
//       return sensor.room === report.room && timeDiff <= 15;
//     });
//   };

//   const exportToCSV = (reports) => {
//     const headers = [
//       "Building Name",
//       "Room Name",
//       "Temperature Rating",
//       "Temperature Notes",
//       "Air Quality Rating",
//       "Air Quality Notes",
//       "Draft Rating",
//       "Draft Notes",
//       "Odor Rating",
//       "Odor Notes",
//       "Lighting Rating",
//       "Lighting Notes",
//       "Structural Rating",
//       "Structural Notes",
//       "Cleanliness Rating",
//       "Cleanliness Notes",
//       "Maintenance Note",
//       "General Note",
//       "Report Date",
//       "Update Status",
//     ];

//     const rows = reports.map((report) => [
//       report.building_name || "-",
//       report.room_name || "-",
//       report.temperature_rating || "",
//       report.temperature_notes || "",
//       report.air_quality_rating || "",
//       report.air_quality_notes || "",
//       report.draft_rating || "",
//       report.draft_notes || "",
//       report.odor_rating || "",
//       report.odor_notes || "",
//       report.lighting_rating || "",
//       report.lighting_notes || "",
//       report.structural_change_rating || "",
//       report.structural_change_notes || "",
//       report.cleanliness_rating || "",
//       report.cleanliness_notes || "",
//       report.maintenance_notes || "",
//       report.general_notes || "",
//       new Date(report.created_at).toLocaleDateString(),
//       report.feedback_status || "",
//     ]);

//     const csvContent = [
//       headers.join(","),
//       ...rows.map((row) =>
//         row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", "reports.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const exportToExcel = (reports) => {
//     const data = reports.map((report) => ({
//       "Building Name": report.building_name || "-",
//       "Room Name": report.room_name || "-",
//       "Temperature Rating": report.temperature_rating || "",
//       "Temperature Notes": report.temperature_notes || "",
//       "Air Quality Rating": report.air_quality_rating || "",
//       "Air Quality Notes": report.air_quality_notes || "",
//       "Draft Rating": report.draft_rating || "",
//       "Draft Notes": report.draft_notes || "",
//       "Odor Rating": report.odor_rating || "",
//       "Odor Notes": report.odor_notes || "",
//       "Lighting Rating": report.lighting_rating || "",
//       "Lighting Notes": report.lighting_notes || "",
//       "Structural Rating": report.structural_change_rating || "",
//       "Structural Notes": report.structural_change_notes || "",
//       "Cleanliness Rating": report.cleanliness_rating || "",
//       "Cleanliness Notes": report.cleanliness_notes || "",
//       "Maintenance Note": report.maintenance_notes || "",
//       "General Note": report.general_notes || "",
//       "Report Date": new Date(report.created_at).toLocaleDateString(),
//       "Update Status": report.feedback_status || "",
//     }));

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Reports");
//     XLSX.writeFile(wb, "reports.xlsx");
//   };

//   const handleBuildingChange = (e) => {
//     const selectedBuildingId = e.target.value;
//     setBuildingId(selectedBuildingId);
//     setRoomId('');
//   };

//   const handleOrgChange = (e) => {
//     const selectedOrgId = e.target.value;
//     setOrgId(selectedOrgId);
//     setBuildingId('');
//   };

//   const handleRoomChange = (e) => {
//     setRoomId(e.target.value);
//   };

//   const handleTimeChange = (e) => {
//     const selectedTime = e.target.value;
//     console.log('Selected time:', formatDate(selectedTime));
//     setTime(selectedTime);
//   };

//   const handleClearItem = () => {
//     setBuildingId("");
//     setRoomId("");
//     setOrgId("");
//     setTime("");
//   };

//   useEffect(() => {
//     console.log("fetch sensorData:", sensorData);
//   }, [sensorData]);

//   return (
//     <Box w={"100%"} maxW={"100vw"}>
//       <Box>
//         <HStack gap={10} my={10}>
//           <Button onClick={() => exportToCSV(reports)}>Export Data to CSV</Button>
//           <Button onClick={() => exportToExcel(reports)}>Export Data to Excel</Button>
//         </HStack>
//         <HStack gap={10} my={10}>
//           <Box border="1px solid" p={4} fontSize="18px" rounded={7}>
//             <label htmlFor="org"></label>
//             <select
//               value={orgId}
//               onChange={handleOrgChange}
//               id="org"
//             >
//               <option value="">All Organizations</option>
//               {members.length > 0 && 
//                 members
//                   .filter(mem => mem.user === userInfo.id)
//                   .flatMap(mem => 
//                     organizations
//                       .filter(org => org.id === mem.organization)
//                       .flatMap(org => 
//                         reports.length > 0 
//                           ? [...new Set(reports
//                               .filter(report => report.organization === org.id)
//                               .map(report => ({
//                                 id: report.organization,
//                                 name: report.organization_name
//                               }))
//                             )]
//                           : []
//                       )
//                   )
//                   .filter((org, index, self) => 
//                     index === self.findIndex(b => b.id === org.id)
//                   )
//                   .map(org => (
//                     <option key={org.id} value={org.id}>
//                       {org.name}
//                     </option>
//                   ))
//               }
//             </select>
//           </Box>
//           <Box border="1px solid" p={4} fontSize="18px" rounded={7}>
//             <label htmlFor="building"></label>
//             <select
//               value={buildingId}
//               onChange={handleBuildingChange}
//               id="building"
//               disabled={!orgId}
//             >
//               <option value="">All Buildings</option>
//               {members.length > 0 && 
//                 members
//                   .filter(mem => mem.user === userInfo.id)
//                   .flatMap(mem => 
//                     buildings
//                       .filter(building => building.organization === mem.organization)
//                       .flatMap(building => 
//                         reports.length > 0 
//                           ? [...new Set(reports
//                               .filter(report => report.building === building.id)
//                               .map(report => ({
//                                 id: report.building,
//                                 name: report.building_name
//                               }))
//                             )]
//                           : []
//                       )
//                   )
//                   .filter((building, index, self) => 
//                     index === self.findIndex(b => b.id === building.id)
//                   )
//                   .map(building => (
//                     <option key={building.id} value={building.id}>
//                       {building.name}
//                     </option>
//                   ))
//               }
//             </select>
//           </Box>
//           <Box border="1px solid" p={4} rounded={7} fontSize="18px">
//             <label htmlFor="room"></label>
//             <select
//               value={roomId}
//               onChange={handleRoomChange}
//               disabled={!buildingId}
//               id="room"
//             >
//               <option value="">All Rooms</option>
//               {rooms.length && rooms
//                 .flatMap(room => reports.length > 0 ? 
//                   [...new Set(reports
//                     .filter(item => item.room === room.id)
//                     .map(item => ({
//                       id: item.room,
//                       name: item.room_name
//                     })))]:[])
//                     .filter((room, index, self) => index === self.findIndex(r => r.id === room.id))
//                   .map((room)=>(
//                     <option key={room.id} value={room.id}>{room.name}</option>
//                   ))}
//             </select>
//           </Box>
//           <Box border="1px solid" p={4} rounded={7} fontSize="18px">
//             <label htmlFor="time"></label>
//             <select
//               value={time}
//               onChange={handleTimeChange}
//               disabled={!roomId}
//               id="time"
//             >
//               <option value="">All Time</option>
//                 {[...new Set(reports.map(r => r.created_at))]
//                 .map(dateStr => (
//                   <option key={dateStr} value={dateStr}>{formatDate(dateStr)}</option>
//                 ))}
//             </select>
//           </Box>
//           <Box>
//             <Button onClick={handleClearItem}>Clear</Button>
//           </Box>
//           <Button p={"10px"} rounded={"5px"}>
//             <Switch.Root
//               checked={iShow}
//               onCheckedChange={e => setIShow(e.checked)}
//               colorPalette={"blue"}
//             >
//               <Switch.HiddenInput/>
//               <Switch.Control/>
//               <Switch.Label>Show Sensor Data</Switch.Label>
//             </Switch.Root>
//           </Button>
//         </HStack>
//       </Box>

//       <Box maxW={"100%"}>
//         <Table.Root shadow="3px 3px 15px 5px rgb(75, 75, 79)" mx="auto" rounded="8" maxW="100%" fontSize={"xs"}>
//           <Table.Header>
//             <Table.Row>
//               <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                 Building Name
//               </Table.ColumnHeader>
//               <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                 Room Name
//               </Table.ColumnHeader>
//               <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                 Temperature
//               </Table.ColumnHeader>
//               <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                 Air Quality
//               </Table.ColumnHeader>
//               <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                 Draft
//               </Table.ColumnHeader>
//               <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                 Odor
//               </Table.ColumnHeader>
//               <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                 Lighting
//               </Table.ColumnHeader>
//               <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                 Structural
//               </Table.ColumnHeader>
//               <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                 Cleanliness
//               </Table.ColumnHeader>
//               <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                 Maintenance Note
//               </Table.ColumnHeader>
//               <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                 General Note
//               </Table.ColumnHeader>
//               <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                 Report Date
//               </Table.ColumnHeader>
//               {iShow && (
//                 <>
//                   <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                     Temperature
//                   </Table.ColumnHeader>
//                   <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                     Humidity
//                   </Table.ColumnHeader>
//                   <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                     CO2
//                   </Table.ColumnHeader>
//                   <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                     Light
//                   </Table.ColumnHeader>
//                   <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                     Motion
//                   </Table.ColumnHeader>
//                   <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                     Created Time
//                   </Table.ColumnHeader>
//                   <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
//                     Actions
//                   </Table.ColumnHeader>
//                 </>
//               )}
//             </Table.Row>
//           </Table.Header>
//           <Table.Body>
//             {members
//               .filter(mem => mem.user === userInfo.id)
//               .flatMap(mem =>
//                 buildings
//                   .filter(building => building.organization === mem.organization)
//                   .flatMap(building =>
//                     reports
//                       .filter(report => report.building === building.id && report.organization === building.organization)
//                       .map(report => {
//                         const matchingSensor = findMatchingSensorData(report);
                        
//                         return (
//                           <Table.Row key={report.id}>
//                             <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                               {report.building_name || '-'}
//                             </Table.Cell>
//                             <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                               {report.room_name || '-'}
//                             </Table.Cell>
//                             <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                               {renderRating(report.temperature_rating)}
//                               <Box>Rating: {report.temperature_rating}</Box>
//                               <Box>Note: {report.temperature_notes}</Box>
//                             </Table.Cell>
//                             <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                               {renderRating(report.air_quality_rating)}
//                               <Box>Rating: {report.air_quality_rating}</Box>
//                               <Box>Note: {report.air_quality_notes}</Box>
//                             </Table.Cell>
//                             <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                               {renderRating(report.draft_rating)}
//                               <Box>Rating: {report.draft_rating}</Box>
//                               <Box>Note: {report.draft_notes}</Box>
//                             </Table.Cell>
//                             <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                               {renderRating(report.odor_rating)}
//                               <Box>Rating: {report.odor_rating}</Box>
//                               <Box>Note: {report.odor_notes}</Box>
//                             </Table.Cell>
//                             <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                               {renderRating(report.lighting_rating)}
//                               <Box>Rating: {report.lighting_rating}</Box>
//                               <Box>Note: {report.lighting_notes}</Box>
//                             </Table.Cell>
//                             <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                               {renderRating(report.structural_change_rating)}
//                               <Box>Rating: {report.structural_change_rating}</Box>
//                               <Box>Note: {report.structural_change_notes}</Box>
//                             </Table.Cell>
//                             <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                               {renderRating(report.cleanliness_rating)}
//                               <Box>Rating: {report.cleanliness_rating}</Box>
//                               <Box>Note: {report.cleanliness_notes}</Box>
//                             </Table.Cell>
//                             <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                               {report.maintenance_notes}
//                             </Table.Cell>
//                             <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                               {report.general_notes}
//                             </Table.Cell>
//                             <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                               {formatDate(report.created_at)}
//                             </Table.Cell>
//                             {iShow && (
//                               <>
//                                 <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                                   {loading ? <Spinner size={"sm"}/> : (matchingSensor ? matchingSensor.temperature : '-')}
//                                 </Table.Cell>
//                                 <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                                   {matchingSensor ? matchingSensor.humidity : '-'}
//                                 </Table.Cell>
//                                 <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                                   {matchingSensor ? matchingSensor.co2 : '-'}
//                                 </Table.Cell>
//                                 <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                                   {matchingSensor ? matchingSensor.light : '-'}
//                                 </Table.Cell>
//                                 <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                                   {matchingSensor ? matchingSensor.motion : '-'}
//                                 </Table.Cell>
//                                 <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                                   {matchingSensor ? formatDate(new Date(matchingSensor.created_at).getTime()+180*60*1000) : '-'}
//                                 </Table.Cell>
//                                 <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
//                                   <SyncSensorRoomData
//                                     onSyncSuccess={fetchSensorReport}
//                                     roomid={report.room}
//                                     buildingid={report.building}
//                                     created_at={report.created_at}
//                                   />
//                                 </Table.Cell>
//                               </>
//                             )}
//                           </Table.Row>
//                         );
//                       })
//                   )
//               )
//             }
//           </Table.Body>
//         </Table.Root>
//       </Box>
//     </Box>
//   );
// };

// export default Report;

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import api from '../../services/api';
import { Box, Container, VStack, HStack, Table, Text, Flex, Button, Center, Switch, Spinner } from '@chakra-ui/react';
import { FaFrown, FaMeh, FaSmile, FaGrin, FaGrinStars } from 'react-icons/fa';
import useRoom from '../RoomOwner/RoomHook';
import useBuilding from '../BuildingManagement/BuildingHook';
import * as XLSX from "xlsx";
import formatDate from '../formatDate';
import SyncSensorRoomData from '../Sensor-Data/SyncSensorRoomData';
import useOrganization from '../Organization/OrganizationHook';
import SensorReportsList from '../Sensor-Data/SensorReportsList';

const Report = () => {
  const { t } = useTranslation();
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [reports, setReports] = useState([]);

  const [roomId, setRoomId] = useState('');
  const [orgId, setOrgId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [time, setTime] = useState('');

  const [iShow, setIShow] = useState(false);
  const { buildings } = useBuilding();
  const { rooms } = useRoom(buildingId);
  const { organizations } = useOrganization();

  const [sensorData, setSensorData] = useState([]);
  const [members, setMembers] = useState([]);
  const frozenSensorData = useRef([]);

  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    if (!accessToken || !userInfo?.id) return;
    
    const url = import.meta.env.VITE_ORGANIZATION_MEMBERSHIP_LIST_URL;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await api.get(url, config);
      const sortedItem = response.data;
      setMembers(Array.isArray(sortedItem) ? sortedItem : sortedItem.items || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    } 
  };

  useEffect(() => {
    if (accessToken && userInfo?.id) {
      fetchMembers();
    }
  }, [accessToken, userInfo?.id]);

  const fetchRoomReport = async () => {
    if (!accessToken) return;
    const url = import.meta.env.VITE_ROOM_REPORT_LIST_URL;
    try {
      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      let filteredReports = res.data;
      
      if (orgId) {
        filteredReports = filteredReports.filter((item) => item.organization === Number(orgId));
      }
      if (buildingId) {
        filteredReports = filteredReports.filter((item) => item.building === Number(buildingId));
      }
      if (roomId) {
        filteredReports = filteredReports.filter((item) => item.room === Number(roomId));
      }
      if (time) {
        filteredReports = filteredReports.filter(t => t.created_at === time);
      }
      
      filteredReports = filteredReports.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      console.log("filter report:", filteredReports);
      setReports(filteredReports);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert(t('error.please_login_again'));
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (accessToken && userInfo?.id) {
      fetchRoomReport();
    }
  }, [accessToken, userInfo?.id, buildingId, roomId, orgId, time, t]);

  const fetchSensorReport = async () => {
    if (!accessToken || reports.length === 0) return;
    setLoading(true);
    const url = import.meta.env.VITE_ROOM_REPORT_SENSOR_LIST_URL;
    
    try {
      const resp = await api.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      
      const filteredSensorData = resp.data.filter(sensorItem => {
        const sensorTime = new Date(sensorItem.created_at).getTime() + 180 * 60 * 1000;
        return reports.some(report => {
          const reportTime = new Date(report.created_at).getTime();
          const timeDiff = Math.abs(sensorTime - reportTime) / (1000 * 60);
          return timeDiff <= 15;
        });
      });
      
      setSensorData(filteredSensorData);
    } catch (error) {
      console.error("fetch sensor data error", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (iShow === true && reports.length > 0) {
      fetchSensorReport();
    }
  }, [iShow, reports]);

  const feedbackIcons = {
    1: { icon: <FaFrown color="red" />, desc: t('report.very_poor') },
    2: { icon: <FaMeh color="orange" />, desc: t('report.poor') },
    3: { icon: <FaSmile color="yellow" />, desc: t('report.neutral') },
    4: { icon: <FaGrin color="green" />, desc: t('report.good') },
    5: { icon: <FaGrinStars color="blue" />, desc: t('report.excellent') },
  };

  const renderRating = (rating) => {
    if (!rating) return '-';
    const feedback = feedbackIcons[rating];
    return feedback ? (
      <VStack>
        <Box>{feedback.icon}</Box>
        <Box>{feedback.desc}</Box>
      </VStack>
    ) : (
      rating
    );
  };

  const findMatchingSensorData = (report) => {
    return sensorData.find(sensor => {
      const sensorTime = new Date(sensor.created_at).getTime() + 180 * 60 * 1000;
      const reportTime = new Date(report.created_at).getTime();
      const timeDiff = Math.abs(sensorTime - reportTime) / (1000 * 60);
      return sensor.room === report.room && timeDiff <= 15;
    });
  };

  const exportToCSV = (reports) => {
    const headers = [
      t('report.building_name'),
      t('report.room_name'),
      t('report.temperature_rating'),
      t('report.temperature_notes'),
      t('report.air_quality_rating'),
      t('report.air_quality_notes'),
      t('report.draft_rating'),
      t('report.draft_notes'),
      t('report.odor_rating'),
      t('report.odor_notes'),
      t('report.lighting_rating'),
      t('report.lighting_notes'),
      t('report.structural_rating'),
      t('report.structural_notes'),
      t('report.cleanliness_rating'),
      t('report.cleanliness_notes'),
      t('report.maintenance_note'),
      t('report.general_note'),
      t('report.report_date'),
      t('report.update_status'),
    ];

    const rows = reports.map((report) => [
      report.building_name || "-",
      report.room_name || "-",
      report.temperature_rating || "",
      report.temperature_notes || "",
      report.air_quality_rating || "",
      report.air_quality_notes || "",
      report.draft_rating || "",
      report.draft_notes || "",
      report.odor_rating || "",
      report.odor_notes || "",
      report.lighting_rating || "",
      report.lighting_notes || "",
      report.structural_change_rating || "",
      report.structural_change_notes || "",
      report.cleanliness_rating || "",
      report.cleanliness_notes || "",
      report.maintenance_notes || "",
      report.general_notes || "",
      new Date(report.created_at).toLocaleDateString(),
      report.feedback_status || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (reports) => {
    const data = reports.map((report) => ({
      [t('report.building_name')]: report.building_name || "-",
      [t('report.room_name')]: report.room_name || "-",
      [t('report.temperature_rating')]: report.temperature_rating || "",
      [t('report.temperature_notes')]: report.temperature_notes || "",
      [t('report.air_quality_rating')]: report.air_quality_rating || "",
      [t('report.air_quality_notes')]: report.air_quality_notes || "",
      [t('report.draft_rating')]: report.draft_rating || "",
      [t('report.draft_notes')]: report.draft_notes || "",
      [t('report.odor_rating')]: report.odor_rating || "",
      [t('report.odor_notes')]: report.odor_notes || "",
      [t('report.lighting_rating')]: report.lighting_rating || "",
      [t('report.lighting_notes')]: report.lighting_notes || "",
      [t('report.structural_rating')]: report.structural_change_rating || "",
      [t('report.structural_notes')]: report.structural_change_notes || "",
      [t('report.cleanliness_rating')]: report.cleanliness_rating || "",
      [t('report.cleanliness_notes')]: report.cleanliness_notes || "",
      [t('report.maintenance_note')]: report.maintenance_notes || "",
      [t('report.general_note')]: report.general_notes || "",
      [t('report.report_date')]: new Date(report.created_at).toLocaleDateString(),
      [t('report.update_status')]: report.feedback_status || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t('report.reports'));
    XLSX.writeFile(wb, "reports.xlsx");
  };

  const handleBuildingChange = (e) => {
    const selectedBuildingId = e.target.value;
    setBuildingId(selectedBuildingId);
    setRoomId('');
  };

  const handleOrgChange = (e) => {
    const selectedOrgId = e.target.value;
    setOrgId(selectedOrgId);
    setBuildingId('');
  };

  const handleRoomChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    console.log('Selected time:', formatDate(selectedTime));
    setTime(selectedTime);
  };

  const handleClearItem = () => {
    setBuildingId("");
    setRoomId("");
    setOrgId("");
    setTime("");
  };

  useEffect(() => {
    console.log("fetch sensorData:", sensorData);
  }, [sensorData]);

  return (
    <Box w={"100%"} maxW={"100vw"}>
      <Box>
        <HStack gap={10} my={10}>
          <Button onClick={() => exportToCSV(reports)}>{t('report.export_csv')}</Button>
          <Button onClick={() => exportToExcel(reports)}>{t('report.export_excel')}</Button>
        </HStack>
        <HStack gap={10} my={10}>
          <Box border="1px solid" p={4} fontSize="18px" rounded={7}>
            <label htmlFor="org"></label>
            <select
              value={orgId}
              onChange={handleOrgChange}
              id="org"
            >
              <option value="">{t('report.all_organizations')}</option>
              {members.length > 0 && 
                members
                  .filter(mem => mem.user === userInfo.id)
                  .flatMap(mem => 
                    organizations
                      .filter(org => org.id === mem.organization)
                      .flatMap(org => 
                        reports.length > 0 
                          ? [...new Set(reports
                              .filter(report => report.organization === org.id)
                              .map(report => ({
                                id: report.organization,
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
          <Box border="1px solid" p={4} fontSize="18px" rounded={7}>
            <label htmlFor="building"></label>
            <select
              value={buildingId}
              onChange={handleBuildingChange}
              id="building"
              disabled={!orgId}
            >
              <option value="">{t('report.all_buildings')}</option>
              {members.length > 0 && 
                members
                  .filter(mem => mem.user === userInfo.id)
                  .flatMap(mem => 
                    buildings
                      .filter(building => building.organization === mem.organization)
                      .flatMap(building => 
                        reports.length > 0 
                          ? [...new Set(reports
                              .filter(report => report.building === building.id)
                              .map(report => ({
                                id: report.building,
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
          <Box border="1px solid" p={4} rounded={7} fontSize="18px">
            <label htmlFor="room"></label>
            <select
              value={roomId}
              onChange={handleRoomChange}
              disabled={!buildingId}
              id="room"
            >
              <option value="">{t('report.all_rooms')}</option>
              {rooms.length && rooms
                .flatMap(room => reports.length > 0 ? 
                  [...new Set(reports
                    .filter(item => item.room === room.id)
                    .map(item => ({
                      id: item.room,
                      name: item.room_name
                    })))]:[])
                    .filter((room, index, self) => index === self.findIndex(r => r.id === room.id))
                  .map((room)=>(
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
            </select>
          </Box>
          <Box border="1px solid" p={4} rounded={7} fontSize="18px">
            <label htmlFor="time"></label>
            <select
              value={time}
              onChange={handleTimeChange}
              disabled={!roomId}
              id="time"
            >
              <option value="">{t('report.all_time')}</option>
                {[...new Set(reports.map(r => r.created_at))]
                .map(dateStr => (
                  <option key={dateStr} value={dateStr}>{formatDate(dateStr)}</option>
                ))}
            </select>
          </Box>
          <Box>
            <Button onClick={handleClearItem}>{t('report.clear')}</Button>
          </Box>
          <Button p={"10px"} rounded={"5px"}>
            <Switch.Root
              checked={iShow}
              onCheckedChange={e => setIShow(e.checked)}
              colorPalette={"blue"}
            >
              <Switch.HiddenInput/>
              <Switch.Control/>
              <Switch.Label>{t('report.show_sensor_data')}</Switch.Label>
            </Switch.Root>
          </Button>
        </HStack>
      </Box>

      <Box maxW={"100%"}>
        <Table.Root shadow="3px 3px 15px 5px rgb(75, 75, 79)" mx="auto" rounded="8" maxW="100%" fontSize={"xs"}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                {t('report.building_name')}
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                {t('report.room_name')}
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                {t('report.temperature')}
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                {t('report.air_quality')}
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                {t('report.draft')}
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                {t('report.odor')}
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                {t('report.lighting')}
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                {t('report.structural')}
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                {t('report.cleanliness')}
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                {t('report.maintenance_note')}
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                {t('report.general_note')}
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                {t('report.report_date')}
              </Table.ColumnHeader>
              {iShow && (
                <>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    {t('report.temperature')}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    {t('report.humidity')}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    {t('report.co2')}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    {t('report.light')}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    {t('report.motion')}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    {t('report.created_time')}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    {t('report.actions')}
                  </Table.ColumnHeader>
                </>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {members
              .filter(mem => mem.user === userInfo.id)
              .flatMap(mem =>
                buildings
                  .filter(building => building.organization === mem.organization)
                  .flatMap(building =>
                    reports
                      .filter(report => report.building === building.id && report.organization === building.organization)
                      .map(report => {
                        const matchingSensor = findMatchingSensorData(report);
                        
                        return (
                          <Table.Row key={report.id}>
                            <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                              {report.building_name || '-'}
                            </Table.Cell>
                            <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                              {report.room_name || '-'}
                            </Table.Cell>
                            <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                              {renderRating(report.temperature_rating)}
                              <Box>{t('report.rating')}: {report.temperature_rating}</Box>
                              <Box>{t('report.note')}: {report.temperature_notes}</Box>
                            </Table.Cell>
                            <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                              {renderRating(report.air_quality_rating)}
                              <Box>{t('report.rating')}: {report.air_quality_rating}</Box>
                              <Box>{t('report.note')}: {report.air_quality_notes}</Box>
                            </Table.Cell>
                            <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                              {renderRating(report.draft_rating)}
                              <Box>{t('report.rating')}: {report.draft_rating}</Box>
                              <Box>{t('report.note')}: {report.draft_notes}</Box>
                            </Table.Cell>
                            <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                              {renderRating(report.odor_rating)}
                              <Box>{t('report.rating')}: {report.odor_rating}</Box>
                              <Box>{t('report.note')}: {report.odor_notes}</Box>
                            </Table.Cell>
                            <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                              {renderRating(report.lighting_rating)}
                              <Box>{t('report.rating')}: {report.lighting_rating}</Box>
                              <Box>{t('report.note')}: {report.lighting_notes}</Box>
                            </Table.Cell>
                            <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                              {renderRating(report.structural_change_rating)}
                              <Box>{t('report.rating')}: {report.structural_change_rating}</Box>
                              <Box>{t('report.note')}: {report.structural_change_notes}</Box>
                            </Table.Cell>
                            <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                              {renderRating(report.cleanliness_rating)}
                              <Box>{t('report.rating')}: {report.cleanliness_rating}</Box>
                              <Box>{t('report.note')}: {report.cleanliness_notes}</Box>
                            </Table.Cell>
                            <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                              {report.maintenance_notes}
                            </Table.Cell>
                            <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                              {report.general_notes}
                            </Table.Cell>
                            <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                              {formatDate(report.created_at)}
                            </Table.Cell>
                            {iShow && (
                              <>
                                <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                  {loading ? <Spinner size={"sm"}/> : (matchingSensor ? matchingSensor.temperature : '-')}
                                </Table.Cell>
                                <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                  {matchingSensor ? matchingSensor.humidity : '-'}
                                </Table.Cell>
                                <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                  {matchingSensor ? matchingSensor.co2 : '-'}
                                </Table.Cell>
                                <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                  {matchingSensor ? matchingSensor.light : '-'}
                                </Table.Cell>
                                <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                  {matchingSensor ? matchingSensor.motion : '-'}
                                </Table.Cell>
                                <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                  {matchingSensor ? formatDate(new Date(matchingSensor.created_at).getTime()+180*60*1000) : '-'}
                                </Table.Cell>
                                <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                  <SyncSensorRoomData
                                    onSyncSuccess={fetchSensorReport}
                                    roomid={report.room}
                                    buildingid={report.building}
                                    created_at={report.created_at}
                                  />
                                </Table.Cell>
                              </>
                            )}
                          </Table.Row>
                        );
                      })
                  )
              )
            }
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
};

export default Report;