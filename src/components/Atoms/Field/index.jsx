import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Input } from 'reactstrap';
import TogglePasswordIcon from '../TogglePasswordIcon';
import { StyledInput, Error, InputWrapper } from './Field.styles';
import Label from '../Label';
import InputIcon from '../InputIcon';
import UploadFile from '@/components/Molecules/UploadFile';

const Field = forwardRef(
  ({ label, name, type, placeholder, disabled, options, prefix, suffix, rules, invalid, error, ...props }, ref) => {
    const [passwordShow, setPasswordShow] = useState(false);
    const isFieldrequired = !!rules?.filter(({ required }) => required).length;
    const isError = !!(invalid || error);

    return (
      <>
        {type !== 'checkbox' && (
          <Label htmlFor={name}>
            {isFieldrequired && '*'} {label}
          </Label>
        )}
        <InputWrapper>
          {prefix && (
            <InputIcon prefix={prefix} disabled={disabled} invalid={isError}>
              {prefix}
            </InputIcon>
          )}

          {type === 'password' ? (
            <>
              <StyledInput
                ref={ref}
                name={name}
                type={passwordShow ? 'text' : 'password'}
                className="form-control"
                placeholder={placeholder}
                $isInvalid={isError}
                {...props}
              />
              <TogglePasswordIcon passwordShow={passwordShow} onClick={() => setPasswordShow(!passwordShow)} />
            </>
          ) : type === 'checkbox' ? (
            <div className="form-check">
              <Input
                ref={ref}
                type="checkbox"
                name={name}
                onChange={e => props.onChange({ name, value: e.target.checked })}
                className="form-check-input"
                {...props}
              />
              <Label htmlFor={name}>
                {isFieldrequired && '*'} {label}
              </Label>
            </div>
          ) : type === 'select' ? (
            <Select
              ref={ref}
              name={name}
              onChange={selectedOption => props.onChange(name, selectedOption)}
              options={options}
              {...props}
            />
          ) : type === 'textarea' ? (
            <StyledInput
              as="textarea"
              rows={3}
              name={name}
              className="form-control"
              placeholder={placeholder}
              {...props}
            />
          ) : type === 'file' ? (
            <UploadFile {...props} />
          ) : (
            <StyledInput
              ref={ref}
              name={name}
              type={type}
              className="form-control"
              placeholder={placeholder}
              $isInvalid={isError}
              {...props}
            />
          )}

          {suffix && (
            <InputIcon suffix={suffix} disabled={disabled} invalid={isError}>
              {suffix}
            </InputIcon>
          )}
        </InputWrapper>
        {isError && (
          <Error id={`${name}Error`} role="alert">
            <span className="error">{error}</span>
          </Error>
        )}
      </>
    );
  },
);

Field.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'password', 'checkbox', 'select', 'textarea']).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    }),
  ),
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      required: PropTypes.bool,
    }),
  ),
  invalid: PropTypes.bool,
  error: PropTypes.string,
};

export default Field;
