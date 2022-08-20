import { Breadcrumb, Layout } from 'antd';
import 'antd/dist/antd.css';
import { Props } from '../../common/interface/Props';
import styles from './style.module.scss';
import AppHeader from './Header';
import ErrorBoundary from '../../components/ErrorBoundary';
import { AuthContextProvider } from '../../context/authContext';
import PageLoader from '../../components/PageLoader';
import { AlertContextProvider } from '../../context/alertContext';
import AppAlert from '../../components/Alert';

const { Content, Footer } = Layout;

const BasicLayout: React.FC<Props> = ({ children, needAuth }) => {
  return (
    <ErrorBoundary>
      <AuthContextProvider needAuth={needAuth}>
        <PageLoader needAuth={needAuth}>
          <Layout style={{ height: '100vh' }}>
            <AppHeader />
            <AlertContextProvider>
              <AppAlert />
              <Content
                className={styles.siteLayout}
                style={{ padding: '0 50px' }}
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
            </AlertContextProvider>

            <Footer style={{ textAlign: 'center' }} className={styles.footer}>
              Blog-API
            </Footer>
          </Layout>
        </PageLoader>
      </AuthContextProvider>
    </ErrorBoundary>
  );
};

export default BasicLayout;
