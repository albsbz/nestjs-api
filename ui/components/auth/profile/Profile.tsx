import { useAuthContext } from '../../../context/authContext';
import AppProfileSettings from '../../AppProfileSettings';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/axios';

const Profile = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState();

  let didInit = false;

  const getProfile = async () => {
    const res = await axiosInstance.get('users/profile');
    if (res?.data) {
      setProfile(res.data);
    }
  };
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      getProfile();
    }
  }, []);

  return (
    <>
      <h1>Profile</h1>
      <div> {JSON.stringify(user)}</div>

      <AppProfileSettings profile={profile} next={() => {}} />
    </>
  );
};
export default Profile;
