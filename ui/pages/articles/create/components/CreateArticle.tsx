import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

import AppButton from '../../../../components/Button';
import AppInput from '../../../../components/Input';
import { axiosInstance } from '../../../../utils/axios';

const CreateArticle = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const saveArticle = () => {
    axiosInstance.post('/articles', {
      title,
      content,
    });
  };

  const updateTitle = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  return (
    <div>
      <h1>Create article</h1>
      <p>Title:</p>
      <AppInput value={title} onChange={updateTitle} />
      <p>Article:</p>
      {typeof window !== 'undefined' && (
        <ReactQuill theme="snow" value={content} onChange={setContent} />
      )}
      <AppButton
        onClick={() => {
          saveArticle();
        }}
      >
        Save
      </AppButton>
    </div>
  );
};

export default CreateArticle;
