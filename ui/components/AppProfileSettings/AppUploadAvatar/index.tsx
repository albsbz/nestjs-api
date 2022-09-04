import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';
import { useAuthContext } from '../../../context/authContext';
import { axiosInstance } from '../../../utils/axios';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const AppUploadAvatar = ({ avatarURL }) => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [prevAvatarURL, setPrevAvatarURL] = useState(avatarURL);
  const [imageUrl, setImageUrl] = useState<string>(user.avatarURL);

  if (avatarURL && avatarURL !== prevAvatarURL) {
    setPrevAvatarURL(avatarURL);
    setImageUrl(avatarURL);
  }

  const beforeUpload = async (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    await handleUpload(file);
    return false;
  };

  const handleUpload = (file: RcFile) => {
    const formData = new FormData();
    formData.append('file', file as RcFile);
    setLoading(true);

    // You can use any AJAX library you like
    return axiosInstance
      .post('users/avatar', formData)
      .then(({ data }) => {
        setImageUrl(data.url);

        setLoading(false);
        return;
      })
      .then(() => {
        message.success('upload successfully.');
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      // onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default AppUploadAvatar;
