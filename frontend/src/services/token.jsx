import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'

const useAccessToken = (user) => {
  const [accessToken, setAccessToken] = useState(user?.access || null);

  const refreshAccessToken = async () => {
    const refreshUrl = `http://127.0.0.1/api/token/refresh/`;
    try {
      const res = await axios.post(refreshUrl, { refresh: user.refresh });
      setAccessToken(res.data.access);
    } catch (error) {
      console.error("Error refreshing token:", error.response || error.message);
      setAccessToken(null);
    }
  };

  useEffect(() => {
    if (!accessToken && user?.refresh) {
      refreshAccessToken();
    }
  }, [accessToken, user?.refresh]);

  return accessToken;
};
useAccessToken.propTypes = {
  user: PropTypes.shape({
    access: PropTypes.string,
    refresh: PropTypes.string,
  }).isRequired,
};
export default useAccessToken;
