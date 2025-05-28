import {useEffect, useState} from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import { Box, Container, HStack, VStack, Button, Table, Center } from '@chakra-ui/react'
import { FaFrown, FaMeh, FaSmile, FaGrin, FaGrinStars } from 'react-icons/fa';
import { useParams } from 'react-router'
import useRoom from '../RoomOwner/RoomHook'
import * as XLSX from "xlsx";

const BuldingReports = () => {
  const {user, userInfo} = useSelector(state => state.auth)
  const accessToken = useAccessToken(user)
  
  const [reports, setReport] = useState([])
  const {buildingId} = useParams()
  const [roomId, setRoomId] = useState('');
  const {rooms} = useRoom(buildingId)

  const fetchBuildingReport = async () => {
    if(!accessToken) {
      alert("Please login again to view the reports")
      return
    }
    const url = import.meta.env.VITE_ROOM_REPORT_LIST_URL
    try {
      const res = await axios.get(url,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
      })
      let filteredReports = res.data;
      
      if (buildingId) {
        filteredReports = filteredReports.filter((item) => item.building === Number(buildingId));
      }
      if (roomId) {
        filteredReports = filteredReports.filter((item) => item.room === Number(roomId));
      }
      setReport(filteredReports)

    } catch(error){
      if(error.response && error.response.status === 401) {
                alert("Please login again.");
            }else {
                console.error(error);
            }
    }
  }
  useEffect(()=>{
    if(accessToken && userInfo?.id){
      fetchBuildingReport()
    }
  },[accessToken,userInfo?.id, buildingId, roomId])

  const feedbackIcons = {
      1: { icon: <FaFrown color="red" />, desc: "Very poor/Significant issues" },
      2: { icon: <FaMeh color="orange" />, desc: "Poor/Noticeable issues" },
      3: { icon: <FaSmile color="yellow" />, desc: "Neutral/Acceptable" },
      4: { icon: <FaGrin color="green" />, desc: "Good/Satisfactory" },
      5: { icon: <FaGrinStars color="blue" />, desc: "Excellent/No issues" },
    };
  
  // Function to render rating as icon + description
  const renderRating = (rating) => {
    if (!rating) return '-';
    const feedback = feedbackIcons[rating];
    return feedback ? (
      <VStack>
        <Box>{feedback.icon} </Box>
        <Box>{feedback.desc}</Box>
      </VStack>
    ) : (
      rating
    );
  };

  //export to csv
    const exportToCSV = (reports) => {
      // Define CSV headers
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
    
      // Map reports to CSV rows
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
    
      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");
    
      // Create a downloadable file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "reports.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    //export data to excel
    const exportToExcel = (reports) => {
      // Prepare data for Excel
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
    
      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Reports");
      // Export the file
      XLSX.writeFile(wb, "reports.xlsx");
    };
  const handleRoomChange = (e) => {
    setRoomId(e.target.value)
  }
  return (
    <Container mx="auto" my="20px">
      <Box>
        <HStack gap={10} my={10}>
          <Button onClick ={()=> exportToCSV(reports)}>Export Data to CSV</Button>
          <Button onClick ={()=> exportToExcel(reports)}>Export Data to Excel</Button>
        </HStack>
        <Box my={10} p={4} fontSize="18px" fontWeight="bold">
          <label id="room">Sort by room: </label>
          <select 
              value={roomId} 
              onChange={handleRoomChange}
              disabled={!buildingId}
              id='room'
            >
              <option value="">All Rooms</option>
              {rooms.length > 0 && rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
          </select>
        </Box>
      </Box>
        <Box>
        <Table.Root shadow="3px 3px 15px 5px rgb(75, 75, 79)" mx="auto" rounded="8" maxW="100%">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                Building Name
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                Room Name
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                Temperature
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                Air Quality
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                Draft
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                Odor
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                Lighting
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                Structural
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                Cleanliness
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                Maintenance Note
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                General Note
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                Report Date
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">
                Update Status
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {buildingId && reports.length > 0 ? (
              reports.map((report) => (
                <Table.Row key={report.id}>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {report.building_name || '-'}
                  </Table.Cell>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {report.room_name || '-'}
                  </Table.Cell>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {renderRating(report.temperature_rating)}
                    <Box>Rating: {report.temperature_rating}</Box>
                    <Box>Note: {report.temperature_notes}</Box>
                  </Table.Cell>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {renderRating(report.air_quality_rating)}
                    <Box>Rating: {report.air_quality_rating}</Box>
                    <Box>Note: {report.air_quality_notes}</Box>
                  </Table.Cell>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {renderRating(report.draft_rating)}
                    <Box>Rating: {report.draft_rating}</Box>
                    <Box>Note: {report.draft_notes}</Box>
                  </Table.Cell>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {renderRating(report.odor_rating)}
                    <Box>Rating: {report.odor_rating}</Box>
                    <Box>Note: {report.odor_notes}</Box>
                  </Table.Cell>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {renderRating(report.lighting_rating)}
                    <Box>Rating: {report.lighting_rating}</Box>
                    <Box>Note: {report.lighting_notes}</Box>
                  </Table.Cell>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {renderRating(report.structural_change_rating)}
                    <Box>Rating: {report.structural_change_rating}</Box>
                    <Box>Note: {report.structural_change_notes}</Box>
                  </Table.Cell>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {renderRating(report.cleanliness_rating)}
                    <Box>Rating: {report.cleanliness_rating}</Box>
                    <Box>Note: {report.cleanliness_notes}</Box>
                  </Table.Cell>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {report.maintenance_notes}
                  </Table.Cell>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {report.general_notes}
                  </Table.Cell>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {new Date(report.created_at).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell width="10%" textAlign="center" border="1px solid">
                    {report.feedback_status}
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={13} textAlign="center" border="1px solid">
                  {buildingId ? 'No reports available' : 'There is no report for this building'}
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Container>
  )
}

export default BuldingReports