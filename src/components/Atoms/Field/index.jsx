import React, { useState, useEffect } from 'react';
import { Field, useFormikContext, ErrorMessage } from 'formik';
import Select from 'react-select';
import TogglePasswordIcon from '../TogglePasswordIcon';
import { StyledInput, Error } from './Input.styles';

const Input = ({ name, type, placeholder, value, defaultValue, options, ...props }) => {
  const { setFieldValue, touched, values, errors } = useFormikContext();
  const [passwordShow, setPasswordShow] = useState(false);
  useEffect(() => {
    if (defaultValue) {
      setFieldValue(name, defaultValue);
    }
  }, []);

  const isInvalid = (touched[name] && !!errors[name]) || errors[name] === '';
  const isRequiredError = errors?.[name]?.toLowerCase()?.includes('required');

  return (
    <>
      {type === 'password' ? (
        <>
          {' '}
          <StyledInput
            $isInvalid={isInvalid}
            name={name}
            type={passwordShow ? 'text' : 'password'}
            className="form-control"
            placeholder={placeholder}
            {...props}
          />{' '}
          <TogglePasswordIcon onClick={() => setPasswordShow(!passwordShow)} {...props} />{' '}
        </>
      ) : type === 'checkbox' ? (
        <Field name={name} type={type} className="form-check-input" />
      ) : type === 'select' ? (
        <Select
          name={name}
          onChange={selectedOption => setFieldValue(name, selectedOption)}
          options={options}
          value={values[name] || value || defaultValue}
          {...props}
        />
      ) : type === 'textarea' ? (
        <Field
          as="textarea"
          rows={3}
          name={name}
          className="form-control"
          placeholder={placeholder}
          value={values[name] || []}
          {...props}
        />
      ) : (
        <StyledInput
          $isInvalid={isInvalid}
          name={name}
          type={type}
          className="form-control"
          placeholder={placeholder}
          value={values[name] || []}
          {...props}
        />
      )}{' '}
      {!isRequiredError && <ErrorMessage name={name}>{msg => <Error type="invalid">{msg}</Error>}</ErrorMessage>}
    </>
  );
};
export default Input;
