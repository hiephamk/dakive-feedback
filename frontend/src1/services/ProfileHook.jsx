import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAccessToken from "../services/token";
import axios from "axios";


const useProfile = (userId) => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [accounts, setAccounts] = useState([]);
  const [full_name, setFullName] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profile_img, setProfileImg] = useState('')
  const [phone_number, setPhoneNumber] = useState('')
  const [birth_date, setBirthDate] = useState('')
  const [bio, setBio] = useState('')
  const [is_owner, setIsOwner] = useState(null)
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccount = async () => {
    const url = import.meta.env.VITE_ACCOUNT_URL;
  
    if (!accessToken) {
      setError("No access token available");
      return;
    }
  
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
  

    setIsLoading(true);
    setError(null);
  
    try {
      const res = await axios.get(url, config);
  
      if (Array.isArray(res.data) && res.data.length > 0) {
        const userProfile = res.data.find((profile) => profile.user === userId);
        if (userProfile) {
          setAccounts([userProfile]);
          setEmail(useProfile.email)
          setFullName(userProfile.full_name)
          setFirstName(userProfile.first_name)
          setLastName(userProfile.last_name)
          setPhoneNumber(userProfile.phone_number)
          setBirthDate(userProfile.birth_date)
          setBio(userProfile.bio)
          setProfileImg(userProfile.profile_img)
          setIsOwner(userProfile.is_owner)
        } else {
          console.error("User profile not found");
        }
      }
    } catch (error) {
      console.error("Cannot get account:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(()=> {
    if(accessToken && userInfo?.id) {
      fetchAccount()
    }
  },[accessToken, userInfo?.id])

  return {accounts,first_name, last_name, full_name, email, phone_number, profile_img, birth_date, bio,is_owner, isLoading, error}
};

export default useProfile;
