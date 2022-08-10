import { Breadcrumb, Layout } from 'antd';
import 'antd/dist/antd.css';
import { Props } from '../../common/interface/Props';
import styles from './style.module.css';
import AppHeader from './Header';
import ErrorBoundary from '../../components/ErrorBoundary';
import { AuthContextProvider } from '../../context/authContext';

const { Content, Footer } = Layout;

const BasicLayout: React.FC<Props> = (props) => {
  return (
    <Layout>
      <ErrorBoundary>
        <AuthContextProvider>
          <AppHeader />
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
        </AuthContextProvider>
      </ErrorBoundary>
    </Layout>
  );
};

export default BasicLayout;
