import React from 'react';
import Head from 'next/head';

import withAuthProtection from '../components/Common/withAuthProtection';

const Dashboard = () => (
  <Head>
    <title>WebNova | DASHBOARD</title>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
  </Head>
);

export default withAuthProtection(Dashboard);
