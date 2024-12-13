import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from '../../helpers/common';

const isLoggedIn = Component => props => {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  const token = getCookie(process.env.NEXT_PUBLIC_ADMIN_TOKEN_COOKIE);
  const allowedPages = JSON.parse(getCookie(process.env.NEXT_PUBLIC_ADMIN_ALLOWED_PAGES_COOKIE));
  useEffect(() => {
    if (token && allowedPages) {
      router.replace(allowedPages[0]);
    } else {
      setIsLogged(true);
    }
  }, []);
  return isLogged ? <Component {...props} /> : null;
};

export default isLoggedIn;
