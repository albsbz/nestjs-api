import React, { useEffect } from 'react';
import AppButton from '../Button';

function GithubButton({ children }) {
  const handleRedirect = (e) => {
    e.preventDefault();
    window.location.href = `${process.env.NEXT_PUBLIC_API}/auth/github`;
  };
  return (
    <AppButton onClick={handleRedirect} style={{ width: '100%' }}>
      {children}
    </AppButton>
  );
}

export default GithubButton;
