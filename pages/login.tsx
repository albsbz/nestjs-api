import { FC } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleButton from '../src/components/GoogleButton';

const Login: FC = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID;
  return (
    <>
      <h1>Login</h1>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleButton></GoogleButton>
      </GoogleOAuthProvider>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Login;
