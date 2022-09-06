import { Skeleton } from 'antd';
import { RcFile } from 'antd/lib/upload';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { axiosInstance } from '../../../../utils/axios';
import { useCallback, useRef, useState } from 'react';
import IReactQuill from 'react-quill';
import styles from './style.module.scss';
import AppLoading from '../../../AppLoading';

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

const AppContentEditor = ({ content, handler, isUpdating, updateHandler }) => {
  const quillRef = useRef<IReactQuill>();

  const imageHandler = useCallback(async (file) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      updateHandler(true);
      const file = input.files ? input.files[0] : null;
      let data = null;
      const formData = new FormData();
      if (quillRef) {
        const quillObj = quillRef.current.getEditor();

        const range = quillObj?.getSelection();

        if (file) {
          quillObj.disable();
          const formData = new FormData();
          formData.append('file', file as RcFile);
          let resp;
          try {
            resp = await axiosInstance.post('articles/image', formData);
          } catch (error) {
            console.log('eerrr', error);
            quillObj.enable();
            updateHandler(false);
            return;
          }

          const url = resp?.data?.url;
          console.log('url', url);
          if (url) {
            updateHandler(false);
            quillObj.insertEmbed(range.index, 'image', url);
          }
          quillObj.enable();
          console.log(' quillObj.editor', quillObj);
        }
      }
    };
  }, []);

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
