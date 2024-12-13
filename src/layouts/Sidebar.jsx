import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SimpleBar from 'simplebar-react';

import { Container } from 'reactstrap';
import VerticalLayouts from './verticalLayout';

import webNovaLogoLg from '../../public/images/svg/webNovaLogoLg.svg';
import webNovaLogoSm from '../../public/images/svg/webNovaLogoSm.svg';
import logoLight from '../../public/images/logo-light.png';

const Sidebar = ({ layoutType }) => {
  useEffect(() => {
    const verticalOverlay = document.getElementsByClassName('vertical-overlay');
    if (verticalOverlay) {
      verticalOverlay[0].addEventListener('click', () => {
        document.body.classList.remove('vertical-sidebar-enable');
      });
    }
  });

  const addEventListenerOnSmHoverMenu = () => {
    // add listener Sidebar Hover icon on change layout from setting
    if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover-active');
    } else if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover-active') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    } else {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    }
  };

  return (
    <>
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box">
          <Link href="/" className="logo logo-dark">
            <span className="logo-sm">
              <Image src={webNovaLogoSm} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <Image src={webNovaLogoLg} alt="" width="210" height="23" />
            </span>
          </Link>

          <Link href="/" className="logo logo-light">
            <span className="logo-sm">
              <Image src={webNovaLogoSm} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <Image src={logoLight} alt="" height="17" />
            </span>
          </Link>
          <button
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover">
            <i className="ri-record-circle-line" />
          </button>
        </div>
        <SimpleBar id="scrollbar" className="h-100">
          <Container fluid>
            <div id="two-column-menu" />
            <ul className="navbar-nav" id="navbar-nav">
              <VerticalLayouts layoutType={layoutType} />
            </ul>
          </Container>
        </SimpleBar>
        <div className="sidebar-background" />
      </div>
      <div className="vertical-overlay" />
    </>
  );
};

export default Sidebar;
