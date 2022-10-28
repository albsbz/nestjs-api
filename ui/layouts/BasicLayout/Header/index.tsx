import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo, useMemo, useState } from 'react';
import { WindowSize } from '../../../common/enums';
import { useAuthContext } from '../../../context/authContext';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import AvatarMenu from './AvatarMenu';
import Logo from './Logo';

import styles from './style.module.scss';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { windowDimensions, windowSize } = useWindowDimensions();
  const { isAuth, isLoading } = useAuthContext();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  console.log('width', windowDimensions, windowSize);

  let items = [
    // {+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //   key: '/',
    //   label: <Link href="/">Main</Link>,
    // },
  ];
  if (isAuth) {
    items = [
      ...items,
      {
        key: '/home',
        label: <Link href="/">Articles</Link>,
        children: [
          {
            key: '/articles/my',
            label: <Link href="/articles/my">My articles</Link>,
          },
          {
            key: '/articles/create',
            label: <Link href="/article/create">Create new</Link>,
          },
        ],
      },
    ];
  }
  const getMenu = () => {
    if (windowSize === WindowSize.large || windowSize === WindowSize.extraLarge)
      return (
        <>
          <Logo left />
          <AvatarMenu />
          <Menu
            mode="horizontal"
            defaultSelectedKeys={[router.route]}
            items={items}
            className={styles.headerColor}
          />
        </>
      );
    if (windowSize === WindowSize.small || windowSize === WindowSize.medium) {
      return (
        <>
          <Button
            type="primary"
            onClick={toggleCollapsed}
            style={{ marginBottom: 16 }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>

          <Logo />
          <AvatarMenu />
          {!collapsed && (
            <Menu
              mode="inline"
              inlineCollapsed={collapsed}
              defaultSelectedKeys={[router.route]}
              items={items}
              className={styles.headerColor}
            />
          )}
        </>
      );
    }
  };

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
      {getMenu()}
    </Header>
  );
};

export default memo(AppHeader);
