// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Button, HStack, Input, VStack,Center, Box, Flex } from "@chakra-ui/react";
// import { useSelector } from "react-redux";
// import useAccessToken from "../../services/token";
// import { useParams } from "react-router-dom";

// const SyncSensorReports = ({ onSyncSuccess }) => {
//   const { user } = useSelector((state) => state.auth);
//   const accessToken = useAccessToken(user);

//   const [rooms, setRooms ] = useState([])
//   const [selectedRoomId, setSelectedRoomId ] = useState(null)
//   const { id } = useParams();

//   // const [iotRoomId, setIotRoomId] = useState("");
//   // const [startTime, setStartTime] = useState("2025-06-02T00:00:00Z");
//   // const [endTime, setEndTime] = useState("2025-06-02T01:00:00Z");
//   const [isLoading, setIsLoading] = useState(false);



//   const API_KEY = 'II6dsQDctGjWeoHgnT5wPjXlyJVmmUbvASnh2Zay';

//   const listRooms = async () => {
//     const url = `https://iot.research.hamk.fi/api/v1/hamk/rooms?building-id=${id}`;
//     try {
//       const res = await axios.get(url, {
//         headers: {
//           'x-api-key': API_KEY
//         }
//       });
//       setRooms(res.data);
//     } catch (error) {
//       console.error('Error fetching rooms:', error.response?.status || error.message);
//     }
//   };
  
//   useEffect(() => {
//     listRooms()
//   },[])

//   useEffect(() => {
//     const roomlist = rooms.map(room => room['room-id'])
//     for (const roomId of roomlist){
//       setSelectedRoomId(roomId)
//     }
//   },[])
//   const handleSync = async () => {
//     setIsLoading(true);

//     try {
//       const url = `https://iot.research.hamk.fi/api/v1/hamk/rooms/tsdata?room-id=${selectedRoomId}&startTime=2025-06-02T00%3A00%3A00Z&endTime=2025-06-02T01%3A00%3A00Z&fields=temperature%2Chumidity%2Cco2%2Clight%2Cmotion`;

//       const response = await axios.get(url, {
//         headers: {
//           "x-api-key": "II6dsQDctGjWeoHgnT5wPjXlyJVmmUbvASnh2Zay",
//         },
//       });

//       const readings = response.data?.results?.[0]?.series?.[0]?.values || [];

//       if (readings.length === 0) {
//         alert("No sensor data found.");
//         return;
//       }

//       for (const [time, temperature, humidity, co2, light, motion] of readings) {
//         const payload = {
//           room: selectedRoomId,
//           building: Number(id),
//           temperature: temperature,
//           humidity: humidity,
//           co2: co2,
//           light:light,
//           motion: Boolean(motion),
//           created_at: time,
//         };

//         try {
//           await axios.post("http://localhost:8000/api/rooms/reports/create/", payload, {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//               "Content-Type": "application/json",
//             },
//           });
//           if (onSyncSuccess) onSyncSuccess();
//         } catch (postErr) {
//           console.error("Error posting data:", postErr.response?.data || postErr.message);
//         }
//       }

//       alert("Sensor data synced successfully!");
//     } catch (err) {
//       console.error("Fetch error:", err.response?.data || err.message);
//       alert("Failed to fetch IoT sensor data.");
//     } finally {
//       setIsLoading(false);
//     }
//   };
// //   function toDatetimeLocal(isoString) {
// //   const date = new Date(isoString);
// //   const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
// //   return offsetDate.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
// // }

//   return (
//     <VStack spacing={4} align="stretch">
//       {/* <input
//         type="datetime-local"
//         value={toDatetimeLocal(startTime)} // Convert from ISO
//         onChange={(e) => {
//           const localDate = new Date(e.target.value);
//           const iso = localDate.toISOString(); // Convert back to ISO with Z
//           setEndTime(iso);
//         }}
//       />
//       <input
//         type="datetime-local"
//         value={toDatetimeLocal(endTime)} // Convert from ISO
//         onChange={(e) => {
//           const localDate = new Date(e.target.value);
//           const iso = localDate.toISOString(); // Convert back to ISO with Z
//           setEndTime(iso);
//         }}
//       /> */}
//       <Button onClick={handleSync} isLoading={isLoading}>
//         Sync Sensor Data
//       </Button>
//     </VStack>
//   );
// };

// export default SyncSensorReports;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, VStack, Spinner, Center} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import useAccessToken from "../../services/token";
import { useParams } from "react-router-dom";

const SyncSensorReports = ({ onSyncSuccess }) => {
  const { user } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  
  const { id: externalBuildingId } = useParams();

  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = 'II6dsQDctGjWeoHgnT5wPjXlyJVmmUbvASnh2Zay';

  const fetchLocalRoomId = async (externalRoomId) => {
    const res = await axios.get(`http://localhost:8000/api/rooms/by-external/?external_id=${externalRoomId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data[0]?.id;
  };

  const fetchLocalBuildingId = async (externalId) => {
    const res = await axios.get(`http://localhost:8000/api/buildings/by-external/?external_id=${externalId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data[0]?.id;
  };

  const listRooms = async () => {
    try {
      const res = await axios.get(`https://iot.research.hamk.fi/api/v1/hamk/rooms?building-id=${externalBuildingId}`, {
        headers: { "x-api-key": API_KEY },
      });
      setRooms(res.data);
      if (res.data.length > 0) setSelectedRoomId(res.data[0]["room-id"]);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    listRooms();
  }, []);

  // const handleSync = async () => {
  //   if (!selectedRoomId) return;

  //   setIsLoading(true);
  //   try {
  //     const url = `https://iot.research.hamk.fi/api/v1/hamk/rooms/tsdata?room-id=${selectedRoomId}&startTime=2025-06-02T00%3A00%3A00Z&endTime=2025-06-02T01%3A00%3A00Z&fields=temperature%2Chumidity%2Cco2%2Clight%2Cmotion`;
  //     const response = await axios.get(url, { headers: { "x-api-key": API_KEY } });

  //     const readings = response.data?.results?.[0]?.series?.[0]?.values || [];
  //     if (readings.length === 0) {
  //       alert("No sensor data found.");
  //       return;
  //     }

  //     const localRoomId = await fetchLocalRoomId(selectedRoomId);
  //     const localBuildingId = await fetchLocalBuildingId(externalBuildingId);
  //     console.log("local Room:", localRoomId)
  //     console.log("local Building:", localBuildingId)
  //     if (!localRoomId || !localBuildingId) {
  //       alert("Local room/building not found in backend.");
  //       return;
  //     }

  //     for (const [time, temperature, humidity, co2, light, motion] of readings) {
  //       const payload = {
  //         room: localRoomId,
  //         building: localBuildingId,
  //         temperature,
  //         humidity,
  //         co2,
  //         light,
  //         motion: Boolean(motion),
  //         created_at: time,
  //       };

  //       try {
  //         await axios.post("http://localhost:8000/api/rooms/reports/sync-data/create/", payload, {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //             "Content-Type": "application/json",
  //           },
  //         });
  //       } catch (postErr) {
  //         console.error("Error posting data:", postErr.response?.data || postErr.message);
  //       }
  //     }

  //     alert("Sensor data synced successfully!");
  //     if (onSyncSuccess) onSyncSuccess();
  //   } catch (err) {
  //     console.error("Fetch error:", err);
  //     alert("Failed to fetch sensor data.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSync = async () => {
  if (rooms.length === 0) return;

  setIsLoading(true);
  try {
    const localBuildingId = await fetchLocalBuildingId(externalBuildingId);
    if (!localBuildingId) {
      alert("Local building not found in backend.");
      return;
    }

    for (const room of rooms) {
      const roomExternalId = room["room-id"];

      // 1. Fetch sensor readings for this room
      const url = `https://iot.research.hamk.fi/api/v1/hamk/rooms/tsdata?room-id=${roomExternalId}&startTime=2025-06-02T00%3A00%3A00Z&endTime=2025-06-02T01%3A00%3A00Z&fields=temperature%2Chumidity%2Cco2%2Clight%2Cmotion`;
      const response = await axios.get(url, {
        headers: { "x-api-key": API_KEY },
      });

      const readings = response.data?.results?.[0]?.series?.[0]?.values || [];
      if (readings.length === 0) {
        console.warn(`No data found for room: ${roomExternalId}`);
        continue;
      }

      // 2. Map external room ID to local room ID
      const localRoomId = await fetchLocalRoomId(roomExternalId);
      if (!localRoomId) {
        console.warn(`Local room not found for external ID: ${roomExternalId}`);
        continue;
      }

      // 3. Sync each reading to the backend
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
          console.error("Error posting data:", postErr.response?.data || postErr.message);
        }
      }
    }

    alert("All sensor data synced successfully!");
    if (onSyncSuccess) onSyncSuccess();
  } catch (err) {
    console.error("Sync error:", err);
    alert("Failed to sync some or all sensor data.");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <VStack spacing={4} align="stretch">
      <Button onClick={handleSync} isLoading={isLoading}>
        Sync Sensor Report
      </Button>
        {isLoading && (
        <Center>
          <Spinner size="lg" thickness="4px" speed="0.65s" color="teal.500" />
        </Center>
      )}
    </VStack>
  );
};

export default SyncSensorReports;
