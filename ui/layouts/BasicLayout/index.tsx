import { Alert, Breadcrumb, Layout } from 'antd';
import 'antd/dist/antd.css';
import { Props } from '../../common/interface/Props';
import styles from './style.module.css';
import AppHeader from './Header';
import ErrorBoundary from '../../components/ErrorBoundary';
import { AuthContext } from '../../context/authContext';
import { useEffect, useState } from 'react';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { JWTTokenPayload } from '../../common/types/jwtTokenPayload';

const { Content, Footer } = Layout;

const BasicLayout: React.FC<Props> = (props) => {
  const [tokens, setTokens] = useState({
    accessToken: null,
    refreshToken: null,
  });

  const [user, setUser] = useState({});

  useEffect(() => {
    if (tokens.accessToken) {
      const userData = jwtDecode<JWTTokenPayload>(tokens.accessToken);
      setUser(userData);
    }
  }, [tokens]);

  return (
    <Layout>
      <ErrorBoundary>
        <AuthContext.Provider value={{ tokens, setTokens, user }}>
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
        </AuthContext.Provider>
      </ErrorBoundary>
    </Layout>
  );
};

export default BasicLayout;
