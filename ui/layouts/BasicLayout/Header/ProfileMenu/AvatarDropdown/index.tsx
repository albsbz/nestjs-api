import { Avatar, Button, Dropdown, Menu, Space } from 'antd';

const menu = (
  <Menu
    items={[
      {
        key: '1',
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.antgroup.com"
          >
            1st menu item
          </a>
        ),
      },
      {
        key: '2',
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.aliyun.com"
          >
            2nd menu item
          </a>
        ),
      },
      {
        key: '3',
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            3rd menu item
          </a>
        ),
      },
    ]}
  />
);

const AppAvatarDropdown: React.FC = () => (
  <Space direction="vertical">
    <Space wrap>
      <Dropdown overlay={menu} placement="bottom">
        <Avatar style={{ verticalAlign: 'middle' }} size="large">
          {/* {'Tom'} */}
        </Avatar>
      </Dropdown>
    </Space>
  </Space>
);

export default AppAvatarDropdown;
