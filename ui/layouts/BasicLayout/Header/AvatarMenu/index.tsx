import { Button } from 'antd';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../../../context/authContext';
import AppProfileMenu from './ProfileMenu';
import styles from './style.module.scss';

const AvatarMenu = () => {
  const { isAuth, isLoading } = useAuthContext();
  const router = useRouter();
  return (
    !isLoading && (
      <div className={styles.rightButtonsWrapper}>
        {isAuth ? (
          <AppProfileMenu />
        ) : (
          <>
            <Button
              onClick={() => {
                router.push('/auth/login');
              }}
              size="small"
              type="primary"
            >
              Sign in
            </Button>
            <div className={styles.dash}>/</div>
            <Button
              onClick={() => {
                router.push('/auth/registration');
              }}
              size="small"
              type="dashed"
              style={{ margin: '0px 5px' }}
            >
              Sign up
            </Button>
          </>
        )}
      </div>
    )
  );
};

export default AvatarMenu;
