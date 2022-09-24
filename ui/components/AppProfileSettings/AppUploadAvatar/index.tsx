import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import axios from 'axios';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { IUploadFileData } from '../../../common/interface/IUploadFileData';
import { useAuthContext } from '../../../context/authContext';
import { axiosInstance } from '../../../utils/axios';
import { AWS } from '../../../utils/constants';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const AppUploadAvatar = ({ avatarURL }) => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [prevAvatarURL, setPrevAvatarURL] = useState(avatarURL);
  const [uploadData, setUploadData] = useState<IUploadFileData>();
  const [imageUrl, setImageUrl] = useState<string>(user.avatarURL);

  const getUploadUrl = async () => {
    const resp = await axiosInstance.get('files/upload-url');

    if (resp?.data) {
      setUploadData(resp.data);
    }
    return resp.data;
  };

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

  const handleUpload = async (file: RcFile) => {
    let uploadDataLocal = uploadData;
    if (!uploadData) {
      uploadDataLocal = await getUploadUrl();
    }
    const fileName = `${user.sub}-${uuid()}.${file.name.split('.').pop()}`;
    const key = `${user.sub}/${AWS.AVATARS_FOLDER}/${fileName}`;
    const formData = new FormData();
    formData.append('Content-Type', file.type);
    formData.append('x-amz-meta-userid', user.sub);
    Object.entries(uploadDataLocal.form.fields).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append('key', key);
    formData.append('file', file as RcFile, fileName);
    try {
      await axios.post(uploadDataLocal.form.url, formData);
      await axiosInstance.post('users/avatar', { key: key });
      setImageUrl(`${uploadDataLocal.sourceUrl}/${key}`);
      message.success('upload successfully.');
    } catch (error) {
      message.error('upload failed.');
    } finally {
      setLoading(false);
    }
    return;
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
