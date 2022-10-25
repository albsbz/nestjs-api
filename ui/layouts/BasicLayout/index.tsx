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

const { Content, Footer } = Layout;

const BasicLayout: React.FC<IProps> = ({ children, needAuth }) => {
  return (
    <ErrorBoundary>
      <Script
        src="https://accounts.google.com/gsi/client"
        // strategy="lazyOnload"
      ></Script>
      <AuthContextProvider needAuth={needAuth}>
        <PageLoader needAuth={needAuth}>
          <Layout className={styles.layout}>
            <AppHeader />
            <OneTap />
            <AlertContextProvider>
              <AppAlert />
              <Content className={styles.content} style={{ padding: '0 50px' }}>
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
    </ErrorBoundary>
  );
};

export default memo(BasicLayout);
