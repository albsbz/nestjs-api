import { FC } from 'react';

const Home: FC = () => {
  return <h1>Home</h1>;
};

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Home;
