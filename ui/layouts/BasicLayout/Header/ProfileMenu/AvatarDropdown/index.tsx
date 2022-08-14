import { Avatar, Dropdown, Menu, Space } from 'antd';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../../../../context/authContext';

const AppAvatarDropdown: React.FC = () => {
  const router = useRouter();
  const { logout } = useAuthContext();
  const menu = () => {
    // const router = useRouter();
    const handleLogout = () => {
      logout();
      router.push('/');
    };
    return (
      <Menu
        items={[
          {
            key: '1',
            label: <a onClick={handleLogout}>Logout</a>,
          },
          {
            key: '2',
            label: (
              <a onClick={() => router.push('/auth/profile')}>My profile</a>
            ),
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
