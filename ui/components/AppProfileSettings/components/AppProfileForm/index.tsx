import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';
import { useAlertContext } from '../../../../context/alertContext';
import { useAuthContext } from '../../../../context/authContext';
import useAsyncError from '../../../../hooks/useAsyncError';
import { axiosInstance } from '../../../../utils/axios';
import AppButton from '../../../Button';
import AppInput from '../../../Input';
import styles from './style.module.scss';

const AppProfileForm = ({ next, profile }) => {
  const [form] = Form.useForm();

  const throwError = useAsyncError();
  const { setAlert } = useAlertContext();

  useEffect(() => {
    if (profile?.name) {
      form.setFieldValue('name', profile.name);
    }
    if (profile?.about) {
      form.setFieldValue('about', profile.about);
    }
  }, [profile, form]);

  const onFinish = async (values: any) => {
    try {
      await axiosInstance.patch('users/profile', {
        name: values.name,
        about: values.about,
      });
      setAlert({ message: 'Profile updated' });
      next();
    } catch (e) {
      if (e.response.status === 409) {
        // form.setFields([{ name: 'email', errors: [e.response.data.message] }]);
      } else {
        throwError(e);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {};
  return (
    <div>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 5 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <div className={styles.form}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input your name!' },
              // { validator: passwordValidator, message: 'Password is too week' },
            ]}
          >
            <AppInput
              placeholder="Name"
              prefix={<UserOutlined className="site-form-item-icon" />}
            />
          </Form.Item>

          <Form.Item label="About me" name="about">
            <TextArea rows={4} placeholder="Info about me" />
          </Form.Item>
        </div>
        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
          <AppButton type="primary" htmlType="submit" block>
            Save
          </AppButton>
        </Form.Item>
      </Form>
    </div>
  );
};
export default AppProfileForm;
