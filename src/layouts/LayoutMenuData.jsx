import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Navdata = () => {
  const router = useRouter();
  const [isDashboard, setIsDashboard] = useState(false);
  const [isManageBrands, setIsManageBrands] = useState(false);

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
      icon: ' ri-price-tag-fill',
      path: '/manage-brands',
      stateVariables: isManageBrands,
      click(e) {
        e.preventDefault();
        setIsManageBrands(!isManageBrands);
        setIscurrentState('isManageBrands');
        updateIconSidebar(e);
      },
    },
  ];
  return <>{menuItems}</>;
};
export default Navdata;
