import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Col, Card, CardHeader, CardBody } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import TableContainer from '../../Common/TableContainer';
import { recentQueriesColumns } from '../../../common/columns';
import dashboardThunk from '../../../slices/dashboard/thunk';

const RecentQueries = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state?.Dashboard?.isLoading);
  const [filters, setFilters] = useState({ page: 1, itemsPerPage: 4 });
  const recentQueries = useSelector(state => state?.Dashboard?.recentQueries);

  const setSearchQueryCallback = useCallback(newSearchQuery => {
    setFilters(newSearchQuery);
  }, []);

  useEffect(() => {
    dispatch(dashboardThunk.getRecentQueries(filters));
  }, [filters]);

  const { recentQueries_rows, totalCount } = useMemo(
    () => ({
      recentQueries_rows: recentQueries?.items?.map(_ => [
        format(new Date(_?.createdAt), 'yyyy-MM-dd') || '------------',
        _?.message || '------------',
        _?.sender || '------------',
      ]),
      totalCount: recentQueries?.totalItems,
    }),
    [recentQueries],
  );
  return (
    <>
      <Col xl={12}>
        <Card>
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Recent Queries</h4>
          </CardHeader>

          <CardBody>
            <TableContainer
              columns={recentQueriesColumns}
              data={recentQueries_rows || []}
              isLoading={isLoading}
              currentPage={filters?.page}
              totalCount={totalCount}
              itemsPerPage={filters?.itemsPerPage}
              setFilters={setSearchQueryCallback}
            />
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default RecentQueries;
