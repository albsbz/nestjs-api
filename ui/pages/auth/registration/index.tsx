import { Page } from '../../../common/types/pages';
import BasicLayout from '../../../layouts/BasicLayout';
import Registration from './components/Registration';

const RegistartionPage: Page = () => {
  return <Registration />;
};

RegistartionPage.getLayout = (page) => {
  return <BasicLayout>{page}</BasicLayout>;
};

export default RegistartionPage;
