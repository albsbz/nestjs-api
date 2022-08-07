import { NextPage } from 'next';
import BasicLayout from '../components/layouts/BasicLayout';

const Home: NextPage = () => {
  return (
    <BasicLayout>
      <h1>Main</h1>
    </BasicLayout>
  );
};

// export async function getStaticProps() {
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }

export default Home;
