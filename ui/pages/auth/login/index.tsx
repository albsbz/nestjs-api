import BasicLayout from '../../../layouts/BasicLayout';
import Login from '../../../components/auth/login/Login';

const loginPage = () => {
  return <Login />;
};

loginPage.getLayout = (page) => {
  return <BasicLayout onlyNoAuth>{page}</BasicLayout>;
};

export default loginPage;
