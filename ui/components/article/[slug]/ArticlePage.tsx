import { MoreOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Dropdown,
  Menu,
  PageHeader,
  Row,
  Skeleton,
  Tag,
  Typography,
} from 'antd';

import { useRouter } from 'next/router';
import AppAuthorAvatar from '../../AppAuthorAvatar';
import AppAuthorTooltip from '../../AppAuthorAvatar';
const { Text, Link, Paragraph } = Typography;

const Content: React.FC<{
  children: React.ReactNode;
  extraContent: React.ReactNode;
}> = ({ children, extraContent }) => (
  <Row>
    <div style={{ flex: 1 }}>{children}</div>
    {extraContent}
  </Row>
);

const ArticlePage = ({ article }) => {
  const router = useRouter();

  if (router.isFallback) return <Skeleton />;

  return article ? (
    <div>
      <PageHeader
        title={article.title}
        className="site-page-header"
        subTitle={article?.description || ''}
        tags={<Tag color="blue">Tag</Tag>}
        extra={[
          <Button key="3" type="ghost">
            Hide
          </Button>,
          <Link href={`/article/edit?id=${article._id}`} key="2">
            <Button
              type="primary"
              onClick={() => {
                router.push(`/article/edit?id=${article._id}`);
              }}
            >
              Edit
            </Button>
          </Link>,
          <Button key="1" danger>
            Delete
          </Button>,
        ]}
        avatar={{
          size: 70,
          icon: (
            <AppAuthorAvatar
              author={article.author}
              src={article.author.avatar.url}
            />
          ),
        }}
      >
        <Content extraContent={<div>Extra content</div>}>
          {article.content}
        </Content>
      </PageHeader>
    </div>
  ) : (
    <Skeleton />
  );
};

export default ArticlePage;
