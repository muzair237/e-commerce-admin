import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Row, Col, Input } from 'reactstrap';

import Button from '../../Atoms/Button';

const Pagination = ({ setFilters, currentPage, totalCount, itemsPerPage }) => {
  const debounceRef = useRef(0);
  const maxPage = Math.ceil(totalCount / itemsPerPage);

  const onChangePageNumber = debounce(value => {
    debounceRef.current += 1;
    const localRef = debounceRef.current;
    setTimeout(() => {
      if (localRef === debounceRef.current) {
        setFilters(prev => ({ ...prev, page: value }));
      }
    }, 1);
  }, 300);

  const handleInputChange = target => {
    let value = parseInt(target.value, 10) || 1;
    value = Math.max(1, Math.min(maxPage, value));
    // eslint-disable-next-line no-param-reassign
    target.value = value;
  };

  const updatePage = direction => {
    setFilters(prev => ({ ...prev, page: +prev.page + direction }));
  };

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage >= maxPage;

  return (
    <Row className="justify-content-md-end justify-content-center align-items-center p-2">
      <Col className="col-md-auto">
        <Button
          onClick={() => updatePage(-1)}
          className="btn btn-light btn-outline-dark fw-bold fs-6 previous"
          disabled={isPrevDisabled}>
          {'<'}
        </Button>
      </Col>
      <Col className="col-md-auto d-none d-md-block">
        Page{' '}
        <Input
          className="mx-1"
          type="number"
          min={1}
          style={{
            width: 50,
            display: 'inline-block',
          }}
          max={maxPage}
          value={currentPage}
          disabled={maxPage === 1 || maxPage === 0}
          defaultValue={currentPage}
          onInput={({ target }) => handleInputChange(target)}
          onChange={({ target: { value } }) => onChangePageNumber(value.trim())}
        />
        of <strong>{maxPage}</strong>
      </Col>
      <Col className="col-md-auto">
        <Button
          onClick={() => updatePage(1)}
          className="btn btn-light btn-outline-dark fw-bold fs-6 next"
          disabled={isNextDisabled}>
          {'>'}
        </Button>
      </Col>
    </Row>
  );
};

Pagination.propTypes = {
  setFilters: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
};

export default Pagination;
