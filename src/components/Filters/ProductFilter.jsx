import React from 'react';
import PropTypes from 'prop-types';

import GeneralGlobalFilter from './GeneralGlobalFilters';

const ProductFilter = ({ setFilters }) => {
  return <GeneralGlobalFilter setFilters={setFilters} />;
};

ProductFilter.propTypes = {
  setFilters: PropTypes.func.isRequired,
};

export default ProductFilter;