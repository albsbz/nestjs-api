import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/axios';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, Divider, List, Skeleton, Space } from 'antd';
import React from 'react';
import Link from 'next/link';

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const AllArticles = () => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  let didLoad = false;

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `articles?take=3&skip=${articles.length}`,
      );
      setArticles([...articles, ...res.data.articles]);
      setCount(res.data.count);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const initLoad = () => {
    if (!didLoad) {
      loadMoreData();
      didLoad = true;
    }
  };

  useEffect(() => {
    initLoad();
  }, []);

  return (
    <List
      dataSource={articles}
      size="large"
      pagination={{
        pageSize: 3,
        total: count,
      }}
      renderItem={(article) => (
        <List.Item
          style={{ height: 100 }}
          key={article._id}
          actions={[
            <IconText
              icon={StarOutlined}
              text="156"
              key="list-vertical-star-o"
            />,
            <IconText
              icon={LikeOutlined}
              text="156"
              key="list-vertical-like-o"
            />,
            <IconText
              icon={MessageOutlined}
              text="2"
              key="list-vertical-message"
            />,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar src={article.author.avatar?.url || ''} />}
            title={
              <Link href={`/article/${article.slug}`}>{article.title}</Link>
            }
            description={article.description}
          />
          {article.description}
        </List.Item>
      )}
    />
  );
};

export default AllArticles;