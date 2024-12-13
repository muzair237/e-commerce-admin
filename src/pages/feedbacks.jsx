import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { Col, Container, Row, Card, CardHeader } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import withAuthProtection from '../components/Common/withAuthProtection';
import { feedbackColumns } from '../common/columns';
import TableContainer from '../components/Common/TableContainer';
import BreadCrumb from '../components/Common/BreadCrumb';
import feedbackThunk from '../slices/feedbacks/thunk';

const Feedbacks = () => {
  const dispatch = useDispatch();
  const feedbacks = useSelector(state => state?.Feedback?.feedbacks || {});
  const isLoading = useSelector(state => state?.Feedback?.isLoading);

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
    dispatch(feedbackThunk.getAllFeedbacks(filters));
  }, [filters]);

  const { feedback_rows, totalCount } = useMemo(
    () => ({
      feedback_rows: feedbacks?.items?.map(_ => [
        format(new Date(_?.createdAt), 'yyyy-MM-dd') || '------------',
        `${_?.user_id?.first_name} ${_?.user_id?.last_name}` || '------------',
        _?.user_id?.email || '------------',
        _?.feedback || '------------',
      ]),
      totalCount: feedbacks?.totalItems,
    }),
    [feedbacks?.items],
  );

  return (
    <>
      <Head>
        <title>WebNova | FEEDBACKS</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="page-content card-animate">
        <Container fluid>
          <BreadCrumb title="Feedbacks" />
          <Row>
            <Col lg={12}>
              <Card id="feedbackList">
                <CardHeader>
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 fw-semibold">Feedback List</h5>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                      columns={feedbackColumns}
                      data={feedback_rows || []}
                      isGlobalFilter
                      isLoading={isLoading}
                      isAdminFilter
                      ignoreSorting
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

export default withAuthProtection(Feedbacks);
