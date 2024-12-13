import React, { useState, useEffect } from 'react';
import { Field, useFormikContext, ErrorMessage } from 'formik';
import { TagsInput } from 'react-tag-input-component';
import Select from 'react-select';
import TogglePasswordIcon from '../TogglePasswordIcon';
import { Error } from './Input.styles';

const Input = ({ name, type, placeholder, value, defaultValue, options, ...props }) => {
  const { setFieldValue, values } = useFormikContext();
  const [passwordShow, setPasswordShow] = useState(false);

  useEffect(() => {
    if (defaultValue && defaultValue !== undefined) {
      setFieldValue(name, defaultValue);
    } else if ((value !== undefined && !values[name]) || Array.isArray(value)) {
      setFieldValue(name, value);
    }
  }, []);

  return (
    <>
      {type === 'password' ? (
        <>
          <Field
            name={name}
            type={passwordShow ? 'text' : 'password'}
            className="form-control"
            placeholder={placeholder}
            {...props}
          />
          <TogglePasswordIcon onClick={() => setPasswordShow(!passwordShow)} {...props} />
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
      ) : type === 'tags' ? (
        <TagsInput
          onChange={selectedTags => setFieldValue(name, selectedTags)}
          name={name}
          placeHolder={placeholder}
          value={value || values[name]}
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
        <Field
          name={name}
          type={type}
          className="form-control"
          placeholder={placeholder}
          value={values[name] || []}
          {...props}
        />
      )}

      {/* ErrorMessage component */}
      <ErrorMessage name={name}>{msg => <Error type="invalid">{msg}</Error>}</ErrorMessage>
    </>
  );
};

export default Input;
