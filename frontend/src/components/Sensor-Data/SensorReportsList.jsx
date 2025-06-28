import {useEffect, useState, useRef} from 'react'
import { Center, Box, Table, Spinner, HStack, Button, InputGroup, Input, CloseButton } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import useAccessToken from "../../services/token";
import { useParams } from 'react-router-dom';
import SyncSensorReports from './SyncSensorReports';
import SyncSensorRoomData from './SyncSensorRoomData';
import formatDate from '../formatDate';
import api from '../../services/api';
import { LuSearch } from 'react-icons/lu';
import useOrganization_Membership from '../Organization/Organization_Membership_Hook';



const SensorReportsList = () => {
  const {user, userInfo} = useSelector(state => state.auth)
  const accessToken = useAccessToken(user)
  const inputRef = useRef(null);

  const [building_name, setBuildingName] = useState('')
  const [room_name, setRoomName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime]=useState('')

  const { members } = useOrganization_Membership()

  const [keyword, setKeyword] = useState('')

  const [sensorData, setSensorData] = useState([])
  const [loading, setLoading] = useState(false)

  const { buildingid, externalid} = useParams()
  
  const now = new Date();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

  const fetchSensorReport = async () => {
    if(!accessToken) return
    setLoading(true)
    const url = import.meta.env.VITE_ROOM_REPORT_SENSOR_LIST_URL 
    try {
      const res = await api.get(url, {
        headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
      })
      let filterData = Array.isArray(res.data) ? res.data : []
      if(building_name){
        filterData = filterData.filter(item => item.building_name === building_name)
      }
      if(room_name) {
        filterData = filterData.filter(item => item.room_name === room_name)
      }
      if(startTime){
        filterData = filterData.filter(item => item.created_at >= startTime)
      }
      if(endTime){
        filterData = filterData.filter(item => item.created_at <= endTime)
      }
      filterData = filterData.filter(item => {
        const createdAt = new Date(item.created_at);
        return now - createdAt <= THIRTY_DAYS;
      });
      filterData = filterData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setSensorData(filterData)

    }catch(error) {
      console.error("fetche sensor data error", error.response.data || error.message)
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    if(accessToken){
      fetchSensorReport()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[accessToken, building_name, room_name, startTime, endTime])

  useEffect(()=>{
    console.log("sensor data:", sensorData)
  },[sensorData])

  const handleClearFilter = () => {
    setBuildingName("");
    setRoomName("");
    setStartTime("");
    setEndTime("")

  }

  const handleSensorDataSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    const url = `${import.meta.env.VITE_ROOM_REPORT_SENSOR_SEARCH_URL}?keyword=${encodeURIComponent(keyword)}`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {

      const res = await api.get(url, config);
      const searchFilter = Array.isArray(res.data) ? res.data : [];
      setSensorData(searchFilter);

    } catch (error) {
      console.error('BuildingListOrg: Error searching building:', error);
      alert('Cannot search those reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event && event.key === 'Enter') {
      event.preventDefault();
      handleSensorDataSearch();
    }
  };

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (value.trim() === '') {
      fetchSensorReport();;
    }
  };

  useEffect(() => {
    if (keyword.trim() === '') {
      fetchSensorReport();
    }
  }, [keyword]);

  const endElement = keyword ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setKeyword('');
        inputRef.current?.focus();
      }}
      me="-2"
    />
  ) : undefined;

  return (
    <Box>
      {members.length > 0 &&
        members.some(
          (mem) =>
            mem.user === userInfo.id &&
            (mem.is_admin || mem.role === "editor")) 
            && (
            <Center my={"30px"}>
              <SyncSensorRoomData onSyncSuccess={fetchSensorReport} buildingid={buildingid} externalid={externalid}/>
            </Center>
      )}
      
      {loading ? (<Center><Spinner size="lg" /></Center>):(
          <Box>
            <Center>
              <HStack gap={"20px"} my={"30px"}>
                <Box my={"5px"} p={"10px"} w={"fit-content"} fontSize="16px" border={"1px solid"} rounded={"7px"}>
                  <select p={"10px"} border="1px solid" rounded="5px" name=""
                    id="building_name"
                    value={building_name}
                    onChange={(e)=>setBuildingName(e.target.value)}
                  >
                    <option p={"10px"} value="">All Buildings</option>
                    {[...new Set((Array.isArray(sensorData) ? sensorData : []).filter(item => item.building === Number(buildingid)).map(data => data.building_name))].map((uniqueItem, idx) => (
                      <option key={idx} value={uniqueItem}>
                          {uniqueItem}
                      </option>
                    ))}
                  </select>
                </Box>
                <Box my={"5px"} p={"10px"} w={"fit-content"} fontSize="16px" border={"1px solid"} rounded={"7px"}>
                  <select p={"10px"} border="1px solid" rounded="5px" name=""
                    id="room_name"
                    value={room_name}
                    onChange={(e)=>setRoomName(e.target.value)}
                  >
                    <option p={"10px"} value="">All Rooms</option>
                    {[...new Set((Array.isArray(sensorData) ? sensorData : []).filter(item=>item.building === Number(buildingid)).map(data => data.room_name))].map((uniqueItem, idx) => (
                      <option key={idx} value={uniqueItem}>
                          {uniqueItem}
                      </option>
                    ))}
                  </select>
                </Box>
                  <label htmlFor="startTime">Start Time</label>
                <Box my={"5px"} p={"10px"} w={"fit-content"} fontSize="16px" border={"1px solid"} rounded={"7px"}>
                  <select p={"10px"} border="1px solid" rounded="5px" name=""
                    id="startTime"
                    value={startTime}
                    onChange={(e)=>setStartTime(e.target.value)}
                  >
                    <option p={"10px"} value="">All Time</option>
                    {[...new Set((Array.isArray(sensorData) ? sensorData : []).filter(item=>item.building === Number(buildingid)).map(data => data.created_at))].map((uniqueItem, idx) => (
                      <option key={idx} value={uniqueItem}>
                          {formatDate(uniqueItem)}
                      </option>
                    ))}
                  </select>
                </Box>
                <label htmlFor="endTime">End Time</label>
                <Box my={"5px"} p={"10px"} w={"fit-content"} fontSize="16px" border={"1px solid"} rounded={"7px"}>
                  <select p={"10px"} border="1px solid" rounded="5px" name=""
                    id="endTime"
                    value={endTime}
                    onChange={(e)=>setEndTime(e.target.value)}
                  >
                    <option p={"10px"} value="">All Time</option>
                    {[...new Set((Array.isArray(sensorData) ? sensorData : []).filter(item=>item.building === Number(buildingid)).map(data => data.created_at))].map((uniqueItem, idx) => (
                      <option key={idx} value={uniqueItem}>
                          {formatDate(uniqueItem)}
                      </option>
                    ))}
                  </select>
                </Box>
                <Box>
                  <Button onClick={handleClearFilter}>Clear</Button>
                </Box>
                <Box>
                  <form onSubmit={handleSensorDataSearch}>
                    <InputGroup flex="1" startElement={<LuSearch />} endElement={endElement} border={'1px solid'} rounded={'5px'}>
                      <Input
                        ref={inputRef}
                        id="search"
                        type="search"
                        value={keyword}
                        onChange={handleKeywordChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter keyword to search"
                      />
                    </InputGroup>
                  </form>
                </Box> 
              </HStack>
            </Center>

            <Table.Root border={"1px solid"}>
                <Table.Header>
                  <Table.Row >
                    <Table.ColumnHeader border={"1px solid"} fontWeight={"bold"} fontSize={"18px"} textAlign={"center"}>Building Name</Table.ColumnHeader>
                    <Table.ColumnHeader border={"1px solid"} fontWeight={"bold"} fontSize={"18px"} textAlign={"center"}>Room Name</Table.ColumnHeader>
                    <Table.ColumnHeader border={"1px solid"} fontWeight={"bold"} fontSize={"18px"} textAlign={"center"}>Temperature</Table.ColumnHeader>
                    <Table.ColumnHeader border={"1px solid"} fontWeight={"bold"} fontSize={"18px"} textAlign={"center"}>Humidity</Table.ColumnHeader>
                    <Table.ColumnHeader border={"1px solid"} fontWeight={"bold"} fontSize={"18px"} textAlign={"center"}>CO2</Table.ColumnHeader>
                    <Table.ColumnHeader border={"1px solid"} fontWeight={"bold"} fontSize={"18px"} textAlign={"center"}>Light</Table.ColumnHeader>
                    <Table.ColumnHeader border={"1px solid"} fontWeight={"bold"} fontSize={"18px"} textAlign={"center"}>Motion</Table.ColumnHeader>
                    <Table.ColumnHeader border={"1px solid"} fontWeight={"bold"} fontSize={"18px"} textAlign={"center"}>Time</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sensorData.length > 0 ? (
                    sensorData
                    .filter(item => item.building === Number(buildingid))
                    .map(data => (
                        <Table.Row key={data.id}>
                          <Table.Cell border={"1px solid"}>{data.building_name}</Table.Cell>
                          <Table.Cell border={"1px solid"}>{data.room_name}</Table.Cell>
                          <Table.Cell border={"1px solid"}>{data.temperature}</Table.Cell>
                          <Table.Cell border={"1px solid"}>{data.humidity}</Table.Cell>
                          <Table.Cell border={"1px solid"}>{data.co2}</Table.Cell>
                          <Table.Cell border={"1px solid"}>{data.light}</Table.Cell>
                          <Table.Cell border={"1px solid"}>{data.motion}</Table.Cell>
                          <Table.Cell border={"1px solid"}>{formatDate(data.updated_at)}</Table.Cell>
                        </Table.Row>
                      ))
                    ):(
                      <Table.Row>
                        <Table.Cell border={"1px solid"}>No Report</Table.Cell>
                      </Table.Row>
                    )
                  }
                </Table.Body>
            </Table.Root>
      </Box>
      )}
      
    </Box>
  )
}

export default SensorReportsList