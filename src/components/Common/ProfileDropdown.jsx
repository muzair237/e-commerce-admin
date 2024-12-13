import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import Image from 'next/image';
import { useRouter } from 'next/router';
import avatar1 from '../../../public/images/users/user-dummy-img.jpg';
import authThunk from '../../slices/auth/thunk';

const ProfileDropdown = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { name, role } = useSelector(state => state?.Auth?.user || {});

  const logout = () => {
    dispatch(authThunk.logout({ router }));
  };

  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <>
      <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <Image className="rounded-circle header-profile-user" src={avatar1} alt="Header Avatar" />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{name}</span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{role}</span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {name}!</h6>
          <DropdownItem href={`${process.env.PUBLIC_URL}/profile`}>
            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1" />
            <span className="align-middle">Profile</span>
          </DropdownItem>
          <DropdownItem onClick={logout}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1" />{' '}
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default ProfileDropdown;
