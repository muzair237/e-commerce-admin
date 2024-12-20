import React, { useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, CardBody } from 'reactstrap';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import debounce from 'lodash/debounce';
import { RxCrossCircled } from 'react-icons/rx';
import { format } from 'date-fns';

import Button from '../Atoms/Button';

const GeneralGlobalFilter = ({ setFilters }) => {
  const [searchText, setSearchText] = useState('');
  const flatpickrRef = useRef(null);
  const debounceRef = useRef(0);
  const [permissionFilter, setPermissionFilter] = useState({ label: 'Latest', value: 'latest' });
  const [typeFilter, setTypeFilter] = useState({ label: 'All', value: 'all' });

  const isClearButtonDisabled = !(
    searchText ||
    permissionFilter.value !== 'latest' ||
    typeFilter.value !== 'all' ||
    (flatpickrRef.current && flatpickrRef.current.flatpickr.selectedDates.length > 0)
  );

  const options = [
    { label: 'A - Z', value: 'asc' },
    { label: 'Z - A', value: 'desc' },
    { label: 'Latest', value: 'latest' },
    { label: 'Earliest', value: 'earliest' },
  ];

  const onSearchCallText = useMemo(
    () =>
      debounce(value => {
        debounceRef.current += 1;
        const LocalRef = debounceRef.current;
        setTimeout(() => {
          if (LocalRef === debounceRef.current) {
            console.log('value: ', value);
            setFilters(prev => ({
              ...prev,
              searchText: value,
            }));
          }
        }, 1);
      }, 300),
    [],
  );

  const onChangeFilter = useMemo(
    () => filter => {
      setPermissionFilter(filter);
      setFilters(prev => ({
        ...prev,
        sort: filter.value,
      }));
    },
    [],
  );

  const onChangeDateFilter = useMemo(
    () => filter => {
      const [startDate, endDate] = filter;
      if (startDate && endDate) {
        setFilters(prev => ({
          ...prev,
          startDate: format(new Date(startDate), 'yyyy-MM-dd'),
          endDate: format(new Date(endDate), 'yyyy-MM-dd'),
        }));
      }
    },
    [],
  );

  const clearFilters = useMemo(
    () => () => {
      setSearchText('');
      setPermissionFilter({ label: 'Latest', value: 'latest' });
      setTypeFilter({ label: 'All', value: 'all' });
      flatpickrRef.current.flatpickr.clear();
      setFilters({
        page: 1,
        itemsPerPage: 10,
        getAll: false,
        startDate: '',
        endDate: '',
        searchText: '',
        sort: 'latest',
        type: '',
      });
    },
    [],
  );

  return (
    <CardBody className="">
      <Row className="g-3">
        <Col sm={4}>
          <div className="form-icon">
            <input
              type="text"
              className="form-control form-control-icon search rounded-pill"
              placeholder="Search..."
              value={searchText}
              onChange={({ target: { value } }) => {
                setSearchText(value);
                onSearchCallText(value.trim());
              }}
            />
            <i className="bx bx-search-alt search-icon" />
          </div>
        </Col>
        <Col>
          <Flatpickr
            className="form-control"
            ref={flatpickrRef}
            options={{
              mode: 'range',
              dateFormat: 'Y-m-d',
              onChange: onChangeDateFilter,
            }}
            placeholder="Select Date"
          />
        </Col>
        <Col xl={5}>
          <Row className="g-3">
            <Col sm={4}>
              <div>
                <Select
                  value={permissionFilter}
                  onChange={onChangeFilter}
                  options={options}
                  name="choices-single-default"
                  id="idStatus"
                />
              </div>
            </Col>
            <Col>
              {!isClearButtonDisabled && (
                <Button onClick={clearFilters} className="btn" color="danger">
                  Clear All Filters <RxCrossCircled size={20} />
                </Button>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </CardBody>
  );
};

GeneralGlobalFilter.propTypes = {
  setFilters: PropTypes.func.isRequired,
};

export default GeneralGlobalFilter;
