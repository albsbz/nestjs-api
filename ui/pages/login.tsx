import { NextPage } from 'next';
import GoogleButton from '../components/GoogleButton';

const Login: NextPage = () => {
  return (
    <>
      <h1>Login</h1>
      <GoogleButton></GoogleButton>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Login;
