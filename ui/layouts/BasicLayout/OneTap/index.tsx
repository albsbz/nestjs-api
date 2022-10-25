import { useRouter } from 'next/router';
import useGoogleOneTap from '../../../components/auth/hooks/useGoogleOneTap';
import { useAuthContext } from '../../../context/authContext';
import styles from './style.module.scss';

const OneTap = () => {
  const { isAuth } = useAuthContext();
  const router = useRouter();

  useGoogleOneTap();
  if (isAuth || router.pathname === '/auth/login') return;
  return (
    <div
      id="g_id_onload"
      data-nonce=""
      data-close_on_tap_outside="false"
      data-itp_support="false"
      data-client_id={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
      data-callback="handleCredentialResponse"
      data-prompt_parent_id="g_id_onload"
      className={styles.OneTap}
    ></div>
  );
};
export default OneTap;
