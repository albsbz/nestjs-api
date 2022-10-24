import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/authContext';
import { axiosInstance } from '../../utils/axios';
import Router from 'next/router';
import AppButton from '../Button';
import useGoogleOneTap from '../auth/hooks/useGoogleOneTap';

// declare global {
//   interface Window {
//     handleCredentialResponse?: any;
//   }
// }
// interface Tokens {
//   accessToken: string;
//   refreshToken: string;
// }

function GoogleButton({ children }) {
  // const handleRedirect = (e) => {
  //   e.preventDefault();
  //   window.location.href = `${process.env.NEXT_PUBLIC_API}/auth/google`;
  // };
  // return <AppButton onClick={handleRedirect}>{children}</AppButton>;
  // console.log('====================================');
  // console.log(`${process.env.NEXT_PUBLIC_URL}/auth/google`);
  // console.log('====================================');

  // const router = useRouter();

  // const [tokens, setTokens] = useState<Tokens>({
  //   accessToken: '',
  //   refreshToken: '',
  // });

  // const { login, isAuth } = useAuthContext();

  // const { accessToken, refreshToken } = tokens;

  // useEffect(() => {
  //   async function handleCredentialResponse({ credential }) {
  //     if (!credential) return;

  //     let resp;
  //     try {
  //       resp = await axiosInstance.post<Tokens>(`auth/google-one-tap/login`, {
  //         credential,
  //       });
  //     } catch (e) {
  //       router.push('/');
  //       return;
  //     }
  //     setTokens(resp.data);

  //     console.log('credential', credential);
  //   }
  //   window.handleCredentialResponse = handleCredentialResponse;
  // }, [router]);

  // useEffect(() => {
  //   if (accessToken && !isAuth) {
  //     login(accessToken, refreshToken);
  //   }
  // }, [accessToken, refreshToken, login, isAuth]);

  // useEffect(() => {
  //   if (isAuth) {
  //     Router.push('/');
  //   }
  // }, [isAuth]);
  useGoogleOneTap();

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async defer></Script>
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
        data-context="signup"
        data-callback="handleCredentialResponse"
        data-ux_mode="popup"
        data-auto_prompt="false"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div>
    </>
  );
}

export default GoogleButton;
