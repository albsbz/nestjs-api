import { useRouter } from 'next/router';
import styles from './style.module.scss';
interface Props {
  left?: boolean;
}
const Logo = ({ left }: Props) => {
  const router = useRouter();
  return (
    <div
      className={[styles.logo, left && styles.float].join(' ')}
      onClick={() => {
        router.push('/');
      }}
    >
      <h1>{process.env.NEXT_PUBLIC_UI_LOGO_NAME}</h1>
    </div>
  );
};

export default Logo;
