import { Breadcrumb, Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import { PropsWithChildren, ReactNode } from 'react';
import { Props } from '../../common/interface/Props';
import styles from './BasicLayout.module.css';

const { Header, Content, Footer } = Layout;

const BasicLayout: React.FC<Props> = (props) => (
  <Layout>
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <div className={styles.logo} />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        items={new Array(3).fill(null).map((_, index) => ({
          key: String(index + 1),
          label: `nav ${index + 1}`,
        }))}
      />
    </Header>
    <Content
      className={styles.siteLayout}
      style={{ padding: '0 50px', marginTop: 64 }}
    >
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className={styles.siteLayoutBackground}
        style={{ padding: 24, minHeight: 380 }}
      >
        {props.children}
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Blog-API</Footer>
  </Layout>
);

export default BasicLayout;
