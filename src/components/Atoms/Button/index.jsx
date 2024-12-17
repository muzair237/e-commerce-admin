import React from 'react';
import { StyledButton } from './Button.styles';

const Button = ({ onClick, color, className, type, id, loading, disabled, children, ...props }) => (
  <StyledButton
    onClick={onClick}
    color={color}
    loading={loading}
    disabled={disabled}
    className={className}
    type={type}
    id={id}
    {...props}>
    {loading ? <span className="loader" /> : children}
  </StyledButton>
);

export default Button;
