import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { store } from '../slices/store';
import '../assets/scss/themes.scss';
import Layout from '../layouts';
import UtilsContextProvider from '../contexts/utilsContext';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <UtilsContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UtilsContextProvider>
    </Provider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}),
};
