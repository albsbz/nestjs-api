import { NextPage } from 'next';
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';

const Home: NextPage = () => {
  return (
    <>
      <h1>Test</h1> <DatePicker />{' '}
    </>
  );
};

// export async function getStaticProps() {
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }

export default Home;
