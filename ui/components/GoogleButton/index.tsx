import React, { useEffect } from 'react';

function GoogleButton({ children }) {
  const handleRedirect = (e) => {
    e.preventDefault();
    window.location.href = '/api/googleauth';
  };
  return <button onClick={handleRedirect}>{children}</button>;
}

export default GoogleButton;
