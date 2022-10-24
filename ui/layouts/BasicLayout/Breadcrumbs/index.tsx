import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AppBreadcrumbs = () => {
  const router = useRouter();
  const crumbs = router?.asPath.split('/').slice(1) || [];
  if (crumbs.includes('auth')) return;
  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      {crumbs[0] && (
        <Breadcrumb.Item key="main">
          <Link href="/">Main</Link>
        </Breadcrumb.Item>
      )}
      {crumbs.map((item, idx) => {
        let crumb = item;
        if (item.includes('?')) crumb = item.split('?')[0];
        return (
          <Breadcrumb.Item key={crumb}>
            <Link href={'/' + crumbs.slice(0, idx + 1).join('/')}>
              {crumb.charAt(0).toUpperCase() + crumb.slice(1)}
            </Link>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};
export default AppBreadcrumbs;
