// import { useState, useRef, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import useAccessToken from '../../../services/token';
// import api from '../../../services/api';
// import {
//   Box,
//   Button,
//   HStack,
//   Input,
//   List,
//   Stack,
//   Text
// } from '@chakra-ui/react';

// const AddMembersToGroup = ({ groupId}) => {
//   const { user, userInfo } = useSelector((state) => state.auth);
//   const accessToken = useAccessToken(user);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [isDropdownVisible, setIsDropdownVisible] = useState(false);
//   const [selectedUsers, setSelectedUsers] = useState([]);

//   const dropdownRef = useRef(null);

//   const [formData, setFormData] = useState({
//     group: groupId,
//     member: ''
//   });

//   const handleInputChange = async (e) => {
//     const keyword = e.target.value;
//     setSearchTerm(keyword);

//     if (!accessToken || keyword.trim() === '') {
//       setFilteredItems([]);
//       setIsDropdownVisible(false);
//       return;
//     }

//     try {
//       const url = import.meta.env.VITE_SEARCH_CIRCLE_MEMBERS_URL;
//       console.log("urlsearch circle:",url)
//       const response = await api.get(`${url}?keyword=${keyword}`, {
//         headers: { Authorization: `Bearer ${accessToken}` }
//       });
//       let items = Array.isArray(response.data) ? response.data : [];
//       items = items.filter((item) => item.owner === userInfo.id);
//       console.log("item circel search:", items)
//       setFilteredItems(items);
//       setIsDropdownVisible(true);
//     } catch (error) {
//       console.error('Error fetching items:', error);
//       setFilteredItems([]);
//     }
//   };

//   const handleItemClick = (item) => {
//     if (!selectedUsers.some((user) => user.id === item.id)) {
//       setSelectedUsers([...selectedUsers, item]);
//     }
//     setSearchTerm('');
//     setIsDropdownVisible(false);
//   };

//   const handleRemoveUser = (id) => {
//     setSelectedUsers(selectedUsers.filter((user) => user.id !== id));
//   };

//   const handleAddMembersToGroup = async () => {
//     if (!accessToken) {
//       console.log('Cannot get access token');
//       return;
//     }

//     const notificationUrl = import.meta.env.VITE_COMMUNITY_GROUP_MEMBER_ADD_MEMBER_URL;
//     const config = {
//       headers: { Authorization: `Bearer ${accessToken}` }
//     };

//     if (selectedUsers.length > 0) {
//       try {
//         const memberIds = selectedUsers.map((user) => user.id).filter(Boolean);
//         for (const memberId of memberIds) {
//           const payload = {
//             ...formData,
//             member: memberId,
//           };
//           await api.post(notificationUrl, payload, config);
//         }
//         alert('New members added and notifications sent successfully!');
//         setSelectedUsers([]);
//         setFormData({
//           member: ''
//         });
//       } catch (error) {
//         console.error('Error adding members to circle:', error.response?.data || error.message);
//       }
//     }
//   };

//   useEffect(() => {
//     console.log('Filtered search results:', filteredItems);
//   }, [filteredItems]);

//   return (
//     <Stack gap="10px">
//       <Box>
//         <Input
//           type="text"
//           value={searchTerm}
//           onChange={handleInputChange}
//           placeholder="Search..."
//         />
//       </Box>

//       {/* <Box p="10px">
//         {isDropdownVisible && filteredItems.length > 0 && (
//           <List.Root ref={dropdownRef} spacing={2}>
//             {filteredItems.map((item) => {
//               const names = Array.isArray(item.member_name) ? item.member_name : [item.member_name];
//               return names.map((name, idx) => (
//                 <List.Item
//                   key={`${item.id}-${idx}`}
//                   onClick={() => handleItemClick(item)}
//                   cursor="pointer"
//                   fontStyle="initial"
//                   _hover={{ background: 'gray.100' }}
//                   p={2}
//                   borderRadius="md"
//                 >
//                   {name}
//                 </List.Item>
//               ));
//             })}
//           </List.Root>
//         )}
//       </Box> */}
//       <Box p="10px">
//         {isDropdownVisible && filteredItems.length > 0 && (
//           <List.Root ref={dropdownRef} spacing={2}>
//             {(() => {
//               const uniqueNames = new Set();
//               const uniqueItems = [];
              
//               filteredItems.forEach((item) => {
//                 const names = Array.isArray(item.member_name) ? item.member_name : [item.member_name];
//                 names.forEach((name) => {
//                   if (!uniqueNames.has(name)) {
//                     uniqueNames.add(name);
//                     uniqueItems.push({ ...item, displayName: name });
//                   }
//                 });
//               });
              
//               return uniqueItems.map((item, idx) => (
//                 <List.Item
//                   key={`${item.id}-${item.displayName}-${idx}`}
//                   onClick={() => handleItemClick(item)}
//                   cursor="pointer"
//                   fontStyle="initial"
//                   _hover={{ background: 'gray.100' }}
//                   p={2}
//                   borderRadius="md"
//                 >
//                   {item.displayName}
//                 </List.Item>
//               ));
//             })()}
//           </List.Root>
//         )}
//       </Box>


//       <Box borderTop="1px solid" pt={4}>
//         {selectedUsers.length > 0 && (
//           <Box my="10px">
//             {selectedUsers.map((member) => (
//               <HStack key={member.id} justifyContent="space-between">
//                 <List.Root>
//                   {(Array.isArray(member.member_name) ? member.member_name : [member.member_name]).map((name, idx) => (
//                     <List.Item key={idx}>{name}</List.Item>
//                   ))}
//                 </List.Root>
//                 <HStack gap="5px">
//                   <Button size="sm" onClick={() => handleRemoveUser(member.id)}>
//                     ×
//                   </Button>
                  
//                 </HStack>
//               </HStack>
//             ))}
//           </Box>
//         )}
//       </Box>
//       <Button
//         size="sm"
//         colorScheme="blue"
//         onClick={handleAddMembersToGroup}
//         disabled={selectedUsers.length === 0}
//       >
//         Add
//       </Button>
//     </Stack>
//   );
// };

// export default AddMembersToGroup;

import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../../services/token';
import api from '../../../services/api';
import {
  Box,
  Button,
  HStack,
  Input,
  List,
  Stack,
  Text
} from '@chakra-ui/react';

const AddMembersToGroup = ({ groupId}) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    group: groupId,
    member: ''
  });

  const handleInputChange = async (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    if (!accessToken || keyword.trim() === '') {
      setFilteredItems([]);
      setIsDropdownVisible(false);
      return;
    }
    try {
      const url = import.meta.env.VITE_SEARCH_CIRCLE_MEMBERS_URL;
      console.log("urlsearch circle:",url)
      const response = await api.get(`${url}?keyword=${keyword}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      let items = Array.isArray(response.data) ? response.data : [];
      items = items.filter((item) => item.owner === userInfo.id);
      console.log("item circel search:", items)
      setFilteredItems(items);
      setIsDropdownVisible(true);
    } catch (error) {
      console.error('Error fetching items:', error);
      setFilteredItems([]);
    }
  };

  // Modified to handle the specific name that was clicked
  const handleItemClick = (item) => {
    // Create a unique identifier for the selected user+name combination
    const selectedItem = {
      ...item,
      selectedName: item.displayName, // This comes from the dropdown
      uniqueId: `${item.id}-${item.displayName}` // Unique identifier
    };
    
    // Check if this specific name is already selected
    if (!selectedUsers.some((user) => user.uniqueId === selectedItem.uniqueId)) {
      setSelectedUsers([...selectedUsers, selectedItem]);
    }
    setSearchTerm('');
    setIsDropdownVisible(false);
  };

  // Fixed to use the correct ID
  const handleRemoveUser = (uniqueId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.uniqueId !== uniqueId));
  };

  const handleAddMembersToGroup = async () => {
  if (!accessToken) {
    console.log('Cannot get access token');
    return;
  }
  
  const notificationUrl = import.meta.env.VITE_COMMUNITY_GROUP_MEMBER_ADD_MEMBER_URL;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
  
  if (selectedUsers.length > 0) {
    try {
      const uniqueMemberIds = [...new Set(selectedUsers.map((user) => user.id))];
      
      console.log('=== DEBUG INFO ===');
      console.log('Group ID:', groupId);
      console.log('Selected Users:', selectedUsers);
      console.log('Unique Member IDs:', uniqueMemberIds);
      console.log('Form Data:', formData);
      
      for (const memberId of uniqueMemberIds) {
        const payload = {
          ...formData,
          member: memberId,
        };
        
        console.log('Sending payload:', payload);
        console.log('To URL:', notificationUrl);
        
        try {
          const response = await api.post(notificationUrl, payload, config);
          console.log('Success response:', response.data);
        } catch (error) {
          console.error('Error for member:', memberId);
          console.error('Error details:', error.response?.data);
          console.error('Error status:', error.response?.status);
        }
      }
      
    } catch (error) {
      console.error('Overall error:', error.response?.data || error.message);
    }
  }
};

  useEffect(() => {
    console.log('Filtered search results:', filteredItems);
  }, [filteredItems]);

  return (
    <Stack gap="10px">
      <Box>
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search..."
        />
      </Box>

      <Box p="10px">
        {isDropdownVisible && filteredItems.length > 0 && (
          <List.Root ref={dropdownRef} spacing={2}>
            {(() => {
              const uniqueNames = new Set();
              const uniqueItems = [];
              
              filteredItems.forEach((item) => {
                const names = Array.isArray(item.member_name) ? item.member_name : [item.member_name];
                names.forEach((name) => {
                  if (!uniqueNames.has(name)) {
                    uniqueNames.add(name);
                    uniqueItems.push({ ...item, displayName: name });
                  }
                });
              });
              
              return uniqueItems.map((item, idx) => (
                <List.Item
                  key={`${item.id}-${item.displayName}-${idx}`}
                  onClick={() => handleItemClick(item)}
                  cursor="pointer"
                  fontStyle="initial"
                  _hover={{ background: 'gray.100' }}
                  p={2}
                  borderRadius="md"
                >
                  {item.displayName}
                </List.Item>
              ));
            })()}
          </List.Root>
        )}
      </Box>

      <Box borderTop="1px solid" pt={4}>
        {selectedUsers.length > 0 && (
          <Box my="10px">
            {selectedUsers.map((member) => (
              <HStack key={member.uniqueId} justifyContent="space-between">
                {/* Display only the selected name */}
                <Text>{member.selectedName}</Text>
                <HStack gap="5px">
                  <Button size="sm" onClick={() => handleRemoveUser(member.uniqueId)}>
                    ×
                  </Button>
                </HStack>
              </HStack>
            ))}
          </Box>
        )}
      </Box>

      <Button
        size="sm"
        colorScheme="blue"
        onClick={handleAddMembersToGroup}
        disabled={selectedUsers.length === 0}
      >
        Add
      </Button>
    </Stack>
  );
};

export default AddMembersToGroup;
