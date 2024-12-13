import React from 'react';

const TogglePasswordIcon = ({ onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon">
    <i className="ri-eye-fill align-middle" />
  </button>
);

export default TogglePasswordIcon;
