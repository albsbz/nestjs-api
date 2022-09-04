import AppProfileForm from './AppProfileForm';
import AppUploadAvatar from './AppUploadAvatar';

const AppProfileSettings = ({ profile, next }) => {
  return (
    <div>
      <AppUploadAvatar avatarURL={profile?.avatar?.url} />
      <AppProfileForm next={next} profile={profile} />
    </div>
  );
};

export default AppProfileSettings;
