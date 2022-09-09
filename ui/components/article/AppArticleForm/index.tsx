import { useCallback, useState } from 'react';
import AppButton from '../../../components/Button';
import { Form, Input } from 'antd';
import useAsyncError from '../../../hooks/useAsyncError';
import AppContentEditor from './AppContentEditor';

const AppArticleForm = (props: {
  initialValues?: { title: ''; description: ''; slug: ''; content: '' };
  submitForm;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [content, setContent] = useState(props.initialValues?.content || '');
  const [form] = Form.useForm();
  const throwError = useAsyncError();
  const updateHandler = useCallback((v) => {
    setIsUpdating(v);
  }, []);

  const contentHandler = useCallback((v) => {
    setContent(v);
  }, []);
  let initialValues = { title: '', description: '', slug: '', content: '' };

  if (props?.initialValues) {
    Object.entries(initialValues).forEach(([idx]) => {
      initialValues[idx] = props.initialValues[idx] || '';
    });
  }

  const saveArticle = async (values) => {
    try {
      await props.submitForm({ content, ...values });
    } catch (e) {
      if (e.response?.status === 400) {
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
    <Form
      name="basic"
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
      initialValues={initialValues}
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
        <AppContentEditor
          content={content}
          handler={contentHandler}
          isUpdating={isUpdating}
          updateHandler={updateHandler}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <AppButton type="primary" htmlType="submit" loading={isUpdating}>
          Submit
        </AppButton>
      </Form.Item>
    </Form>
  );
};

export default AppArticleForm;
