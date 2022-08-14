import { Breadcrumb, Layout } from 'antd';
import 'antd/dist/antd.css';
import { Props } from '../../common/interface/Props';
import styles from './style.module.css';
import AppHeader from './Header';
import ErrorBoundary from '../../components/ErrorBoundary';
import { AuthContextProvider } from '../../context/authContext';
import PageLoader from '../../components/PageLoader';

const { Content, Footer } = Layout;

const BasicLayout: React.FC<Props> = ({ children, needAuth }) => {
  return (
    <ErrorBoundary>
      <AuthContextProvider needAuth={needAuth}>
        <PageLoader>
          <Layout>
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
                {children}
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Blog-API</Footer>
          </Layout>
        </PageLoader>
      </AuthContextProvider>
    </ErrorBoundary>
  );
};

export default BasicLayout;
