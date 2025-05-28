
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import axios from 'axios';
// import { useParams } from 'react-router';

const useOrganization_Membership = () => {
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const { orgId } = useParams()

  // Fetch members
  const fetchMembers = async () => {
    if (!accessToken || !userInfo?.id) return;
    
    setLoading(true);
    setError(null);
    const url = import.meta.env.VITE_ORGANIZATION_MEMBERSHIP_LIST_URL;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.get(url, config);
      const sortedItem = response.data.sort((a, b) => a.id - b.id);
      setMembers(Array.isArray(sortedItem) ? sortedItem : sortedItem.items || []);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a member
  const deleteMember = async (id) => {
    if (!accessToken || !userInfo?.id) return false;

    setLoading(true);
    setError(null);
    const url = `${import.meta.env.VITE_ORGANIZATION_MEMBERSHIP_DELETE_URL}${id}/`;
    try {
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      // Optimistically update the state or refetch
      setMembers(members.filter((member) => member.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting member:', err);
      setError(err.response?.data?.message || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update a member
  const updateMember = async (id, data) => {
    if (!accessToken || !userInfo?.id) return false;

    setLoading(true);
    setError(null);
    const url = `${import.meta.env.VITE_ORGANIZATION_MEMBERSHIP_UPDATE_URL}${id}/`;
    try {
      const response = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      // Update the member in the state
      setMembers(
        members.map((member) =>
          member.id === id ? { ...member, ...response.data } : member
        )
      );
      return true;
    } catch (err) {
      console.error('Error updating member:', err);
      setError(err.response?.data?.message || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return {
    members,
    loading,
    error,
    deleteMember,
    updateMember
  };
};

export default useOrganization_Membership;