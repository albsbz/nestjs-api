import { Skeleton } from 'antd';
import { RcFile } from 'antd/lib/upload';
import dynamic from 'next/dynamic';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { axiosInstance } from '../../../../utils/axios';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import AppLoading from '../../../AppLoading';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import useAuth from '../../../../context/authContext/hooks/useAuth';
import { useAuthContext } from '../../../../context/authContext';
import { IUploadFileData } from '../../../../common/interface/IUploadFileData';
import { AWS } from '../../../../utils/constants';

let didInit = false;
const AppContentEditor = ({ content, handler, isUpdating, updateHandler }) => {
  const { quill, quillRef } = useQuill();
  const { user } = useAuthContext();
  const [uploadData, setUploadData] = useState<IUploadFileData>();

  const getUploadUrl = async () => {
    const resp = await axiosInstance.get('files/upload-url');

    if (resp?.data) {
      setUploadData(resp.data);
    }
    return resp.data;
  };

  const imageHandler = useCallback(
    async (file) => {
      let uploadDataLocal = uploadData;
      if (!uploadData) {
        uploadDataLocal = await getUploadUrl();
      }

      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        updateHandler(true);
        const file = input.files ? input.files[0] : null;
        const formData = new FormData();

        if (quillRef) {
          const range = quill.getSelection();

          if (file) {
            quill.disable();
            const fileName = `${user.sub}-${uuid()}.${file.name
              .split('.')
              .pop()}`;
            const key = `${user.sub}/${AWS.ARTICLE_IMAGES_FOLDER}/${fileName}`;

            formData.append('Content-Type', file.type);
            formData.append('x-amz-meta-userid', user.sub);
            Object.entries(uploadDataLocal.form.fields).forEach(([k, v]) => {
              formData.append(k, v);
            });
            formData.append('key', key);
            formData.append('file', file as RcFile, fileName);
            let resp;
            try {
              resp = await axios.post(uploadDataLocal.form.url, formData);
            } catch (error) {
              quill.enable();
              updateHandler(false);
              return;
            }

            if (resp) {
              updateHandler(false);
              quill.insertEmbed(
                range.index,
                'image',
                `${uploadDataLocal.sourceUrl}/${key}`,
              );
            }
            quill.enable();
          }
        }
      };
    },
    [uploadData, updateHandler, quillRef, quill, user.sub],
  );

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => handler(quill.root.innerHTML));
    }
  }, [quill, handler, content]);

  useEffect(() => {
    if (quill) {
      // Add custom handler for Image Upload
      quill.getModule('toolbar').addHandler('image', imageHandler);
    }
  }, [imageHandler, quill]);

  useEffect(() => {
    if (quill) quill.clipboard.dangerouslyPasteHTML(content);
  }, [content, quill]);

  if (typeof window !== 'undefined') {
    return (
      <AppLoading isLoading={isUpdating} type="Image">
        <div ref={quillRef} />
      </AppLoading>
    );
  }
  return <Skeleton />;
};

export default memo(AppContentEditor);
