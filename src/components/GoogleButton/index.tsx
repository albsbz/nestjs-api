import React from 'react';
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from '@react-oauth/google';
import { useGoogleAuthentication } from './hooks';

function GoogleButton() {
  const { handleSuccess, handleError } = useGoogleAuthentication();

  return (
    <button onClick={() => (window.location.href = '/api/google-auth')}>
      Login with google
    </button>
  );
}

export default GoogleButton;
