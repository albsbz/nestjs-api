import BasicLayout from '../../../layouts/BasicLayout';
import ProviderAuthController from './components/ProviderAuthController';

const AuthProviderPage = () => {
  return <ProviderAuthController />;
};

AuthProviderPage.getLayout = (page) => {
  return <BasicLayout>{page}</BasicLayout>;
};

export default AuthProviderPage;
