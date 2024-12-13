import React from 'react';
import Link from 'next/link';
import logoLight from '../../public/images/logo-light.png';
import logoSm from '../../public/images/logo-sm.png';
import logoDark from '../../public/images/logo-dark.png';
import FullScreenDropdown from '../components/Common/FullScreenDropdown';
import ProfileDropdown from '../components/Common/ProfileDropdown';
import LightDark from '../components/Common/LightDark';

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  const toogleMenuBtn = () => {
    const windowSize = document.documentElement.clientWidth;

    if (windowSize > 767) document.querySelector('.hamburger-icon').classList.toggle('open');

    // For collapse horizontal menu
    if (document.documentElement.getAttribute('data-layout') === 'horizontal') {
      const bodyHasMenuClass = document.body.classList.contains('menu');
      if (bodyHasMenuClass) {
        document.body.classList.remove('menu');
      } else {
        document.body.classList.add('menu');
      }
    }

    // For collapse vertical menu
    if (document.documentElement.getAttribute('data-layout') === 'vertical') {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove('vertical-sidebar-enable');
        const sidebarSize = document.documentElement.getAttribute('data-sidebar-size');
        if (sidebarSize === 'sm') {
          document.documentElement.setAttribute('data-sidebar-size', '');
        } else {
          document.documentElement.setAttribute('data-sidebar-size', 'sm');
        }
      } else if (windowSize > 1025) {
        document.body.classList.remove('vertical-sidebar-enable');
        const sidebarSize = document.documentElement.getAttribute('data-sidebar-size');
        const newSidebarSize = sidebarSize === 'lg' ? 'sm' : 'lg';
        document.documentElement.setAttribute('data-sidebar-size', newSidebarSize);
      } else if (windowSize <= 767) {
        document.body.classList.add('vertical-sidebar-enable');
        document.documentElement.setAttribute('data-sidebar-size', 'lg');
      }
    }

    // Two column menu
    if (document.documentElement.getAttribute('data-layout') === 'twocolumn') {
      const hasTwoColumnPanelClass = document.body.classList.contains('twocolumn-panel');
      if (hasTwoColumnPanelClass) {
        document.body.classList.remove('twocolumn-panel');
      } else {
        document.body.classList.add('twocolumn-panel');
      }
    }
  };
  return (
    <>
      <header id="page-topbar" className={headerClass}>
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box horizontal-logo">
                <Link href="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoDark} alt="" height="17" />
                  </span>
                </Link>

                <Link href="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoLight} alt="" height="17" />
                  </span>
                </Link>
              </div>
              <button
                onClick={toogleMenuBtn}
                type="button"
                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                id="topnav-hamburger-icon">
                <span className="hamburger-icon">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>

            <div className="d-flex align-items-center">
              <FullScreenDropdown />
              <LightDark layoutMode={layoutModeType} onChangeLayoutMode={onChangeLayoutMode} />
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
