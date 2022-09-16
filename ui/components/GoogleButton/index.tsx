import React, { useEffect } from 'react';

function GoogleButton({ children }) {
  const handleRedirect = (e) => {
    e.preventDefault();
    window.location.href = `${process.env.NEXT_PUBLIC_API}/auth/google`;
  };
  return <button onClick={handleRedirect}>{children}</button>;
}

export default GoogleButton;
