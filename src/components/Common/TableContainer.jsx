import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';

import Skeleton from '../Atoms/Skeleton';
import Pagination from '../Molecules/Pagination';
import GeneralGlobalFilter from '../Filters/GeneralGlobalFilters';
import ProductFilter from '../Filters/ProductFilter';

const TableContainer = ({
  columns,
  data,
  isGeneralGlobalFilter,
  isProductFilter,
  isLoading,
  isRoleFilter,
  isAdminFilter,
  currentPage,
  totalCount,
  itemsPerPage,
  setFilters,
}) => (
  <>
    <Row className="mb-3">
      {isGeneralGlobalFilter && <GeneralGlobalFilter setFilters={setFilters} />}
      {isProductFilter && <ProductFilter setFilters={setFilters} />}
    </Row>
    <div className="table-responsive table-card mt-3 mb-1">
      <table className="table align-middle" id="Table">
        <thead className="table-light">
          <tr>
            {columns &&
              columns.length > 0 &&
              columns.map((column, index) => (
                <th key={index} className="text-muted">
                  {column}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="list form-check-all">
          {isLoading ? (
            Array(itemsPerPage)
              .fill()
              .map((_, i) => (
                <tr key={i}>
                  {columns?.map((_, idx) => (
                    <td key={idx}>
                      <Skeleton width={100} height={15} />
                    </td>
                  ))}
                </tr>
              ))
          ) : data && data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index}>
                {row.map((el, idx) => (
                  <td key={idx}>{el}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns?.length || 1} className="text-center">
                <div className="noresult">
                  <div className="text-center">
                    <h5 className="mt-2">No Record Found!</h5>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <Pagination setFilters={setFilters} currentPage={currentPage} totalCount={totalCount} itemsPerPage={itemsPerPage} />
  </>
);

TableContainer.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  isGeneralGlobalFilter: PropTypes.bool,
  isProductFilter: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  isRoleFilter: PropTypes.bool,
  isAdminFilter: PropTypes.bool,
  currentPage: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  setFilters: PropTypes.func,
};

export default TableContainer;
