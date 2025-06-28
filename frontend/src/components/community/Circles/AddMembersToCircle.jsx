
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../../services/token';
import api from '../../../services/api';
import { Box, Button, HStack, Input, List, Stack, Text } from '@chakra-ui/react';

const AddMembersToCircle = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

  const [circles, setCircles] = useState([]); // List of user's circles
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const dropdownRef = useRef(null);

  const fetchCircles = async () => {
    if (!accessToken) return;

    try {
      const url = import.meta.env.VITE_COMMUNITY_CIRCLES_CREATE_URL
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userCircles = response.data.filter(
        (circle) => circle.owner === userInfo.id
      );

      setCircles(userCircles);
    } catch (error) {
      console.error('Error fetching circles:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const url = import.meta.env.VITE_COMMUNITY_CIRCLES_NOTIFICATION_URL
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCircles();
      fetchNotifications();
    }
  }, [accessToken]);

  const handleInputChange = async (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);

    if (!accessToken || keyword.trim() === '') {
      setFilteredItems([]);
      setIsDropdownVisible(false);
      return;
    }

    try {
      const url = import.meta.env.VITE_SEARCH_USER_URL
      console.log("url search:", `${url}?keyword=${keyword}`)
      const response = await api.get(`${url}?keyword=${keyword}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const items = Array.isArray(response.data) ? response.data : [];
      setFilteredItems(items);
      setIsDropdownVisible(true);
    } catch (error) {
      console.error('Error fetching items:', error);
      setFilteredItems([]);
    }
  };

  const handleItemClick = (item) => {
    if (!selectedUsers.some((user) => user.id === item.id)) {
      setSelectedUsers([...selectedUsers, item]);
    }
    setSearchTerm('');
    setIsDropdownVisible(false);
  };

  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== id));
  };

  const handleAddMembersToCircle = async () => {
    if (!accessToken) {
      console.log('Cannot get access token');
      return;
    }

    const notificationUrl = import.meta.env.VITE_COMMUNITY_CIRCLES_NOTIFICATION_URL;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    if (selectedUsers.length > 0) {
      try {
          const memberIds = selectedUsers.map((user) => user.id).filter((id) => id != null);
          for (const memberId of memberIds) {
            await api.post(
              notificationUrl,
              { receiver: memberId, sender: userInfo.id, message:`${userInfo.first_name} want to add you to the circle!`},
              config
            );
          }
          alert('New members added and notifications sent successfully!');
        fetchCircles(); // Refresh circles
        setSelectedUsers([]); // Clear selected users
      } catch (error) {
        console.error('Error adding members to circle:', error.response?.data || error.message);
      }
    }
  };
  useEffect(()=>{
    console.log("item search:", filteredItems)
  },[filteredItems])
  return (
    <Stack gap={"10px"}>
      <HStack>
          <Input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search..."
          />
          
      </HStack>
      <Box p={"10px"}>
        {isDropdownVisible && filteredItems.length > 0 && (
          <List.Root
            ref={dropdownRef}
          >
            {filteredItems.map((item) => (
              <List.Item
                key={item.id}
                onClick={() => handleItemClick(item)}
                cursor={"pointer"}
                fontStyle={"initial"}
              >
                {item.user_name}
              </List.Item>
            ))}
          </List.Root>
        )}
      </Box>
      <Box borderTop={"1px solid"} borderBottom={"1px solid"}>
        {selectedUsers.length > 0 && (
        <Box my={"10px"}>
          {selectedUsers.map((user) => (
            <HStack gap={"20px"} key={user.id} justifyContent={"space-between"}>
              <Text>{user.user_name}</Text>
              <HStack gap={"5px"}>
                <Button variant={"surface"} onClick={() => handleRemoveUser(user.id)}>×</Button>
                
              </HStack>
            </HStack>
          ))}
        </Box>
      )}
      </Box>
      <Button variant={"surface"}
        onClick={handleAddMembersToCircle}
        disabled={selectedUsers.length === 0}
      >
        Add
      </Button>
    </Stack>
  );
};

export default AddMembersToCircle;
