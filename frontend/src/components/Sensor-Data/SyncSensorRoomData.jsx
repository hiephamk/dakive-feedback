
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

const SyncSensorRoomData = ({ onSyncSuccess, buildingid, roomid, created_at }) => {
  const { user } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

  // const { buildingid, externalid } = useParams();

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const API_KEY = "II6dsQDctGjWeoHgnT5wPjXlyJVmmUbvASnh2Zay"

  const listRooms = async () => {
    const url = import.meta.env.VITE_ROOM_LIST_URL
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const filtered = res.data.filter(
        (item) => (item.building === Number(buildingid)) && (item.id === Number(roomid))
      );
      setRooms(filtered);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    listRooms();
  }, [roomid, buildingid, accessToken]);


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
      for (const room of rooms) {
        const externalRoomId = room.external_id;

        const url = `https://iot.research.hamk.fi/api/v1/hamk/rooms/tsdata?room-id=${externalRoomId}&startTime=${encodedStartTime}&endTime=${encodedEndTime}&fields=temperature%2Chumidity%2Cco2%2Clight%2Cmotion`;

        const response = await axios.get(url, {
          headers: { "x-api-key": API_KEY },
        });
        console.log("Iot Data: ", response.data)
        let readings = response.data?.results?.[0]?.series?.[0]?.values || [];
        readings= readings.find(s => {
          const sensorTime = new Date(s[0]).getTime() + 180*60*1000;
          const reportTime = new Date(created_at).getTime();
          const timeDiff = Math.abs(sensorTime - reportTime) / (1000 * 60);
          return timeDiff <= 15;
        })
        console.log("Filter Readings ", readings)

        // if (readings.length === 0) {
        //   console.warn(`No data for room ${externalRoomId}`);
        //   continue;
        // }

        // for (const [time, temperature, humidity, co2, light, motion] of readings) {

          // const payload = {
          //   room: roomid,
          //   building: buildingid,
          //   temperature,
          //   humidity,
          //   co2,
          //   light,
          //   motion: Boolean(motion),
          //   created_at: time
          // };
          const payload = {
            room: roomid,
            building: buildingid,
            temperature: readings[1],
            humidity: readings[2],
            co2: readings[3] ?? null,
            light: readings[4] ?? 0, // fallback to 0 if null
            motion: readings[5] ?? false,
            created_at: new Date(readings[0]).toISOString().split(".")[0] + "Z",
          };
          try {
            const url = import.meta.env.VITE_ROOM_REPORT_SENSOR_CREATE_URL
            await axios.post(
              url,
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
        // }
      }

      // alert("All sensor data synced successfully!");
      if (onSyncSuccess) onSyncSuccess();
    } catch (err) {
      console.error("Sync error:", err);
      // alert("Failed to sync sensor data.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForInput = (date) => {
    return date.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const now = new Date();
    const syncTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    setEndTime(formatDateForInput(now));
    setStartTime(formatDateForInput(syncTime));
  }, []);

  useEffect(() => {
    if (!rooms.length || !startTime || !endTime || !accessToken) {
      return; // Don't start auto-sync until everything is ready
    }

    handleSync();

    // const interval = setInterval(() => {
    //   // Update end time to current time for each sync
    //   const now = new Date();
    //   setEndTime(formatDateForInput(now));
    //   handleSync();
    // }, 1000);

    // return () => clearInterval(interval);

  }, [roomid,rooms, buildingid, accessToken, created_at]);

  return (
    <Box>
      <Box>
        {isLoading && (
            <Center>
              <Spinner size="sm" thickness="4px" speed="0.65s" color="teal.500" />
            </Center>
          )}
      </Box>

      {/* <Button onClick={handleSync} isLoading={isLoading}>
        Sync Sensor Report
      </Button> */}
    </Box>
  );
};

export default SyncSensorRoomData;
