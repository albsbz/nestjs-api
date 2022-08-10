import { Button, Layout, Menu } from 'antd';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../../context/authContext';
import AppProfileMenu from './ProfileMenu';
import styles from './style.module.css';

const { Header } = Layout;

const items = [
  ...new Array(3).fill(null).map((_, index) => ({
    key: String(index + 1),
    label: `nav ${index + 1}`,
  })),
];

const AppHeader: React.FC = () => {
  const { isAuth } = useAuthContext();
  const router = useRouter();
  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <div className={styles.logo} />
      <div style={{ float: 'right' }}>
        {isAuth ? (
          <AppProfileMenu />
        ) : (
          <Button
            onClick={() => {
              router.push('/login');
            }}
          >
            Login
          </Button>
        )}
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        items={items}
      />
    </Header>
  );
};

export default AppHeader;
