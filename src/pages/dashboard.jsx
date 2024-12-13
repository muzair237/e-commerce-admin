import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import Flatpickr from 'react-flatpickr';
import { RxCrossCircled } from 'react-icons/rx';
import { format } from 'date-fns';
import dashboardThunk from '../slices/dashboard/thunk';
import BreadCrumb from '../components/Common/BreadCrumb';
import withAuthProtection from '../components/Common/withAuthProtection';
import Button from '../components/Atoms/Button';
import { greetings } from '../helpers/common';
import DashCards from '../components/Organisms/DashCards';
import GaugeChart from '../components/Organisms/GuageChart';
import RecentQueries from '../components/Organisms/RecentQueries';
import PieChart from '../components/Organisms/PieChart';

const Dashboard = () => (
  <>
    <Head>
      <title>WebNova | DASHBOARD</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  </>
);

export default withAuthProtection(Dashboard);
