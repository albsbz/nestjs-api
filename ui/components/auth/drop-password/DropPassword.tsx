import { Form } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AppButton from '../../Button';
import AppInput from '../../Input';
import styles from './style.module.scss';
import { axiosInstance } from '../../../utils/axios';
import { useErrorHandler } from 'react-error-boundary';
import useAsyncError from '../../../hooks/useAsyncError';
import { useAuthContext } from '../../../context/authContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAlertContext } from '../../../context/alertContext';
import { useLoadingContext } from '../../../context/loadingContext';

const DropPassword = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const throwError = useAsyncError();
  const { login, isAuth } = useAuthContext();
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

  const onFinish = async (values: any) => {
    let resp;
    try {
      resp = await axiosInstance.post('auth/droppassword', {
        email: values.email,
      });

      login(resp.headers.accesstoken, resp.headers.refreshtoken);
      router.push('/');
      setAlert({ message: 'Check your email for instructions' });
    } catch (e) {
      throwError(e);
    }
  };

  const onFinishFailed = (errorInfo: any) => {};
  return (
    <div>
      <h1>Drop password</h1>
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

        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <AppButton type="primary" htmlType="submit" block>
            Reset password
          </AppButton>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DropPassword;
