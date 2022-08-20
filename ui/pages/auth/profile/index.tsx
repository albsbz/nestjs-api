import React from 'react';
import BasicLayout from '../../../layouts/BasicLayout';
import Profile from './components/Profile';

function ProfilePage() {
  return <Profile />;
}

ProfilePage.getLayout = (page) => {
  return <BasicLayout needAuth>{page}</BasicLayout>;
};

export default ProfilePage;
