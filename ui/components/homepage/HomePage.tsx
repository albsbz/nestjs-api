import { useEffect, useState } from 'react';
import { axiosInstance } from '../../utils/axios';

const HomePage = () => {
  let didLoad = false;
  const [articles, setArticles] = useState([]);

  const loadData = async () => {
    const resp = await axiosInstance.get('articles');
    if (resp?.data?.articles) setArticles(resp.data.articles);
  };

  const initLoad = () => {
    if (!didLoad) {
      loadData();
      didLoad = true;
    }
  };

  useEffect(() => {
    initLoad();
  }, []);

  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles?.length ? (
          articles.map((article) => (
            <li key={article._id}>{JSON.stringify(article)}</li>
          ))
        ) : (
          <li>not found</li>
        )}
      </ul>
    </div>
  );
};

export default HomePage;
