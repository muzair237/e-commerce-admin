import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';

import productsThunk from '@/slices/products/thunk';
import { prepareProductFiltersData } from '@/helpers/common';
import { CardBody, Col, Row } from 'reactstrap';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import { RxCrossCircled } from 'react-icons/rx';
import Button from '../Atoms/Button';

const ProductFilter = ({ setFilters }) => {
  const dispatch = useDispatch();
  const { productFilterOptions } = useSelector(state => state?.Product) || {};
  const {
    brandOptions,
    ramOptions,
    storageTypeOptions,
    storageSizeOptions,
    processorNameOptions,
    processorGenOptions,
    graphicsCardTypeOptions,
    graphicsCardMemorySizes,
  } = prepareProductFiltersData(productFilterOptions);

  const [searchText, setSearchText] = useState('');
  const flatpickrRef = useRef(null);
  const debounceRef = useRef(0);

  // Filter States
  const [sortFilterDefaultOption, setSortFilterDefaultOption] = useState({ label: 'Latest', value: 'latest' });
  const [brandFilter, setBrandFilter] = useState();
  const [ramSizeFilter, setRamSizeFilter] = useState();
  const [storageTypeFilter, setStorageTypeFilter] = useState();
  const [storageSizeFilter, setStorageSizeFilter] = useState();
  const [processorNameFilter, setProcessorNameFilter] = useState();
  const [processorGenFilter, setProcessorGenFilter] = useState();
  const [graphicsCardTypeFilter, setGraphicsCardTypeFilter] = useState();
  const [graphicsCardMemorySizeFilter, setGraphicsCardMemorySizeFilter] = useState();

  const sortOptions = [
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

  const onFilterChange = useMemo(
    () => (filterName, value) => {
      switch (filterName) {
        case 'brand':
          setBrandFilter(value || ''); // Update only the brand filter
          break;
        case 'ram':
          setRamSizeFilter(value || ''); // Update only the RAM filter
          break;
        case 'storageType':
          setStorageTypeFilter(value || ''); // Update only the storage type filter
          break;
        case 'storageSize':
          setStorageSizeFilter(value || ''); // Update only the storage size filter
          break;
        case 'processorName':
          setProcessorNameFilter(value || ''); // Update only the processor name filter
          break;
        case 'processorGen':
          setProcessorGenFilter(value || ''); // Update only the processor generation filter
          break;
        case 'graphicsCardType':
          setGraphicsCardTypeFilter(value || ''); // Update only the graphics card type filter
          break;
        case 'graphicsCardMemorySize':
          setGraphicsCardMemorySizeFilter(value || ''); // Update only the graphics card memory size filter
          break;
        default:
          break;
      }
    },
    [],
  );

  const clearFilters = useMemo(
    () => () => {
      setSearchText('');
      setSortFilterDefaultOption({ label: 'Latest', value: 'latest' });
      setBrandFilter({ label: '', value: '' });
      setRamSizeFilter();
      setStorageTypeFilter();
      setStorageSizeFilter();
      setProcessorNameFilter();
      setProcessorGenFilter();
      setGraphicsCardTypeFilter();
      setGraphicsCardMemorySizeFilter();
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
        brand: '',
        ram: '',
        storageType: '',
        storageSize: '',
        processorName: '',
        processorGen: '',
        graphicsCardType: '',
        graphicsCardMemorySize: '',
      });
    },
    [],
  );

  useEffect(() => {
    dispatch(productsThunk.getProductFilterOptions());
  }, []);

  return (
    <div>
      <CardBody className="">
        <Row className="g-3">
          <Col xs={12} sm={6} md={3} lg={2}>
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
          <Col xs={12} sm={6} md={3} lg={2}>
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
          <Col xs={12} sm={6} md={3} lg={2}>
            <Select
              value={sortFilterDefaultOption}
              onChange={selectedOption => onFilterChange('sort', selectedOption)}
              options={sortOptions}
              name="choices-single-default"
              id="idStatus"
            />
          </Col>
          <Col xs={12} sm={6} md={3} lg={2}>
            <Select
              placeholder="Select Brand"
              value={brandFilter}
              options={brandOptions}
              onChange={selectedOption => onFilterChange('brand', selectedOption)}
              name="choices-single-default"
              id="brand"
            />
          </Col>
          <Col xs={12} sm={6} md={3} lg={2}>
            <Select
              placeholder="Select RAM Size"
              value={ramSizeFilter}
              options={ramOptions}
              onChange={selectedOption => onFilterChange('ram', selectedOption)}
              name="choices-single-default"
              id="ram"
            />
          </Col>
          <Col xs={12} sm={6} md={3} lg={2}>
            <Select
              placeholder="Select Storage Type"
              value={storageTypeFilter}
              options={storageTypeOptions}
              onChange={selectedOption => onFilterChange('storageType', selectedOption)}
              name="choices-single-default"
              id="storageType"
            />
          </Col>
          <Col xs={12} sm={6} md={3} lg={2}>
            <Select
              placeholder="Select Storage Size"
              value={storageSizeFilter}
              options={storageSizeOptions}
              onChange={selectedOption => onFilterChange('storageSize', selectedOption)}
              name="choices-single-default"
              id="storageSize"
            />
          </Col>
          <Col xs={12} sm={6} md={3} lg={2}>
            <Select
              placeholder="Select Processor Name"
              value={processorNameFilter}
              options={processorNameOptions}
              onChange={selectedOption => onFilterChange('processorName', selectedOption)}
              name="choices-single-default"
              id="processorName"
            />
          </Col>
          <Col xs={12} sm={6} md={3} lg={2}>
            <Select
              placeholder="Processor Generation"
              value={processorGenFilter}
              options={processorGenOptions}
              onChange={selectedOption => onFilterChange('processorGen', selectedOption)}
              name="choices-single-default"
              id="processorGen"
            />
          </Col>
          <Col xs={12} sm={6} md={3} lg={2}>
            <Select
              placeholder="Select Graphics Card Type"
              value={graphicsCardTypeFilter}
              options={graphicsCardTypeOptions}
              onChange={selectedOption => onFilterChange('graphicsCardType', selectedOption)}
              name="choices-single-default"
              id="processorGen"
            />
          </Col>
          <Col xs={12} sm={6} md={3} lg={2}>
            <Select
              placeholder="Select Graphics Card Memory Size"
              value={graphicsCardMemorySizeFilter}
              options={graphicsCardMemorySizes}
              onChange={selectedOption => onFilterChange('graphicsCardMemorySize', selectedOption)}
              name="choices-single-default"
              id="storageType"
            />
          </Col>
          <Col xs={12} sm={6} md={3} lg={2}>
            <Button
              onClick={clearFilters}
              className="btn"
              disabled={
                !(
                  searchText ||
                  sortFilterDefaultOption.value !== 'latest' ||
                  (flatpickrRef.current && flatpickrRef.current.flatpickr.selectedDates.length > 0) ||
                  brandFilter ||
                  ramSizeFilter ||
                  storageTypeFilter ||
                  storageSizeFilter ||
                  processorNameFilter ||
                  processorGenFilter ||
                  graphicsCardTypeFilter ||
                  graphicsCardMemorySizeFilter
                )
              }
              color="danger">
              Clear All Filters <RxCrossCircled size={20} />
            </Button>
          </Col>
        </Row>
      </CardBody>
    </div>
  );
};

ProductFilter.propTypes = {
  setFilters: PropTypes.func.isRequired,
};

export default ProductFilter;
