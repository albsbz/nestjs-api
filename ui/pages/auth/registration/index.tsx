import { TPage } from '../../../common/types/TPages';
import Registration from '../../../components/auth/registration/Registration';
import BasicLayout from '../../../layouts/BasicLayout';

const RegistartionPage: TPage = () => {
  return <Registration />;
};

RegistartionPage.getLayout = (page) => {
  return <BasicLayout>{page}</BasicLayout>;
};

export default RegistartionPage;
