import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from '../../helpers/common';

const withAuthProtection = WrappedComponent => {
  const AuthenticatedComponent = props => {
    const [isAllowed, setIsAllowed] = useState(false);
    const router = useRouter();
    const token = getCookie(process.env.NEXT_PUBLIC_ADMIN_TOKEN_COOKIE);
    const allowedPages = JSON.parse(getCookie(process.env.NEXT_PUBLIC_ADMIN_ALLOWED_PAGES_COOKIE)) || [];

    useEffect(() => {
      if (!token || !allowedPages) {
        router.replace('/login');
      } else if (token && allowedPages.length > 0 && router.pathname === '/') {
        router.replace(allowedPages[0]);
      } else if (token && allowedPages.includes(router.pathname)) {
        setIsAllowed(true);
      }
    }, [router.pathname, token, allowedPages]);

    // Render the wrapped component if authorized
    return isAllowed && <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuthProtection;
