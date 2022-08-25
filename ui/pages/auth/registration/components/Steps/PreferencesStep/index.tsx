import { useRouter } from 'next/router';
import AppProfileSettings from '../../../../../../components/AppProfileSettings';
import AppUploadAvatar from '../../../../../../components/AppProfileSettings/components/AppUploadAvatar';

const PreferencesStep = () => {
  const router = useRouter();
  const next = () => {
    // router.push('/');
  };
  return (
    <div>
      <AppProfileSettings profile={{}} next={next} />
    </div>
  );
};

export default PreferencesStep;
