import React from 'react';
import { useAuthContext } from '../../../context/authContext';
import BasicLayout from '../../../layouts/BasicLayout';

function Profile() {
  const { user } = useAuthContext();

  return (
    <>
      <h1>Profile</h1>
      <div> {JSON.stringify(user)}</div>
    </>
  );
}

Profile.getLayout = (page) => {
  return <BasicLayout needAuth>{page}</BasicLayout>;
};

export default Profile;
