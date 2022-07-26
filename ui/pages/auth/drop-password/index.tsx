import BasicLayout from '../../../layouts/BasicLayout';
import DropPassword from '../../../components/auth/drop-password/DropPassword';

const dropPasswordPage = () => {
  return <DropPassword />;
};

dropPasswordPage.getLayout = (page) => {
  return <BasicLayout>{page}</BasicLayout>;
};

export default dropPasswordPage;
