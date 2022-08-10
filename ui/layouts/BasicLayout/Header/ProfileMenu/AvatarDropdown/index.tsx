import { Avatar, Dropdown, Menu, Space } from 'antd';
import { useRouter } from 'next/router';

const AppAvatarDropdown: React.FC = () => {
  const router = useRouter();
  const menu = () => {
    // const router = useRouter();
    const handleLogout = (a) => {
      console.log('logout!', a);
      // router.push('/logout');
    };
    return (
      <Menu
        items={[
          {
            key: '1',
            label: <a onClick={handleLogout}>Logout</a>,
          },
        ]}
      />
    );
  };

  return (
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
};

export default AppAvatarDropdown;
