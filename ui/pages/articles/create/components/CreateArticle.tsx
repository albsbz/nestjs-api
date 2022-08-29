import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

import AppButton from '../../../../components/Button';
import AppInput from '../../../../components/Input';
import { axiosInstance } from '../../../../utils/axios';
import { Form, Input } from 'antd';
import { useAlertContext } from '../../../../context/alertContext';
import useAsyncError from '../../../../hooks/useAsyncError';

const CreateArticle = () => {
  const { setAlert } = useAlertContext();
  const [content, setContent] = useState('');
  const [form] = Form.useForm();
  const throwError = useAsyncError();

  const saveArticle = async (values) => {
    let resp;
    try {
      resp = await axiosInstance.post('/articles', {
        content,
        ...values,
      });
      setAlert({ message: 'Article created!' });
    } catch (e) {
      if (e.response.status === 400) {
        form.setFields(e.response.data.message);
      } else {
        throwError(e);
      }
    }
  };

  const slugValidator = (_, slug) => {
    if (/^[a-z]+(?:-[a-z]+)*$/.test(slug)) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  };

  return (
    <div>
      <h1>Create article</h1>

      <Form
        name="basic"
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={saveArticle}
        autoComplete="off"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input article title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: 'Please input article description!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[
            { required: true, message: 'Please input article slug!' },
            {
              validator: slugValidator,
              message: 'slug must use only letters and dash symbol',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Content">
          {typeof window !== 'undefined' && (
            <ReactQuill theme="snow" value={content} onChange={setContent} />
          )}
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <AppButton type="primary" htmlType="submit">
            Submit
          </AppButton>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateArticle;
