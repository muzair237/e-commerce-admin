import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

import { getCookie } from '@/helpers/common';
import authThunk from '@/slices/auth/thunk';
import {
  changeLayout,
  changeSidebarTheme,
  changeLayoutMode,
  changeLayoutWidth,
  changeLayoutPosition,
  changeTopbarTheme,
  changeLeftsidebarSizeType,
  changeLeftsidebarViewType,
  changeSidebarImageType,
} from '@/slices/layouts/thunk';
import { Toaster } from 'react-hot-toast';
import { BsExclamationTriangle } from 'react-icons/bs';
import Loader from '@/components/Molecules/Loader';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [headerClass, setHeaderClass] = useState('');
  const dispatch = useDispatch();

  const { isLoggedIn, isSessionExpired } = useSelector(state => state?.Auth);

  const {
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
  } = useSelector(state => ({
    layoutType: state.Layout.layoutType,
    leftSidebarType: state.Layout.leftSidebarType,
    layoutModeType: state.Layout.layoutModeType,
    layoutWidthType: state.Layout.layoutWidthType,
    layoutPositionType: state.Layout.layoutPositionType,
    topbarThemeType: state.Layout.topbarThemeType,
    leftsidbarSizeType: state.Layout.leftsidbarSizeType,
    leftSidebarViewType: state.Layout.leftSidebarViewType,
    leftSidebarImageType: state.Layout.leftSidebarImageType,
  }));

  function scrollNavigation() {
    const scrollup = document.documentElement.scrollTop;
    if (scrollup > 50) {
      setHeaderClass('topbar-shadow');
    } else {
      setHeaderClass('');
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollNavigation, true);
  });

  useEffect(() => {
    window.addEventListener('scroll', scrollNavigation);

    return () => {
      window.removeEventListener('scroll', scrollNavigation);
    };
  }, []);

  useEffect(() => {
    if (
      layoutType ||
      leftSidebarType ||
      layoutModeType ||
      layoutWidthType ||
      layoutPositionType ||
      topbarThemeType ||
      leftsidbarSizeType ||
      leftSidebarViewType ||
      leftSidebarImageType
    ) {
      dispatch(changeLeftsidebarViewType(leftSidebarViewType));
      dispatch(changeLeftsidebarSizeType(leftsidbarSizeType));
      dispatch(changeSidebarTheme(leftSidebarType));
      dispatch(changeLayoutMode(layoutModeType));
      dispatch(changeLayoutWidth(layoutWidthType));
      dispatch(changeLayoutPosition(layoutPositionType));
      dispatch(changeTopbarTheme(topbarThemeType));
      dispatch(changeLayout(layoutType));
      dispatch(changeSidebarImageType(leftSidebarImageType));
    }
  }, [
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    dispatch,
  ]);

  const onChangeLayoutMode = value => {
    if (changeLayoutMode) {
      dispatch(changeLayoutMode(value));
    }
  };

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(getCookie(process.env.NEXT_PUBLIC_ADMIN_TOKEN_COOKIE));

  useEffect(() => {
    router.events.on('routeChangeError', () => setLoading(false));
    router.events.on('routeChangeStart', () => setLoading(true));
    router.events.on('routeChangeComplete', () => setLoading(false));

    return () => {
      router.events.off('routeChangeError', () => setLoading(false));
      router.events.off('routeChangeStart', () => setLoading(true));
      router.events.off('routeChangeComplete', () => setLoading(false));
    };
  }, [router.events]);

  useEffect(() => {
    if (token) {
      dispatch(authThunk.me());
    }
  }, [token]);

  return (
    <>
      {loading && <Loader />}
      {token && isSessionExpired && (
        <ModalWrapper
          isOpen={isSessionExpired}
          title="Session Expired!"
          headerIcon={<BsExclamationTriangle />}
          size="md"
          backdrop="static"
          closeable={false}
          footerBtnText="Logout"
          footerBtnOnClick={() => dispatch(authThunk.logout({ router }))}>
          <p>Your session has expired due to timeout. Please log in again to continue your session.</p>
        </ModalWrapper>
      )}
      {token && isLoggedIn ? (
        <div id="layout-wrapper">
          <Header headerClass={headerClass} layoutModeType={layoutModeType} onChangeLayoutMode={onChangeLayoutMode} />
          <Sidebar layoutType={layoutType} />
          <div className="main-content">
            {children}
            <Footer />
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
      <Toaster
        position="top-center"
        reverseOrder
        gutter={8}
        toastOptions={{
          duration: 5000,
        }}
      />
    </>
  );
};

Layout.propTypes = {
  children: propTypes.node.isRequired,
};

export default Layout;
