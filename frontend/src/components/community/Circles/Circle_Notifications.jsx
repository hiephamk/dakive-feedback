import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useAccessToken from "../../../services/token";
import { Box, Button, Heading, List, Text } from "@chakra-ui/react";

const Circle_Notifications = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const url = `http://127.0.0.1:8000/api/circles/notifications/`;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await axios.get(url, config);
        const filter = response.data.filter(
            (notif) => notif.receiver == userInfo.id
          );
          
        setNotifications(filter);
        console.log("notify: ", notifications)
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
      if(accessToken){

        fetchNotifications();
      }
  }, [accessToken, userInfo.id]);

  const handleAction = async (notifId, action) => {
    const url = `http://127.0.0.1:8000/api/circles/notifications/actions/${action}/`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  
    const data = {
      sender: notifications.sender,
      receiver: userInfo.id,
      message:'hello'
    };
  
    try {
      const response = await axios.post(url, data, config);
      //alert(response.data.detail);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== notifId)
      );
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        alert(error.response.data.detail || "An error occurred");
      } else {
        console.error("Error:", error.message);
      }
    }
  };
  

  return (
    <Box>
      <Box>
        <List.Root>
          <List.Item>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <Box key={notif.id}>
                    { !notif.is_handled && (
                      <Box style={{display:'flex', textAlign:'center'}}>
                      <Box className="m-1"><strong>{notif.sender_name}:</strong></Box>
                      <Box>
                        <Button
                          className=" m-1"
                          onClick={() => handleAction(notif.id, "approve")}>
                            <strong>Accept</strong>
                        </Button>
                        <Button
                            className="m-1"
                            onClick={() => handleAction(notif.id, "reject")}
                        >
                            <strong>Reject</strong>
                        </Button>
                      </Box>
                      </Box>
                    )
                    }
                  </Box>
                ))
              ) : (
                <Text>No notifications</Text>
              )}
          </List.Item>
        </List.Root>
      </Box>
    </Box>
  );
}
export default Circle_Notifications;
