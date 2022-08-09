import { Layout, Menu } from 'antd';
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
  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <div className={styles.logo} />
      <div style={{ float: 'right' }}>
        <AppProfileMenu />
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
