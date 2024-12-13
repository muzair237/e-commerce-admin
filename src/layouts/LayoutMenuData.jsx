import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Navdata = () => {
  const router = useRouter();
  const [isDashboard, setIsDashboard] = useState(false);
  const [isPermissions, setIsPermissions] = useState(false);
  const [isRoles, setIsRoles] = useState(false);
  const [isAdmins, setIsAdmins] = useState(false);
  const [isUsers, setIsUsers] = useState(false);
  const [isQnA, setIsQna] = useState(false);
  const [isFeedbacks, setIsFeedbacks] = useState(false);

  const [iscurrentState, setIscurrentState] = useState('Dashboard');

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute('subitems')) {
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
        setIscurrentState('Dashboard');
        updateIconSidebar(e);
      },
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
    {
      id: 'users',
      label: 'Users',
      icon: 'ri-user-fill',
      path: '/users',
      stateVariables: isUsers,
      click(e) {
        e.preventDefault();
        setIsUsers(!isUsers);
        setIscurrentState('Users');
        updateIconSidebar(e);
      },
    },
    {
      id: 'QnA',
      label: 'QnA',
      icon: 'ri-questionnaire-fill',
      path: '/qna',
      stateVariables: isQnA,
      click(e) {
        e.preventDefault();
        setIsQna(!isQnA);
        setIscurrentState('QnA');
        updateIconSidebar(e);
      },
    },
    {
      id: 'feedbacks',
      label: 'Feedbacks',
      icon: 'ri-feedback-fill',
      path: '/feedbacks',
      stateVariables: isFeedbacks,
      click(e) {
        e.preventDefault();
        setIsFeedbacks(!isFeedbacks);
        setIscurrentState('Feedbacks');
        updateIconSidebar(e);
      },
    },
  ];
  return <>{menuItems}</>;
};
export default Navdata;
