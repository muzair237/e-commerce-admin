import React from 'react';
import PropTypes from 'prop-types';

const TogglePasswordIcon = ({ passwordShow, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon">
    <i className={`${!passwordShow ? 'ri-eye-off-fill' : 'ri-eye-fill'}  align-middle`} />
  </button>
);

TogglePasswordIcon.propTypes = {
  passwordShow: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TogglePasswordIcon;
