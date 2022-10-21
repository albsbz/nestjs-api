import React, { useEffect } from 'react';
import AppButton from '../Button';

function GoogleButton({ children }) {
  const handleRedirect = (e) => {
    e.preventDefault();
    window.location.href = `${process.env.NEXT_PUBLIC_API}/auth/google`;
  };
  return <AppButton onClick={handleRedirect}>{children}</AppButton>;
}

export default GoogleButton;
