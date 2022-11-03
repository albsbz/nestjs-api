import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/authContext';
import { useLoadingContext } from '../context/loadingContext';

const useInitAuth = () => {
  const router = useRouter();
  const { isAuth, needAuth, onlyNoAuth, initiated } = useAuthContext();
  const { isLoading, setIsLoading } = useLoadingContext();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [initAuth, setInitAuth] = useState(false);
  useEffect(() => {
    if (!initiated) return;
    if (onlyNoAuth && router.asPath !== '/') {
      setIsLoading(true);
      if (isAuth) {
        if (isRedirecting) return;
        setIsRedirecting(true);
        router.push('/');
      } else {
        setIsLoading(false);
        setInitAuth(true);
      }
      return;
    }
    setIsLoading(false);
    setInitAuth(true);
  }, [router, isAuth, initiated, onlyNoAuth, setIsLoading, isRedirecting]);
  return { initAuth };
};

export default useInitAuth;
