import { Form, Space } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import AppButton from '../../../components/Button';
import GoogleButton from '../../../components/GoogleButton';
import AppInput from '../../../components/Input';
import styles from './style.module.css';
import { axiosInstance } from '../../../utils/axios';
import { useErrorHandler } from 'react-error-boundary';
import useAsyncError from '../../../hooks/useAsyncError';
import { useAuthContext } from '../../../context/authContext';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

const LoginPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const handleError = useErrorHandler();
  const throwError = useAsyncError();
  const { login, isAuth, setIsLoading, isLoading } = useAuthContext();

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
      return Promise.reject('Some message here');
    }
  };

  const onFinish = async (values: any) => {
    let resp;
    try {
      resp = await axiosInstance.post('auth/login', {
        email: values.email,
        password: values.password,
      });

      login(resp.headers.accesstoken, resp.headers.refreshtoken);
      router.push('/');
    } catch (e) {
      if (e.response.status === 401) {
        form.setFields([
          { name: 'password', errors: [e.response.data.message] },
        ]);
      } else {
        throwError(e);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {};
  return (
    <div>
      <h1>Login</h1>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 5 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="horizontal"
        className={styles.form}
        size="large"
        validateTrigger="onSubmit"
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

        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <AppButton type="primary" htmlType="submit" block>
            Login with Email
          </AppButton>
        </Form.Item>
        <GoogleButton></GoogleButton>
      </Form>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default LoginPage;
