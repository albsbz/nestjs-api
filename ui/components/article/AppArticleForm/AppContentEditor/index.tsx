import { Skeleton } from 'antd';
import { RcFile } from 'antd/lib/upload';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { axiosInstance } from '../../../../utils/axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import IReactQuill from 'react-quill';
import styles from './style.module.scss';
import AppLoading from '../../../AppLoading';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import useAuth from '../../../../context/authContext/hooks/useAuth';
import { useAuthContext } from '../../../../context/authContext';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    const Quill = ({ forwardedRef, ...props }) => (
      <RQ ref={forwardedRef} {...props} />
    );
    return Quill;
  },
  { ssr: false },
);

const containerOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],

  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['link', 'image'],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
];

let didInit = false;
const AppContentEditor = ({ content, handler, isUpdating, updateHandler }) => {
  const quillRef = useRef<IReactQuill>();
  const { user } = useAuthContext();
  const [uploadData, setUploadData] = useState<{
    form: { fields: [string]; url: string };
    sourceUrl: string;
  }>();

  const getUploadUrl = async () => {
    const resp = await axiosInstance.get('files/upload-url');

    if (resp?.data) {
      setUploadData(resp.data);
    }
  };
  useEffect(() => {
    if (!didInit) {
      getUploadUrl();
      didInit = true;
    }
  }, []);

  const imageHandler = useCallback(
    async (file) => {
      if (!uploadData) return;
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        updateHandler(true);
        const file = input.files ? input.files[0] : null;
        const formData = new FormData();

        if (quillRef) {
          const quillObj = quillRef.current.getEditor();

          const range = quillObj?.getSelection();

          if (file) {
            quillObj.disable();
            const fileName = `${user.sub}-${uuid()}.${file.name
              .split('.')
              .pop()}`;
            const key = `articleImages/${user.sub}/${fileName}`;

            formData.append('Content-Type', file.type);
            formData.append('x-amz-meta-userid', user.sub);
            Object.entries(uploadData.form.fields).forEach(([k, v]) => {
              formData.append(k, v);
            });
            formData.append('key', key);
            formData.append('file', file as RcFile, fileName);
            let resp;
            try {
              resp = await axios.post(uploadData.form.url, formData);
            } catch (error) {
              quillObj.enable();
              updateHandler(false);
              return;
            }

            if (resp) {
              updateHandler(false);
              quillObj.insertEmbed(
                range.index,
                'image',
                `${uploadData.sourceUrl}/${key}`,
              );
            }
            quillObj.enable();
          }
        }
      };
    },
    [updateHandler, uploadData, user],
  );

  const toolbarOptions = {
    container: containerOptions,
    handlers: {
      image: imageHandler,
    },
  };

  if (typeof window !== 'undefined') {
    return (
      <AppLoading isLoading={isUpdating} type="Image">
        <ReactQuill
          forwardedRef={quillRef}
          theme="snow"
          value={content}
          onChange={handler}
          modules={{ toolbar: toolbarOptions }}
        />
      </AppLoading>
    );
  }
  return <Skeleton />;
};

export default AppContentEditor;
