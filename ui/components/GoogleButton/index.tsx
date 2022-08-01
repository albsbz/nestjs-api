import React from 'react';

function GoogleButton() {
  return (
    <button onClick={() => (window.location.href = '/api/google-auth')}>
      Login with google
    </button>
  );
}

export default GoogleButton;
