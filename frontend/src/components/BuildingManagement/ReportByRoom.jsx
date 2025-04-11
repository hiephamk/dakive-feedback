import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Container, VStack, HStack, Table, Text, Flex } from '@chakra-ui/react';
import { FaFrown, FaMeh, FaSmile, FaGrin, FaGrinStars } from 'react-icons/fa';

const ReportByRoom = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [reports, setReports] = useState([]);

  const {roomId} = useParams()
  console.log("roomId:", roomId)

  const fetchRoomReport = async () => {
    if (!accessToken) return;
    const url = import.meta.env.VITE_ROOM_REPORT_LIST_URL;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if(roomId){
        const filterReport = res.data.filter((item) => item.room === Number(roomId))
        console.log('Filtered reports:', filterReport);
        setReports(filterReport);
      }else {
        setReports(res.data)
      }

    } catch (error) {
      console.error('Fetch report error:', error.response?.data || error.message);
      alert('Error fetching reports');
    }
  };


  useEffect(() => {
    if (accessToken && userInfo?.id) {
      fetchRoomReport();
    }
  }, [accessToken, roomId]);

  useEffect(() => {
    console.log('Updated reports:', reports);
  }, [reports]);

  // Feedback icons mapping
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
  // const showReport = async () =>{

  // }
  return (

    <Container maxW="100%" p={2} mx="auto" justifyContent="center">
      {
        roomId && (
          <Table.Root size="md" shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded="8">
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
          {reports.length > 0 ? (reports.map((report) => (
            <Table.Row>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {report.building_name || '-'}              
            </Table.Cell>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {report.room_name || '-'}
            </Table.Cell>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {renderRating(report.temperature_rating)}
              <Box>Rating: {report.temperature_rating}</Box>
              <Box>Note: {report.temperature_notes}</Box>
            </Table.Cell>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {renderRating(report.air_quality_rating)}
              <Box>Rating: {report.air_quality_rating}</Box>
              <Box>Note: {report.air_quality_notes}</Box>
            </Table.Cell>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {renderRating(report.draft_rating)}
              <Box>Rating: {report.draft_rating}</Box>
              <Box>Note: {report.draft_notes}</Box>
            </Table.Cell>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {renderRating(report.odor_rating)}
              <Box>Rating: {report.odor_rating}</Box>
              <Box>Note: {report.odor_notes}</Box>
            </Table.Cell>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {renderRating(report.lighting_rating)}
              <Box>Rating{report.lighting_rating}</Box>
              <Box>Note{report.lighting_notes}</Box>
            </Table.Cell>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {renderRating(report.structural_change_rating)}
              <Box>Rating: {report.structural_change_rating}</Box>
              <Box>Note:{report.structural_change_notes}</Box>
            </Table.Cell>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {renderRating(report.cleanliness_rating)}
              <Box>Rating: {report.cleanliness_rating}</Box>
              <Box>Note: {report.cleanliness_notes}</Box>
            </Table.Cell>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {report.maintenance_notes}
            </Table.Cell>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {report.general_notes}
            </Table.Cell>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {new Date(report.created_at).toLocaleDateString()}
            </Table.Cell>
            <Table.Cell width="auto" textAlign="center" border="1px solid">
              {report.feedback_status}
            </Table.Cell>
          </Table.Row>
          ))) : (
            <Table.Row>
              <Table.Cell colSpan={13} textAlign="center" border="1px solid">
                No reports available
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
        )
      }
    </Container>
  );
};

export default ReportByRoom ;