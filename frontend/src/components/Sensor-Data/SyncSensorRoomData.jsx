
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  HStack,
  Spinner,
  Center,
  Input,
  Text,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import useAccessToken from "../../services/token";
import { useParams } from "react-router-dom";

const SyncSensorRoomData = ({ onSyncSuccess }) => {
  const { user } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

  const { buildingid, externalid } = useParams();

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const API_KEY = "II6dsQDctGjWeoHgnT5wPjXlyJVmmUbvASnh2Zay";

  const fetchLocalRoomId = async (externalRoomId) => {
    const res = await axios.get(
      `http://localhost:8000/api/rooms/by-external/?external_id=${externalRoomId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return res.data[0]?.id;
  };

  const fetchLocalBuildingId = async (externalId) => {
    const res = await axios.get(
      `http://localhost:8000/api/buildings/by-external/?external_id=${externalId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return res.data[0]?.id;
  };

  const listRooms = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/rooms/lists/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const filtered = res.data.filter(
        (item) => item.building === Number(buildingid)
      );
      setRooms(filtered);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    listRooms();
  }, []);

  const handleSync = async () => {
    if (rooms.length === 0) return;
    if (!startTime || !endTime) {
      alert("Please select both start and end times.");
      return;
    }

    const encodedStartTime = encodeURIComponent(
      new Date(startTime).toISOString()
    );
    const encodedEndTime = encodeURIComponent(new Date(endTime).toISOString());

    setIsLoading(true);
    try {
      const localBuildingId = await fetchLocalBuildingId(externalid);
      if (!localBuildingId) {
        alert("Local building not found.");
        return;
      }

      for (const room of rooms) {
        const externalRoomId = room.external_id;

        const url = `https://iot.research.hamk.fi/api/v1/hamk/rooms/tsdata?room-id=${externalRoomId}&startTime=${encodedStartTime}&endTime=${encodedEndTime}&fields=temperature%2Chumidity%2Cco2%2Clight%2Cmotion`;

        const response = await axios.get(url, {
          headers: { "x-api-key": API_KEY },
        });

        const readings =
          response.data?.results?.[0]?.series?.[0]?.values || [];
        if (readings.length === 0) {
          console.warn(`No data for room ${externalRoomId}`);
          continue;
        }

        const localRoomId = await fetchLocalRoomId(externalRoomId);
        if (!localRoomId) {
          console.warn(`Local room not found for ${externalRoomId}`);
          continue;
        }

        for (const [time, temperature, humidity, co2, light, motion] of readings) {
          const payload = {
            room: localRoomId,
            building: localBuildingId,
            temperature,
            humidity,
            co2,
            light,
            motion: Boolean(motion),
            created_at: time,
          };

          try {
            await axios.post(
              "http://localhost:8000/api/rooms/reports/sync-data/create/",
              payload,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
          } catch (postErr) {
            console.error(
              "Error posting data:",
              postErr.response?.data || postErr.message
            );
          }
        }
      }

      // alert("All sensor data synced successfully!");
      if (onSyncSuccess) onSyncSuccess();
    } catch (err) {
      console.error("Sync error:", err);
      alert("Failed to sync sensor data.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForInput = (date) => {
    return date.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    setEndTime(formatDateForInput(now));
    setStartTime(formatDateForInput(oneHourAgo));
  }, []);

    useEffect(() => {
    if (!rooms.length || !startTime || !endTime || !accessToken) {
      return; // Don't start auto-sync until everything is ready
    }

    // Initial sync
    handleSync();

    // Set up interval for auto-sync every 10 minutes
    const interval = setInterval(() => {
      // Update end time to current time for each sync
      const now = new Date();
      setEndTime(formatDateForInput(now));
      handleSync();
    }, 600000);

    // Cleanup interval on component unmount or dependency change
    return () => clearInterval(interval);
  }, [rooms.length, accessToken]);
  return (
    <Box>
      {/* <HStack gap={'20px'} justifyContent={"space-evenly"}>
        <HStack>
          <Text>Start Time:</Text>
          <Input
            id="start"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </HStack>
        <HStack>
          <Text>End Time:</Text>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </HStack>
        <Box>
          <Button onClick={handleSync} isLoading={isLoading} colorScheme="teal">
            Sync Sensor Data
          </Button>
        </Box>
      </HStack> */}
      <Box>
        {isLoading && (
            <Center>
              <Spinner size="lg" thickness="4px" speed="0.65s" color="teal.500" />
            </Center>
          )}
      </Box>
    </Box>
  );
};

export default SyncSensorRoomData;
