import { Avatar, Dropdown, Image, Menu, Space } from 'antd';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../../../../context/authContext';

const AppAvatarDropdown: React.FC = () => {
  const router = useRouter();
  const { logout, user } = useAuthContext();
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

  const avatarURL = user?.avatarURL;

  const AvatarImage = avatarURL && (
    <Image src={avatarURL} preview={false} alt="avatar" />
  );

  return (
    <Space direction="vertical">
      <Space wrap>
        <Dropdown overlay={menu} placement="bottom">
          <Avatar
            style={{ verticalAlign: 'middle' }}
            size="large"
            src={AvatarImage}
          >
            {/* {'Tom'} */}
          </Avatar>
        </Dropdown>
      </Space>
    </Space>
  );
};

export default AppAvatarDropdown;
