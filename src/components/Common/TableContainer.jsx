import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';

import Skeleton from '../Atoms/Skeleton';
// import GlobalFilter from './GlobalFilter';
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
  // ...props
}) => (
  <>
    <Row className="mb-3">
      {isGeneralGlobalFilter && <GeneralGlobalFilter setFilters={setFilters} />}
      {isProductFilter && <ProductFilter setFilters={setFilters} />}
      {/* {isGlobalFilter && isRoleFilter && <GlobalFilter isRoleFilter={isRoleFilter} setFilters={setFilters} />}
      {isGlobalFilter && isAdminFilter && (
        <GlobalFilter isAdminFilter={isAdminFilter} setFilters={setFilters} {...props} />
      )} */}
    </Row>
    <div className="table-responsive table-card mt-3 mb-1">
      <table className="table align-middle" id="Table">
        <thead className="table-light">
          <tr>
            {columns &&
              columns.length > 0 &&
              columns.map(column => (
                <th key={column} className="text-muted">
                  {column}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="list form-check-all">
          {isLoading ? (
            Array(8)
              .fill()
              .map((_, i) => (
                <tr key={i}>
                  {columns?.map(index => (
                    <td key={index}>
                      <Skeleton width={100} height={15} />
                    </td>
                  ))}
                </tr>
              ))
          ) : data && data.length > 0 ? (
            data.map(rows => (
              <tr key={rows?.name}>
                {rows.map(el => (
                  <td key={el}>{el}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns?.length} className="text-center">
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
  data: PropTypes.shape({}).isRequired,
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
