import { NextPage } from 'next';
import React, { useEffect } from 'react';
import BasicLayout from '../layouts/BasicLayout';
import { Page } from '../common/types/pages';
import { useAuthContext } from '../context/authContext';

const BlogApp: Page = () => {
  const { setIsLoading } = useAuthContext();
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);
  return <h1>Home</h1>;
};

BlogApp.getLayout = (page) => {
  return <BasicLayout>{page}</BasicLayout>;
};
// export async function getStaticProps() {
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }

export default BlogApp;
