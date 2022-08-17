import BasicLayout from '../../../layouts/BasicLayout';
import Login from './components/Login';

const loginPage = () => {
  return <Login />;
};

loginPage.getLayout = (page) => {
  return <BasicLayout>{page}</BasicLayout>;
};

export default loginPage;
