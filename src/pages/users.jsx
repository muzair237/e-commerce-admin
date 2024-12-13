import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { Col, Container, Row, Card, CardHeader } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import withAuthProtection from '../components/Common/withAuthProtection';
import { userColumns } from '../common/columns';
import TableContainer from '../components/Common/TableContainer';
import BreadCrumb from '../components/Common/BreadCrumb';
import userThunk from '../slices/users/thunk';

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state?.User?.users || {});
  const isLoading = useSelector(state => state?.User?.isLoading);

  const [filters, setFilters] = useState({
    page: 1,
    itemsPerPage: 10,
    getAll: false,
    startDate: '',
    endDate: '',
    searchText: '',
    sort: 'latest',
  });

  const setSearchQueryCallback = useCallback(newSearchQuery => {
    setFilters(newSearchQuery);
  }, []);

  useEffect(() => {
    dispatch(userThunk.getAllUsers(filters));
  }, [filters]);

  const { user_rows, totalCount } = useMemo(
    () => ({
      user_rows: users?.items?.map(_ => [
        format(new Date(_?.createdAt), 'yyyy-MM-dd') || '------------',
        `${_?.first_name} ${_?.last_name}` || '------------',
        _?.email || '------------',
        format(new Date(_?.DOB), 'yyyy-MM-dd') || '------------',
      ]),
      totalCount: users?.totalItems,
    }),
    [users?.items],
  );

  return (
    <>
      <Head>
        <title>WebNova | USERS</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="page-content card-animate">
        <Container fluid>
          <BreadCrumb title="Users" />
          <Row>
            <Col lg={12}>
              <Card id="userList">
                <CardHeader>
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 fw-semibold">User List</h5>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                      columns={userColumns}
                      data={user_rows || []}
                      isGlobalFilter
                      isLoading={isLoading}
                      isAdminFilter
                      currentPage={filters?.page}
                      totalCount={totalCount}
                      itemsPerPage={filters?.itemsPerPage}
                      setFilters={setSearchQueryCallback}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default withAuthProtection(Users);
