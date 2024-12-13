import React, { useState, useMemo, useRef } from 'react';
import { Row, Col } from 'reactstrap';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import debounce from 'lodash/debounce';
import { RxCrossCircled } from 'react-icons/rx';
import { format } from 'date-fns';
import Button from '../Atoms/Button';

const PermissionGlobalFilter = ({ setFilters }) => {
  const [searchText, setSearchText] = useState('');
  const flatpickrRef = useRef(null);
  const debounceRef = useRef(0);
  const [permissionFilter, setPermissionFilter] = useState({ label: 'Latest', value: 'latest' });
  const [typeFilter, setTypeFilter] = useState({ label: 'All', value: 'all' });

  const options = [
    { label: 'A - Z', value: 'asc' },
    { label: 'Z - A', value: 'desc' },
    { label: 'Latest', value: 'latest' },
    { label: 'Earliest', value: 'earliest' },
  ];

  const typeOptions = [
    { label: 'All', value: 'all' },
    { label: 'ADMIN', value: 'ADMIN' },
    { label: 'USER', value: 'USER' },
  ];

  const onSearchCallText = useMemo(
    () =>
      debounce(value => {
        debounceRef.current += 1;
        const LocalRef = debounceRef.current;
        setTimeout(() => {
          if (LocalRef === debounceRef.current) {
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

  const onChangeTypeFilter = useMemo(
    () => filter => {
      setTypeFilter(filter);
      setFilters(prev => ({
        ...prev,
        type: filter.value,
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
    <>
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
                // styles={customStyles}
                value={permissionFilter}
                onChange={onChangeFilter}
                options={options}
                name="choices-single-default"
                id="idStatus"
              />
            </div>
          </Col>
          <Col sm={4}>
            <div>
              <Select
                // styles={customStyles}
                value={typeFilter}
                onChange={onChangeTypeFilter}
                options={typeOptions}
                name="choices-single-default"
                id="idStatus"
              />
            </div>
          </Col>
          <Col>
            <Button
              onClick={clearFilters}
              className="btn"
              disabled={
                !(
                  searchText ||
                  permissionFilter.value !== 'latest' ||
                  typeFilter.value !== 'all' ||
                  (flatpickrRef.current && flatpickrRef.current.flatpickr.selectedDates.length > 0)
                )
              }
              color="danger">
              Clear All Filters <RxCrossCircled size={20} />
            </Button>
          </Col>
        </Row>
      </Col>
    </>
  );
};

const RoleGlobalFilter = ({ setFilters }) => {
  const [searchText, setSearchText] = useState('');
  const flatpickrRef = useRef(null);
  const debounceRef = useRef(0);
  const [roleFilter, setRoleFilter] = useState({ label: 'Latest', value: 'latest' });

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
      setRoleFilter(filter);
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
      setRoleFilter({ label: 'Latest', value: 'latest' });
      flatpickrRef.current.flatpickr.clear();
      setFilters({
        page: 1,
        itemsPerPage: 10,
        getAll: false,
        startDate: '',
        endDate: '',
        searchText: '',
        sort: 'latest',
      });
    },
    [],
  );

  return (
    <>
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
                value={roleFilter}
                onChange={onChangeFilter}
                options={options}
                name="choices-single-default"
                id="idStatus"
              />
            </div>
          </Col>
          <Col>
            <Button
              onClick={clearFilters}
              className="btn"
              disabled={
                !(
                  searchText ||
                  roleFilter.value !== 'latest' ||
                  (flatpickrRef.current && flatpickrRef.current.flatpickr.selectedDates.length > 0)
                )
              }
              color="danger">
              Clear All Filters <RxCrossCircled size={20} />
            </Button>
          </Col>
        </Row>
      </Col>
    </>
  );
};

const AdminGlobalFilter = ({ setFilters, uniqueRoles, ignoreSorting }) => {
  const [searchText, setSearchText] = useState('');
  const flatpickrRef = useRef(null);
  const debounceRef = useRef(0);
  const [adminFilter, setAdminFilter] = useState({ label: 'Latest', value: 'latest' });
  const [typeFilter, setTypeFilter] = useState({ label: 'All', value: 'all' });

  const options = ignoreSorting
    ? [
        { label: 'Latest', value: 'latest' },
        { label: 'Earliest', value: 'earliest' },
      ]
    : [
        { label: 'A - Z', value: 'asc' },
        { label: 'Z - A', value: 'desc' },
        { label: 'Latest', value: 'latest' },
        { label: 'Earliest', value: 'earliest' },
      ];

  const typeOptions = uniqueRoles &&
    uniqueRoles.length > 0 && [
      { label: 'All', value: 'all' },
      ...uniqueRoles.map(ele => ({ label: ele.type, value: ele._id })),
    ];

  const onSearchCallText = useMemo(
    () =>
      debounce(value => {
        debounceRef.current += 1;
        const LocalRef = debounceRef.current;
        setTimeout(() => {
          if (LocalRef === debounceRef.current) {
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
      setAdminFilter(filter);
      setFilters(prev => ({
        ...prev,
        sort: filter.value,
      }));
    },
    [],
  );

  const onChangeTypeFilter = useMemo(
    () => filter => {
      setTypeFilter(filter);
      setFilters(prev => ({
        ...prev,
        type: filter.value,
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
      setAdminFilter({ label: 'Latest', value: 'latest' });
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
    <>
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
                // styles={customStyles}
                value={adminFilter}
                onChange={onChangeFilter}
                options={options}
                name="choices-single-default"
                id="idStatus"
              />
            </div>
          </Col>
          {uniqueRoles && uniqueRoles?.length > 0 && (
            <Col sm={4}>
              <div>
                <Select
                  // styles={customStyles}
                  value={typeFilter}
                  onChange={onChangeTypeFilter}
                  options={typeOptions}
                  name="choices-single-default"
                  id="idStatus"
                />
              </div>
            </Col>
          )}
          <Col>
            <Button
              onClick={clearFilters}
              className="btn"
              disabled={
                !(
                  searchText ||
                  adminFilter.value !== 'latest' ||
                  typeFilter.value !== 'all' ||
                  (flatpickrRef.current && flatpickrRef.current.flatpickr.selectedDates.length > 0)
                )
              }
              color="danger">
              Clear All Filters <RxCrossCircled size={20} />
            </Button>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export { PermissionGlobalFilter, RoleGlobalFilter, AdminGlobalFilter };
