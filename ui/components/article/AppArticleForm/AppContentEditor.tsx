import { Skeleton } from 'antd';
import { RcFile } from 'antd/lib/upload';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { axiosInstance } from '../../../utils/axios';

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

const AppContentEditor = ({ content, handler }) => {
  const imageHandler = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('file', file as RcFile);

    try {
      const resp = await axiosInstance.post('articles/image', formData);
      return resp.data.url;
    } catch (e) {
      console.log('e', e);
    }

    // return new Promise((resolve, reject) => {
    //   const formData = new FormData();
    //   formData.append('image', file);

    //   fetch(
    //     'https://api.imgbb.com/1/upload?key=d36eb6591370ae7f9089d85875e56b22',
    //     {
    //       method: 'POST',
    //       body: formData,
    //     },
    //   )
    //     .then((response) => response.json())
    //     .then((result) => {
    //       console.log(result);
    //       resolve(result.data.url);
    //     })
    //     .catch((error) => {
    //       reject('Upload failed');
    //       console.error('Error:', error);
    //     });
    // });
  }, []);
  const toolbarOptions = {
    container: containerOptions,
    imageUploader: imageHandler,
  };

  if (typeof window !== 'undefined') {
    return (
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handler}
        modules={{ toolbar: toolbarOptions }}
      />
    );
  }
  return <Skeleton />;
};

export default AppContentEditor;
