import { NextPage } from 'next';
import React, { useEffect } from 'react';
import BasicLayout from '../layouts/BasicLayout';
import { TPage } from '../common/types/TPages';
import { useAuthContext } from '../context/authContext';
import HomePage from '../components/homepage/HomePage';

const BlogApp: TPage = () => {
  return <HomePage />;
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
