import UpdatePassword from '../../../components/auth/update-password/UpdatePassword';
import BasicLayout from '../../../layouts/BasicLayout';

function UpdatePasswordPage() {
  return <UpdatePassword />;
}

UpdatePasswordPage.getLayout = (page) => {
  return <BasicLayout>{page}</BasicLayout>;
};

export default UpdatePasswordPage;
