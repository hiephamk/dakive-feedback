
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import api from '../../services/api';
import { Box, Container, VStack, HStack, Table, Text, Flex, Button, Center, Switch, Spinner } from '@chakra-ui/react';
import { FaFrown, FaMeh, FaSmile, FaGrin, FaGrinStars } from 'react-icons/fa';
import useRoom from '../RoomOwner/RoomHook';
import useBuilding from '../BuildingManagement/BuildingHook';
import * as XLSX from "xlsx";
import formatDate from '../formatDate'
import SyncSensorRoomData from '../Sensor-Data/SyncSensorRoomData';
import useOrganization from '../Organization/OrganizationHook';
import SensorReportsList from '../Sensor-Data/SensorReportsList';


const Report = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [reports, setReports] = useState([]);

  const [roomId, setRoomId] = useState('');
  const [orgId, setOrgId] = useState('');
  const [buildingId, setBuildingId] = useState('');

  const [iShow, setIShow] = useState(false);
  const { buildings } = useBuilding();
  const { rooms } = useRoom(buildingId);
  const { organizations } = useOrganization()

  const [sensorData, setSensorData] = useState([]);
  const [members, setMembers] = useState([])
  const frozenSensorData = useRef([]);

  const [loading, setLoading] = useState(false)

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
      const sortedItem = response.data
      setMembers(Array.isArray(sortedItem) ? sortedItem : sortedItem.items || []);
    } catch (err) {
      console.error('Error fetching members:', err);

    } 
  };
  useEffect(()=> {
    if(accessToken && userInfo?.id) {
      fetchMembers()
    }
  },[])

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
      
      setReports(filteredReports);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Please login again.");
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (accessToken && userInfo?.id) {
      fetchRoomReport();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, userInfo?.id, buildingId, roomId, orgId]);

  const fetchSensorReport = async () => {
    if (!accessToken) return;
    setLoading(true)
    const url = import.meta.env.VITE_ROOM_REPORT_SENSOR_LIST_URL;
    try {
      const resp = await api.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const filterData = resp.data
      // let filterData = resp.data.filter(item => Math.abs(new Date(item.created_at).getTime() - new Date(reports.created_at).getTime()) < 30*60*1000)
      setSensorData(filterData)
    } catch (error) {
      console.error("fetch sensor data error", error.response?.data || error.message);
    }finally{
      setLoading(false)
    }
  };

  const feedbackIcons = {
    1: { icon: <FaFrown color="red" />, desc: "Very poor/Significant issues" },
    2: { icon: <FaMeh color="orange" />, desc: "Poor/Noticeable issues" },
    3: { icon: <FaSmile color="yellow" />, desc: "Neutral/Acceptable" },
    4: { icon: <FaGrin color="green" />, desc: "Good/Satisfactory" },
    5: { icon: <FaGrinStars color="blue" />, desc: "Excellent/No issues" },
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

  const exportToCSV = (reports) => {
    const headers = [
      "Building Name",
      "Room Name",
      "Temperature Rating",
      "Temperature Notes",
      "Air Quality Rating",
      "Air Quality Notes",
      "Draft Rating",
      "Draft Notes",
      "Odor Rating",
      "Odor Notes",
      "Lighting Rating",
      "Lighting Notes",
      "Structural Rating",
      "Structural Notes",
      "Cleanliness Rating",
      "Cleanliness Notes",
      "Maintenance Note",
      "General Note",
      "Report Date",
      "Update Status",
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
      "Building Name": report.building_name || "-",
      "Room Name": report.room_name || "-",
      "Temperature Rating": report.temperature_rating || "",
      "Temperature Notes": report.temperature_notes || "",
      "Air Quality Rating": report.air_quality_rating || "",
      "Air Quality Notes": report.air_quality_notes || "",
      "Draft Rating": report.draft_rating || "",
      "Draft Notes": report.draft_notes || "",
      "Odor Rating": report.odor_rating || "",
      "Odor Notes": report.odor_notes || "",
      "Lighting Rating": report.lighting_rating || "",
      "Lighting Notes": report.lighting_notes || "",
      "Structural Rating": report.structural_change_rating || "",
      "Structural Notes": report.structural_change_notes || "",
      "Cleanliness Rating": report.cleanliness_rating || "",
      "Cleanliness Notes": report.cleanliness_notes || "",
      "Maintenance Note": report.maintenance_notes || "",
      "General Note": report.general_notes || "",
      "Report Date": new Date(report.created_at).toLocaleDateString(),
      "Update Status": report.feedback_status || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");
    XLSX.writeFile(wb, "reports.xlsx");
  };

  const handleBuildingChange = (e) => {
    const selectedBuildingId = e.target.value;
    setBuildingId(selectedBuildingId);
    setRoomId('');
  };
  const handleOrgChange = (e) => {
    const selectedOrgId = e.target.value;
    setOrgId(selectedOrgId)
    setBuildingId('');
  };

  const handleRoomChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleClearItem = () => {
    setBuildingId("");
    setRoomId("");
    setOrgId("");
  };

    useEffect(()=>{
      console.log("fetch sensorData:",sensorData)
    },[sensorData])

  return (
    <Box w={"100%"} maxW={"100vw"}>
      <Box>
        <HStack gap={10} my={10}>
          <Button onClick={() => exportToCSV(reports)}>Export Data to CSV</Button>
          <Button onClick={() => exportToExcel(reports)}>Export Data to Excel</Button>
        </HStack>
        <HStack gap={10} my={10}>
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
              id="organization"
              disabled={!orgId}
            >
              <option value="">All Buildings</option>
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
            <label id="room"></label>
            <select
              value={roomId}
              onChange={handleRoomChange}
              disabled={!buildingId}
              id="room"
            >
              <option value="">All Rooms</option>
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
          <Box>
            <Button onClick={handleClearItem}>Clear</Button>
          </Box>
          <Button p={"10px"} rounded={"5px"}>
            <Switch.Root
              checked={iShow}
              onCheckedChange={e => setIShow(e.checked)}
              colorPalette={"blue"}
              
            >
              <Switch.HiddenInput/>
              <Switch.Control/>
              <Switch.Label>Show Sensor Data</Switch.Label>
            </Switch.Root>
          </Button>
        </HStack>
      </Box>

      <Box maxW={"100%"}>
        <Table.Root shadow="3px 3px 15px 5px rgb(75, 75, 79)" mx="auto" rounded="8" maxW="100%" fontSize={"xs"}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                Building Name
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                Room Name
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                Temperature
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                Air Quality
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                Draft
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                Odor
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                Lighting
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                Structural
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                Cleanliness
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                Maintenance Note
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                General Note
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                Report Date
              </Table.ColumnHeader>
              {/* <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                Update Status
              </Table.ColumnHeader> */}
              {iShow ? (
                <>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    Temperature
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    Humidity
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    CO2
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    Light
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    Motion
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    Created Time
                  </Table.ColumnHeader>
                  {/* <Table.ColumnHeader fontWeight="bold" fontSize="14px" border="1px solid" textAlign="center">
                    Sync Data Time
                  </Table.ColumnHeader> */}

                </>
              ) : ("")}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              members
                .filter(mem => mem.user === userInfo.id)
                .flatMap(mem =>
                  buildings
                    .filter(building => building.organization === mem.organization)
                    .flatMap(building =>
                      reports
                        .filter(report => report.building === building.id && report.organization === building.organization)
                        .map(report => {
                          const sensor = sensorData.find(s => {
                            if (String(s.room) !== String(report.room)) {
                              return false;
                            }
                            const sensorTime = new Date(s.created_at).getTime() + 180*60*1000;
                            const reportTime = new Date(report.created_at).getTime();
                            const timeDiff = Math.abs(sensorTime - reportTime) / (1000 * 60);
                            return timeDiff <= 15;
                          });
                          console.log("sensor:", sensor)

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
                                <Box>Rating: {report.temperature_rating}</Box>
                                <Box>Note: {report.temperature_notes}</Box>
                              </Table.Cell>
                              <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                {renderRating(report.air_quality_rating)}
                                <Box>Rating: {report.air_quality_rating}</Box>
                                <Box>Note: {report.air_quality_notes}</Box>
                              </Table.Cell>
                              <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                {renderRating(report.draft_rating)}
                                <Box>Rating: {report.draft_rating}</Box>
                                <Box>Note: {report.draft_notes}</Box>
                              </Table.Cell>
                              <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                {renderRating(report.odor_rating)}
                                <Box>Rating: {report.odor_rating}</Box>
                                <Box>Note: {report.odor_notes}</Box>
                              </Table.Cell>
                              <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                {renderRating(report.lighting_rating)}
                                <Box>Rating: {report.lighting_rating}</Box>
                                <Box>Note: {report.lighting_notes}</Box>
                              </Table.Cell>
                              <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                {renderRating(report.structural_change_rating)}
                                <Box>Rating: {report.structural_change_rating}</Box>
                                <Box>Note: {report.structural_change_notes}</Box>
                              </Table.Cell>
                              <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                {renderRating(report.cleanliness_rating)}
                                <Box>Rating: {report.cleanliness_rating}</Box>
                                <Box>Note: {report.cleanliness_notes}</Box>
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
                                    {loading ? <Spinner size={"sm"}/> : (sensor ? sensor.temperature : '-')}
                                  </Table.Cell>
                                  <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                    {sensor ? sensor.humidity : '-'}
                                  </Table.Cell>
                                  <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                    {sensor ? sensor.co2 : '-'}
                                  </Table.Cell>
                                  <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                    {sensor ? sensor.light : '-'}
                                  </Table.Cell>
                                  <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                    {sensor ? sensor.motion : '-'}
                                  </Table.Cell>
                                  <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                    {sensor ? formatDate(new Date(sensor.created_at).getTime()+180*60*1000) : '-'}
                                  </Table.Cell>
                                  {/* <Table.Cell textAlign="center" style={{ border: '1px solid' }}>
                                    {sensor ? formatDate(sensor.updated_at) : '-'}
                                  </Table.Cell> */}
                                  <Table.Cell>
                                    {<SyncSensorRoomData
                                      onSyncSuccess={fetchSensorReport}
                                      roomid={report.room}
                                      buildingid={report.building}
                                      created_at={report.created_at}
                                      // externalid={building.external_id}
                                    />}
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