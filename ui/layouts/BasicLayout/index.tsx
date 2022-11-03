import { Layout } from 'antd';
import 'antd/dist/antd.css';
import { IProps } from '../../common/interface/IProps';
import styles from './style.module.scss';
import AppHeader from './Header';
import ErrorBoundary from '../../components/ErrorBoundary';
import { AuthContextProvider } from '../../context/authContext';
import PageLoader from '../../components/PageLoader';
import { AlertContextProvider } from '../../context/alertContext';
import AppAlert from '../../components/Alert';
import { memo } from 'react';
import Breadcrumbs from './Breadcrumbs';
import OneTap from './OneTap';
import Script from 'next/script';
import { LoadingContextProvider } from '../../context/loadingContext';

const { Content, Footer } = Layout;

const BasicLayout: React.FC<IProps> = ({ children, needAuth, onlyNoAuth }) => {
  return (
    <ErrorBoundary>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
      ></Script>
      <LoadingContextProvider>
        <AuthContextProvider needAuth={needAuth} onlyNoAuth={onlyNoAuth}>
          <PageLoader needAuth={needAuth}>
            <Layout className={styles.layout}>
              <AppHeader />
              <OneTap />
              <AlertContextProvider>
                <AppAlert />
                <Content
                  className={styles.content}
                  style={{ padding: '0 50px' }}
                >
                  <Breadcrumbs></Breadcrumbs>
                  <div className={styles.contentBackground}>{children}</div>
                </Content>
              </AlertContextProvider>

              <Footer style={{ textAlign: 'center' }} className={styles.footer}>
                Blog-API
              </Footer>
            </Layout>
          </PageLoader>
        </AuthContextProvider>
      </LoadingContextProvider>
    </ErrorBoundary>
  );
};

export default memo(BasicLayout);
