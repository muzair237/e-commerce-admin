import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import withAuthProtection from '../components/Common/withAuthProtection';
import { useDispatch } from 'react-redux';
import brandsThunk from '@/slices/brands/thunk';

const ManageBrands = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState({
    page: 1,
    itemsPerPage: 10,
    getAll: false,
  });

  useEffect(() => {
    dispatch(brandsThunk.getAllBrands(query));
  }, []);

  return (
    <Head>
      <title>WebNova | MANAGE BRANDS</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
};

export default withAuthProtection(ManageBrands);
