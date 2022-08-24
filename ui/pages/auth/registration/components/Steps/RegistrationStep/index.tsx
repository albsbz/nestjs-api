import { Button, Form, Space } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import AppButton from '../../../../../../components/Button';
import GoogleButton from '../../../../../../components/GoogleButton';
import AppInput from '../../../../../../components/Input';
import styles from './style.module.scss';
import { axiosInstance } from '../../../../../../utils/axios';
import { useErrorHandler } from 'react-error-boundary';
import useAsyncError from '../../../../../../hooks/useAsyncError';
import { useAuthContext } from '../../../../../../context/authContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAlertContext } from '../../../../../../context/alertContext';

const RegistrationStep = ({ next }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const handleError = useErrorHandler();
  const throwError = useAsyncError();
  const { isAuth, setIsLoading, isLoading } = useAuthContext();
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
      await axiosInstance.post('auth/register', {
        email: values.email,
        password: values.password,
      });
      next();
      // router.push('/auth/login');
      setAlert({ message: 'Registration success!' });
    } catch (e) {
      if (e.response.status === 409) {
        form.setFields([{ name: 'email', errors: [e.response.data.message] }]);
      } else {
        throwError(e);
      }
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    router.push('/auth/login');
  };

  const onFinishFailed = (errorInfo: any) => {};
  return (
    <div>
      <h1>Registration</h1>
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
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your Email!' },
            { type: 'email', message: 'Email incorrect' },
          ]}
        >
          <AppInput placeholder="Email" prefix={<UserOutlined />} />
        </Form.Item>

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

        <Button type="link" onClick={handleLogin}>
          Already registered?
        </Button>

        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <AppButton type="primary" htmlType="submit" block>
            Create account
          </AppButton>
        </Form.Item>
        <GoogleButton>Register with google</GoogleButton>
      </Form>
    </div>
  );
};

export default RegistrationStep;
