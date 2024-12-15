import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { Col, Container, Row, Card, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import brandsThunk from '@/slices/brands/thunk';
import { manageBrandsColumns } from '@/common/columns';
import { format } from 'date-fns';
import BreadCrumb from '@/components/Common/BreadCrumb';
import TableContainer from '@/components/Common/TableContainer';
import withAuthProtection from '../components/Common/withAuthProtection';

const ManageBrands = () => {
  const dispatch = useDispatch();
  const hasPermission = useSelector(state => state?.Auth?.hasPermission);
  const brands = useSelector(state => state?.Brand?.brands || {});
  const isLoading = useSelector(state => state?.Permission?.isLoading);
  const [filters, setFilters] = useState({
    page: 1,
    itemsPerPage: 10,
    getAll: false,
    startDate: '',
    endDate: '',
    searchText: '',
    sort: 'latest',
    type: '',
  });

  const setSearchQueryCallback = useCallback(newSearchQuery => {
    setFilters(newSearchQuery);
  }, []);

  useEffect(() => {
    dispatch(brandsThunk.getAllBrands(filters));
  }, [filters]);

  const { brands_rows, totalCount } = useMemo(
    () => ({
      brands_rows: brands?.items?.map(_ => [
        format(new Date(_?.created_at), 'yyyy-MM-dd') || '------------',
        _?.name || '------------',
        // actionBtns(_),
      ]),
      totalCount: brands?.totalItems,
    }),
    [brands],
  );

  return (
    <>
      <Head>
        <title>WebNova | MANAGE BRANDS</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Brands" />
          <Row>
            <Col lg={12}>
              <Card id="permissionList">
                <CardHeader>
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 fw-semibold">Manage Brands</h5>
                      </div>
                    </div>
                    {/* {hasPermission.includes('brands.create') && (
                      <div className="col-sm-auto">
                        <div>
                          <Button
                            onClick={() => {
                              setPermission();
                              setPermissionModal(true);
                            }}
                            type="button"
                            className="btn btn-success add-btn"
                            id="create-btn">
                            <i className="ri-add-line align-bottom me-1" /> Create Permission
                          </Button>
                        </div>
                      </div>
                    )} */}
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                      columns={manageBrandsColumns}
                      data={brands_rows || []}
                      isGlobalFilter
                      isLoading={isLoading}
                      isPermissionFilter
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

export default withAuthProtection(ManageBrands);
