import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { store } from '../slices/store';
import '../assets/scss/themes.scss';
import Layout from '../layouts';
import RefectContextProvider from '../contexts/refetchContext';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <RefectContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RefectContextProvider>
    </Provider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}),
};
