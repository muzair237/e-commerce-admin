import React from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { debounce } from 'lodash';

const ReactSelect = ({
  name,
  placeholder,
  isError,
  async,
  isClearable,
  disabled,
  options,
  defaultOptions,
  loadOptions,
  ...props
}) => {
  const debouncedRef = React.useRef(0);
  const loadSelectOptions = async __ => {
    const _options = await new Promise(resolve => {
      debounce(value => {
        debouncedRef.current += 1;
        const LocalRef = debouncedRef.current;
        setTimeout(() => {
          if (LocalRef === debouncedRef.current) {
            loadOptions(value).then(response => {
              resolve(response);
            });
          }
        }, 300);
      }, 300)(__);
    });

    return _options;
  };

  return (
    <>
      {async ? (
        <AsyncSelect
          placeholder="Select..."
          styles={{
            control: provided => ({
              ...provided,
              borderColor: isError ? 'red' : provided.borderColor,
              transition: 'border-color 0.5s ease',
            }),
          }}
          defaultOptions={defaultOptions}
          isClearable={isClearable}
          isDisabled={disabled}
          name={name}
          options={options}
          loadOptions={loadSelectOptions}
          {...props}
        />
      ) : (
        <Select
          placeholder="Select..."
          styles={{
            control: provided => ({
              ...provided,
              borderColor: isError ? 'red' : provided.borderColor,
              transition: 'border-color 0.5s ease',
            }),
          }}
          isClearable={isClearable}
          isDisabled={disabled}
          name={name}
          options={options}
          {...props}
        />
      )}
    </>
  );
};

ReactSelect.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  isError: PropTypes.bool.isRequired,
  isClearable: PropTypes.bool,
  async: PropTypes.bool,
  disabled: PropTypes.bool,
  options: PropTypes.shape([]).isRequired, // Changed from shape to array
  defaultOptions: PropTypes.shape([]).isRequired, // Changed from shape to array
  loadOptions: PropTypes.func,
};

export default ReactSelect;
