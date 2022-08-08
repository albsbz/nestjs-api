import BasicLayout from '../../components/layouts/BasicLayout';
import LoginPage from './components/LoginPage';

const login = () => {
  return <LoginPage />;
};

login.getLayout = (page) => {
  return <BasicLayout>{page}</BasicLayout>;
};

export default login;
