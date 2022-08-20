import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Upload } from 'antd';
import { useAuthContext } from '../../../../context/authContext';
import AppUploadAvatar from './AppUploadAvatar';

const Profile = (_) => {
  const { user } = useAuthContext();
  const onFinish = async (values) => {};
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      <h1>Profile</h1>
      <div> {JSON.stringify(user)}</div>

      <AppUploadAvatar />
    </>
  );
};
export default Profile;
