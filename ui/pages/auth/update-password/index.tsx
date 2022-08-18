import BasicLayout from '../../../layouts/BasicLayout';
import UpdatePassword from './components/UpdatePassword';

function UpdatePasswordPage() {
  return <UpdatePassword />;
}

UpdatePasswordPage.getLayout = (page) => {
  return <BasicLayout>{page}</BasicLayout>;
};

export default UpdatePasswordPage;
