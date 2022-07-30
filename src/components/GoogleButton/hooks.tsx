import { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';

export const useGoogleAuthentication = function () {
  const handleSuccess = () => {
    window.location.href = '/api/google-auth';
  };

  const handleError = (errorResponse) => console.log('ERR', errorResponse);

  return {
    handleSuccess,
    handleError,
  };
};
