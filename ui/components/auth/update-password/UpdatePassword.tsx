import { Form } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import AppButton from '../../../components/Button';
import AppInput from '../../../components/Input';
import styles from './style.module.scss';
import { axiosInstance } from '../../../utils/axios';
import useAsyncError from '../../../hooks/useAsyncError';
import { useAuthContext } from '../../../context/authContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAlertContext } from '../../../context/alertContext';
import { useLoadingContext } from '../../../context/loadingContext';

const UpdatePassword = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const throwError = useAsyncError();
  const { isAuth } = useAuthContext();
  const { setIsLoading, isLoading } = useLoadingContext();
  const { setAlert } = useAlertContext();

  useEffect(() => {
    if (isAuth) {
      setIsLoading(true);
    }
  }, [isAuth, setIsLoading]);

  useEffect(() => {
    if (!isLoading && isAuth) {
      router.push('/');
    }
  }, [router, isAuth, isLoading]);

  const passwordValidator = (_, pw) => {
    if (/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(pw)) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  };

  const confirmPasswordValidator = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error('The two passwords that you entered do not match!'),
      );
    },
  });

  const onFinish = async (values: any) => {
    try {
      await axiosInstance.post('auth/confirm-drop-password', {
        token: router.query.token,
        password: values.password,
      });
      router.push('/auth/login');
      setAlert({ message: 'Password reseted successfully!' });
    } catch (e) {
      if (e.response.status === 400) {
        form.setFields([{ name: 'email', errors: [e.response.data.message] }]);
      } else {
        throwError(e);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {};
  return (
    <div>
      <h1>Update password</h1>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 10 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="horizontal"
        className={styles.form}
        size="large"
      >
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { validator: passwordValidator, message: 'Password is too week' },
          ]}
        >
          <AppInput
            placeholder="Password"
            type="Password"
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>

        <Form.Item
          label="Confirm password"
          name="repeatPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            confirmPasswordValidator,
          ]}
        >
          <AppInput
            placeholder="Confirm password"
            type="Password"
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <AppButton type="primary" htmlType="submit" block>
            Change password
          </AppButton>
        </Form.Item>
      </Form>
    </div>
  );
};
export default UpdatePassword;
