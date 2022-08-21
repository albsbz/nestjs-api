import { TPage } from '../../../common/types/TPages';
import BasicLayout from '../../../layouts/BasicLayout';
import Registration from './components/Registration';

const RegistartionPage: TPage = () => {
  return <Registration />;
};

RegistartionPage.getLayout = (page) => {
  return <BasicLayout>{page}</BasicLayout>;
};

export default RegistartionPage;
