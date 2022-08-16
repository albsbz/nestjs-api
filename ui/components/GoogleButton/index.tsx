import React, { useEffect } from 'react';

function GoogleButton() {
  const handleRedirect = (e) => {
    e.preventDefault();
    window.location.href = '/api/googleauth';
  };
  return <button onClick={handleRedirect}>Login with google</button>;
}

export default GoogleButton;
