import { Card, Tooltip } from 'antd';
import Link from 'next/link';

const AppAvatarTooltipCard = ({ author }) => {
  return (
    <div>
      <Card title={author.name} bordered={false}>
        {author.about}
      </Card>
    </div>
  );
};

const AppAuthorAvatar = ({ author, src }) => {
  return (
    <Link href="/">
      <Tooltip
        title={<AppAvatarTooltipCard author={author} />}
        placement="bottomLeft"
        color="white"
      >
        <img src={src} style={{ cursor: 'pointer' }} />
      </Tooltip>
    </Link>
  );
};
export default AppAuthorAvatar;
