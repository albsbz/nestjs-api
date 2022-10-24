import { useRouter } from 'next/router';
import Script from 'next/script';
import useGoogleOneTap from '../../../components/auth/hooks/useGoogleOneTap';

const OneTap = () => {
  useGoogleOneTap();
  return (
    <>
      <Script
        id="google-maps"
        src="https://accounts.google.com/gsi/client"
        async
        defer
      />
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
        data-callback="handleCredentialResponse"
      ></div>
    </>
  );
};
export default OneTap;
