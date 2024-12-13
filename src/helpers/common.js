export const setCookie = (name, value, domain, days) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  const domainString = domain ? `; domain=${domain}` : '';
  document.cookie = `${name}=${value || ''}${expires}; path=/${domainString}`;

  return true;
};

export const getCookie = name => {
  const nameEQ = `${name}=`;
  const ca = typeof document !== 'undefined' && document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
};

export const clearAllCookies = () => {
  const cookies = document.cookie.split(';');

  cookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();
    document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  });

  return true;
};

export const greetings = () => {
  const currentHour = new Date().getHours();

  return currentHour >= 4 && currentHour < 12
    ? 'Good Morning'
    : currentHour >= 12 && currentHour < 18
    ? 'Good Afternoon'
    : currentHour >= 18 && currentHour < 21
    ? 'Good Evening'
    : 'Good Night';
};
