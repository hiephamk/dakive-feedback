
import React, { useState } from "react";
import axios from "axios";
import { Button, HStack, Input, VStack,Center, Box, Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import useAccessToken from "../../services/token";


const SyncRooms = ({ iotBuildingId, localBuildingId, onSyncSuccess }) => {
  const { user } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

  
  const [isLoading, setIsLoading] = useState(false);
  const [iotApiUrl, setIotApiUrl] = useState("https://iot.research.hamk.fi/api/v1/hamk/rooms");
  const [apiToken, setApiToken] = useState("II6dsQDctGjWeoHgnT5wPjXlyJVmmUbvASnh2Zay")

  const handleSync = async () => {
    if (!iotBuildingId || !localBuildingId) {
      alert("Cannot sync rooms: Missing IoT or local building ID.");
      return;
    }

    if (!iotApiUrl) {
      alert("Please enter a valid IoT API URL.");
      return;
    }

    setIsLoading(true);
    let syncSuccessful = false;

    try {
      const fullUrl = `${iotApiUrl}?building-id=${iotBuildingId}`;
      const response = await axios.get(fullUrl, {
        headers: {
          "x-api-key": apiToken
        },
      });

      const rooms = Array.isArray(response.data) ? response.data : [];
      if (rooms.length === 0) {
        alert("No rooms found for this building in the IoT system.");
        setIsLoading(false);
        return;
      }

      for (const room of rooms) {
        const payload = {
          name: room.room,
          room_size: "N/A",
          floor: Number(room.floor),
          description: room.description || "",
          building: Number(localBuildingId),
          external_id: room["room-id"],
        };

        try {
          const url = import.meta.env.VITE_ROOM_CREATE_URL;
          await axios.post(url, payload, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });
          syncSuccessful = true;
        } catch (postError) {
          if (
            postError.response?.status === 400 &&
            (postError.response?.data?.name || postError.response?.data?.non_field_errors)
          ) {
            console.warn(`Room "${room.room}" already exists in building ${localBuildingId}, skipping.`);
            continue;
          } else {
            throw postError;
          }
        }
      }

      if (syncSuccessful) {
        alert("Rooms synced successfully!");
        if (onSyncSuccess) onSyncSuccess();
      } else {
        alert("No new rooms were synced (all rooms already exist).");
      }
    } catch (err) {
      console.error("Sync error:", err.response?.data || err.message);
      if (err.response?.data?.error === "building-id not found") {
        alert(`Sync failed: IoT Building ID "${iotBuildingId}" not found.`);
      } else if (err.response?.status === 400 && err.response?.data?.building) {
        alert(`Sync failed: Invalid local building ID "${localBuildingId}".`);
      } else if (err.response?.status === 400) {
        const errorMessage =
          err.response.data.non_field_errors?.[0] ||
          err.response.data.name?.[0] ||
          "This name already exists";
        alert(`Sync failed: ${errorMessage}`);
      } else {
        alert("Sync failed: An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center mt={"20px"}>
      <HStack spacing={4} align="stretch" w={"70%"}>
        <VStack>
          <HStack w={"100%"}>
            <label htmlFor="url">URL</label>
            <Input
              id="url"
              placeholder="Enter IoT API base URL"
              value={iotApiUrl}
              onChange={(e) => setIotApiUrl(e.target.value)}
              disabled={isLoading}
              border={"1px solid"}
              shadow="3px 3px 15px 5px rgb(75, 75, 79)"
            />
          </HStack>
          <HStack>
            <label htmlFor="api-token">API-Token </label>
            <Input
              id="api-token"
              w={"50vw"}
              placeholder="Enter api-token"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              disabled={isLoading}
            />
          </HStack>
        </VStack>
        <Button
          onClick={handleSync}
          disabled={!iotBuildingId || !localBuildingId || isLoading}
          isLoading={isLoading}
        >
          Sync Rooms
        </Button>
      </HStack>
    </Center>

  );
};

export default SyncRooms;
