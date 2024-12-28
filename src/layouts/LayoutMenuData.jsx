import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Navdata = () => {
  const router = useRouter();
  const [isDashboard, setIsDashboard] = useState(false);
  const [isManageBrands, setIsManageBrands] = useState(false);
  const [isManageProducts, setIsManageProducts] = useState(false);
  const [isPermissions, setIsPermissions] = useState(false);
  const [isRoles, setIsRoles] = useState(false);
  const [isAdmins, setIsAdmins] = useState(false);

  const [iscurrentState, setIscurrentState] = useState('Dashboard');

  function updateIconSidebar(e) {
    if (e?.target?.getAttribute('subitems')) {
      const ul = document.getElementById('two-column-menu');
      const iconItems = ul.querySelectorAll('.nav-icon.active');
      const activeIconItems = [...iconItems];
      activeIconItems.forEach(item => {
        item.classList.remove('active');
        const id = item.getAttribute('subitems');
        if (document.getElementById(id)) document.getElementById(id).classList.remove('show');
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove('twocolumn-panel');
    if (iscurrentState !== 'Dashboard') {
      setIsDashboard(false);
    }
  }, [router]);

  const menuItems = [
    {
      label: 'Menu',
      isHeader: true,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'ri-dashboard-2-line',
      path: '/dashboard',
      stateVariables: isDashboard,
      click(e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState('isDashboard');
        updateIconSidebar(e);
      },
    },
    {
      id: 'manage-brands',
      label: 'Manage Brands',
      icon: 'ri-price-tag-fill',
      path: '/manage-brands',
      stateVariables: isManageBrands,
      click(e) {
        e.preventDefault();
        setIsManageBrands(!isManageBrands);
        setIscurrentState('isManageBrands');
        updateIconSidebar(e);
      },
    },
    {
      id: 'manage-products',
      label: 'Manage Products',
      icon: 'bx bxs-package',
      path: '/manage-products',
      stateVariables: isManageProducts,
      click(e) {
        e.preventDefault();
        setIsManageProducts(!isManageProducts);
        setIscurrentState('isManageProducts');
        updateIconSidebar(e);
      },
    },
    {
      label: 'Access Control',
      isHeader: true,
    },
    {
      id: 'permissions',
      label: 'Permissions',
      icon: 'ri-key-2-fill',
      path: '/permissions',
      stateVariables: isPermissions,
      click(e) {
        e.preventDefault();
        setIsPermissions(!isPermissions);
        setIscurrentState('Permissions');
        updateIconSidebar(e);
      },
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: 'ri-team-fill',
      path: '/roles',
      stateVariables: isRoles,
      click(e) {
        e.preventDefault();
        setIsRoles(!isRoles);
        setIscurrentState('Roles');
        updateIconSidebar(e);
      },
    },
    {
      id: 'admins',
      label: 'Admins',
      icon: 'ri-admin-fill',
      path: '/admins',
      stateVariables: isAdmins,
      click(e) {
        e.preventDefault();
        setIsAdmins(!isAdmins);
        setIscurrentState('Admins');
        updateIconSidebar(e);
      },
    },
  ];

  return <>{menuItems}</>;
};
export default Navdata;
