import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../services/token';
import axios from 'axios';
import { Box, Input, Textarea, VStack, Stack, FileUpload, Icon, Button, Heading, Center, HStack, AbsoluteCenter, Square, Container } from '@chakra-ui/react';
import { LuUpload } from "react-icons/lu";
import { useNavigate } from 'react-router';

const UpdateProfile = () => {
  const { user, userInfo } = useSelector(state => state.auth);
  const accessToken = useAccessToken(user);
  const navigate = useNavigate()

  const [accounts, setAccounts] = useState([]);
  const [profile_img, setProfileImg] = useState(null);
  const [birth_date, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [accountId, setAccountId] = useState(null);

  const fetchAccount = async () => {
    const url = import.meta.env.VITE_ACCOUNT_URL;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const accountFilter = response.data.find((account) => account.user === userInfo?.id);
      if (accountFilter) {
        setAccounts([accountFilter]);
        // setAccountId(accountFilter.id);
        setPhoneNumber(accountFilter.phone_number || '');
        setBirthDate(accountFilter.birth_date || '');
        setBio(accountFilter.bio || ''); 
        setProfileImg(accountFilter.profile_img || null); 
        setAccountId(accountFilter.id);
      }
    } catch (error) {
      console.error("Cannot fetch account", error);
      alert("Cannot fetch account");
    }
  };

  useEffect(() => {
    if (userInfo?.id && accessToken) {
      fetchAccount();
    }
  }, [userInfo?.id, accessToken]);

  const handleUpdateProfile = async (accountId) => {
    if (!accessToken || !user) {
      alert("Please login again to update profile");
      return;
    }
    const url = `${import.meta.env.VITE_UPDATE_ACCOUNT_URL}${accountId}/`;
    const formData = new FormData();
    formData.append('user', userInfo.id);
    formData.append('phone_number', phone_number);
    formData.append('birth_date', birth_date);
    formData.append('bio', bio);

    if (profile_img instanceof File) {
      formData.append('profile_img', profile_img);
    }

    try {
      await axios.put(url, formData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      setPhoneNumber('');
      setBio('');
      setBirthDate('');
      setProfileImg(null);
      navigate("/home/profile")
    } catch (error) {
      console.error("Update was not successful", error);
      alert("Update was not successful");
    }
  };

  return (
    <Container my={20} boxSizing="border-box" justifyContent={"center"} alignContent={"center"}> 
      <Center>
        <VStack w={"50%"} shadow="1px 1px 15px 5px rgb(75, 75, 79)" rounded={8}>
          <Heading textAlign="center" my={4} px={2} fontWeight="bold" fontSize="24px" maxW="70%">
            Update your information
          </Heading>
          <VStack width="70%">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <Box key={account.id} width="80%" p={8}>
                  {accountId === account.id ? (
                      <VStack >
                        <Input
                          type="text"
                          placeholder="Phone number"
                          value={phone_number}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <Input
                          type="date"
                          placeholder="Birth date"
                          value={birth_date}
                          onChange={(e) => setBirthDate(e.target.value)}
                        />
                        <Textarea
                          placeholder="About me"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                        {/* <Box>
                          <input
                              type="file"
                              id="file"
                              accept="image/*"
                              onChange={(e) => setProfileImg(e.target.files[0])}
                          />
                      </Box> */}
        
                        <FileUpload.Root
                          maxW="xl"
                          alignItems="stretch"
                          maxFiles={1}
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={(e) => setProfileImg(e.target.files[0])}
                        >
                          <FileUpload.HiddenInput />
                          <FileUpload.Dropzone>
                            <Icon size="md" color="fg.muted">
                              <LuUpload />
                            </Icon>
                            <FileUpload.DropzoneContent>
                              <Box>Drag and drop files here</Box>
                              <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                            </FileUpload.DropzoneContent>
                          </FileUpload.Dropzone>
                          <FileUpload.List />
                        </FileUpload.Root>
                        <Button onClick={() => handleUpdateProfile(account.id)}>Update</Button>
                        {profile_img && (
                          <Box>
                              <strong>Selected file:</strong> {profile_img.name}
                          </Box>
                      )}
                      </VStack>
                  ) : (
                    <Box>No account</Box>
                  )}
                </Box>
              ))
            ) : (
              <Box>No accounts found</Box>
            )}
          </VStack>
        </VStack>
      </Center>
    </Container>
  );
};

export default UpdateProfile;
