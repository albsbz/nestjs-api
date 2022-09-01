import { useRouter } from 'next/router';

const ArticlePage = ({ article }) => {
  const router = useRouter();
  return <h1>{JSON.stringify(article)}</h1>;
};

export default ArticlePage;
