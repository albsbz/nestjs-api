import { useAuthContext } from '../../../../context/authContext';
import AppUploadAvatar from '../../../../components/AppProfileSettings/components/AppUploadAvatar';
import AppProfileSettings from '../../../../components/AppProfileSettings';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../utils/axios';
import { useRouter } from 'next/router';

const Profile = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState();

  let didInit = false;

  const getProfile = async () => {
    const res = await axiosInstance.get('users/profile');
    setProfile(res.data);
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
