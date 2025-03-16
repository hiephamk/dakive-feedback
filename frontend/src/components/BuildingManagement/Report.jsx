import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import useAccessToken from '../../services/token'
import axios from 'axios'
import {Box, Container, HStack, Table, Text, Flex} from '@chakra-ui/react'

const Report = () => {
  const {user, userInfo} = useSelector(state => state.auth)
  const accessToken = useAccessToken(user)

  const [reports, setReports] = useState([])

  const fetchRoomReport = async () => {
    if(!accessToken) return
    const url = import.meta.env.VITE_ROOM_REPORT_LIST_URL
    try {
      const res = await axios.get(url,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      // const report_filter = res.data.filter(re => re.buildin.owner === userInfo?.id)
      setReports(res.data)
    }catch(error){
      console.error("fetch report:", error.response?.data || error.message)
      alert("fetch report error")
    }
  }

  useEffect(() =>{
    if(accessToken && userInfo?.id){
      fetchRoomReport()
    }
  },[accessToken, userInfo?.id])

  useEffect(() => {
    console.log("Updated reports:", reports);
  }, [reports]);
  
  return (
    <Container>
      <Container p={5} >
      <Table.Root size="md" shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded="8">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">Building Name</Table.ColumnHeader>
            <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">Room Name</Table.ColumnHeader>
            <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">Room status</Table.ColumnHeader>
            <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">Heat</Table.ColumnHeader>
            <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">Electric</Table.ColumnHeader>
            <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">Internet</Table.ColumnHeader>
            <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">Air Condition</Table.ColumnHeader>
            <Table.ColumnHeader fontWeight="bold" fontSize="16px" border="1px solid" textAlign="center">Report Date</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {reports.length > 0 && (
            reports.map((report) => (
              <Table.Row key={report.id}>
                <Table.Cell width="12%" textAlign="center" border="1px solid">{report.building_name}</Table.Cell>
                <Table.Cell width="12%" textAlign="center" border="1px solid">{report.room_name}</Table.Cell>
                <Table.Cell width="12%" textAlign="center" border="1px solid">{report.room_status}</Table.Cell>
                <Table.Cell width="12%" textAlign="center" border="1px solid">{report.heat_status}</Table.Cell>
                <Table.Cell width="12%" textAlign="center" border="1px solid">{report.electric_status}</Table.Cell>
                <Table.Cell width="12%" textAlign="center" border="1px solid">{report.internet_status}</Table.Cell>
                <Table.Cell width="12%" textAlign="center" border="1px solid">{report.air_status}</Table.Cell>
                <Table.Cell width="12%" textAlign="center" border="1px solid">{new Date(report.created_at).toLocaleDateString()}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Container>
    </Container>
  )
}

export default Report