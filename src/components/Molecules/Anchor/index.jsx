import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { NavLink } from 'reactstrap';
import { useRouter } from 'next/router';

const Anchor = ({ to, href, as, children, className = '', ...props }) => {
  const { pathname } = useRouter();

  if (as === 'button') {
    return (
      <Link className={className} href={href} {...props}>
        {children}
      </Link>
    );
  }

  if (as === 'image') {
    return (
      <Link className={className} href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <NavLink active={pathname === href} className={className} href={href} {...props}>
      {children}
    </NavLink>
  );
};

Anchor.propTypes = {
  to: PropTypes.string,
  href: PropTypes.string,
  as: PropTypes.oneOf(['button']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Anchor.defaultProps = {
  className: '',
};
export default Anchor;
