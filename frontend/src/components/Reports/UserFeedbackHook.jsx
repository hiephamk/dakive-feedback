
import { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import api from '../../services/api';

const UserFeedbackHook = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const [reports, setReports] = useState([]);
  const [reportChart, setReportChart] = useState([]);

  const fetchRoomReport = async () => {
    if (!accessToken) return;
    const url = import.meta.env.VITE_ROOM_REPORT_LIST_URL;
    try {
      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      setReports(res.data);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Please login again.");
      } else {
        console.error(error);
      }
    }
  };

  const fetchAnalytics = async () => {
    if (!accessToken) return;
    const url = import.meta.env.VITE_ROOM_REPORT_ANALYTICS_URL;
    try {
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    setReportChart(response.data)
    // console.log("response.data", response.data)
    } catch (error) {
      if(error.response && error.response.status === 401) {
          alert("Please login again.");
      }else {
          console.error(error);
      }
    } 
  };

  useEffect(() => {
    if (accessToken) {
      fetchAnalytics();
    }
  }, [accessToken, userInfo?.id]);

  useEffect(() => {
    if (accessToken && userInfo?.id) {
      fetchRoomReport();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, userInfo?.id]);

  // useEffect(()=>{
  //   console.log("report-chart-hook:", reportChart)
  // },[reportChart])

  return {reports, reportChart}
};

export default UserFeedbackHook;