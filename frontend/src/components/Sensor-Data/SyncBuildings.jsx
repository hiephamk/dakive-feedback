
import React, { useState } from "react";
import axios from "axios";
import { Button, Input, VStack, HStack, Box, Center} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import useAccessToken from "../../services/token";

const SyncBuildings = ({ organizationId, onSyncSuccess }) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [isLoading, setIsLoading] = useState(false);
  const [iotUrl, setIotUrl] = useState(
    "https://iot.research.hamk.fi/api/v1/hamk/buildings"
  );
  const [apiToken, setApiToken] = useState("II6dsQDctGjWeoHgnT5wPjXlyJVmmUbvASnh2Zay")

  const handleSync = async () => {
    if (!organizationId) {
      alert("Cannot sync buildings: Missing organization ID.");
      return;
    }

    if (!iotUrl) {
      alert("Please provide a valid IoT API URL.");
      return;
    }

    setIsLoading(true);
    let syncSuccessful = false;

    try {
      const response = await axios.get(iotUrl, {
        headers: {
          "x-api-key": apiToken,
        },
      });

      const buildings = Array.isArray(response.data) ? response.data : [];
      if (buildings.length === 0) {
        alert("No buildings found in the IoT system.");
        setIsLoading(false);
        return;
      }

      for (const building of buildings) {
        const payload = {
          name: `Building ${building["building-id"]}`,
          building_size: "N/A",
          street: building["street-address"],
          city: building.city,
          state: "",
          country: "Finland",
          postal_code: building["postal-code"],
          description: `Imported from IoT API (ID: ${building["building-id"]})`,
          owner: userInfo?.id || "",
          organization: organizationId,
          external_id: building["building-id"],
        };

        try {
          const url = import.meta.env.VITE_BUILDING_CREATE_URL;
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
            (postError.response?.data?.name ||
              postError.response?.data?.non_field_errors)
          ) {
            console.warn(
              `Building "${payload.name}" already exists in organization ${organizationId}, skipping.`
            );
            continue;
          } else {
            throw postError;
          }
        }
      }

      if (syncSuccessful) {
        alert("Buildings synced successfully!");
        if (onSyncSuccess) {
          onSyncSuccess();
        }
      } else {
        alert("No new buildings were synced (all buildings already exist).");
      }
    } catch (err) {
      console.error("Sync error:", err.response?.data || err.message);
      if (err.response?.status === 400) {
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
    <Center>
      <HStack spacing={4} align="stretch">
        <VStack>
          <HStack>
            <label htmlFor="url">URL: </label>
            <Input
              id="url"
              w={"50vw"}
              placeholder="Enter IoT API URL"
              value={iotUrl}
              onChange={(e) => setIotUrl(e.target.value)}
              disabled={isLoading}
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
        <Center>
          <Button
            w={"50%"}
            onClick={handleSync}
            disabled={!organizationId || isLoading}
            isLoading={isLoading}
          >
            Sync
          </Button>
        </Center>
      </HStack>
    </Center>
  );
};

export default SyncBuildings;