import { Button, Layout, Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useAuthContext } from '../../../context/authContext';
import AppProfileMenu from './ProfileMenu';
import styles from './style.module.scss';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { isAuth, isLoading } = useAuthContext();
  const items = useMemo(
    () => [
      {
        key: '/',
        label: <Link href="/">Main</Link>,
      },
    ],
    [isAuth],
  );
  if (isAuth) {
    items.push({
      key: '/article/create',
      label: <Link href="article/create">New article</Link>,
    });
  }
  const router = useRouter();
  return (
    <Header
      style={{
        position: 'fixed',
        zIndex: 1,
        width: '100%',
      }}
      className={styles.headerColor}
    >
      <div
        className={styles.logo}
        onClick={() => {
          router.push('/');
        }}
      >
        <h1>{process.env.NEXT_PUBLIC_UI_LOGO_NAME}</h1>
      </div>
      {!isLoading && (
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
      )}
      <Menu
        mode="horizontal"
        defaultSelectedKeys={[router.route]}
        items={items}
        className={styles.headerColor}
      />
    </Header>
  );
};

export default AppHeader;
