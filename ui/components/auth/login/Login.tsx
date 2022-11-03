import { Button, Form, Space } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import AppButton from '../../Button';
import GoogleButton from '../../GoogleButton';
import AppInput from '../../Input';
import styles from './style.module.scss';
import { axiosInstance } from '../../../utils/axios';
import { useErrorHandler } from 'react-error-boundary';
import useAsyncError from '../../../hooks/useAsyncError';
import { useAuthContext } from '../../../context/authContext';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import GithubButton from '../../GithubButton';
import { useLoadingContext } from '../../../context/loadingContext';
import useInitAuth from '../../../hooks/useInitAuth';

const Login = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const handleError = useErrorHandler();
  const throwError = useAsyncError();
  const { login } = useAuthContext();
  const { initAuth } = useInitAuth();

  const onFinish = async (values: any) => {
    let resp;
    try {
      resp = await axiosInstance.post('auth/login', {
        email: values.email,
        password: values.password,
      });
      if (resp.headers.accesstoken && resp.headers.refreshtoken) {
        login(resp.headers.accesstoken, resp.headers.refreshtoken);
      }

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

  const handleNewAccount = (e) => {
    e.preventDefault();
    router.push('/auth/registration');
  };

  const handleDropPassword = (e) => {
    e.preventDefault();
    router.push('/auth/drop-password');
  };

  const onFinishFailed = (errorInfo: any) => {};
  return (
    initAuth && (
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
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <AppInput
              placeholder="Password"
              type="Password"
              prefix={<LockOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Button type="link" onClick={handleDropPassword}>
            Not remember?
          </Button>

          <Button type="link" onClick={handleNewAccount}>
            Create account
          </Button>

          <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
            <AppButton type="primary" htmlType="submit" block>
              Login with Email
            </AppButton>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
            <GoogleButton>Login with Google</GoogleButton>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
            <GithubButton>Login with Github</GithubButton>
          </Form.Item>
        </Form>
      </div>
    )
  );
};

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Login;
