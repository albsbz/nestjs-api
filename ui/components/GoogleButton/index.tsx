import React, { useEffect, useState } from 'react';
import useGoogleOneTap from '../auth/hooks/useGoogleOneTap';

declare global {
  interface Window {
    google?: any;
  }
}
function GoogleButton({ children }) {
  const { handleCredentialResponse } = useGoogleOneTap();
  console.dir(handleCredentialResponse);
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('buttonDiv'),
        {
          theme: 'outline',
          size: 'large',
          width: '400px',
          shape: 'rectangular',
        }, // customization attributes
      );
    }
  }, [handleCredentialResponse]);
  return <div id="buttonDiv"></div>;
}

export default GoogleButton;
