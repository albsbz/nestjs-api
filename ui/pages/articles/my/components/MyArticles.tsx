import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../utils/axios';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import React from 'react';

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const getArticles = async () => {
    const res = await axiosInstance.get('articles/my');
    if (res?.data) {
      setArticles(res.data);
    }
  };

  let didInit = false;

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      getArticles();
    }
  }, []);

  return (
    <>
      <h1>My articles</h1>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {},
          pageSize: 3,
        }}
        dataSource={articles}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={(item) => (
          <List.Item
            key={item.id}
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
            extra={
              <img
                width={272}
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<a href={item.href}>{item.title}</a>}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
    </>
  );
};

export default MyArticles;
