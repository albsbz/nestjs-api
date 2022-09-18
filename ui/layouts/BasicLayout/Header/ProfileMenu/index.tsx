import { memo } from 'react';
import AppAvatarDropdown from './AvatarDropdown';

const AppProfileMenu = () => {
  return (
    <div>
      <AppAvatarDropdown />
    </div>
  );
};

export default memo(AppProfileMenu);
