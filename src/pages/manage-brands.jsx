import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { Col, Container, Row, Card, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { MdRemoveRedEye, MdOutlineModeEdit, MdDeleteOutline } from 'react-icons/md';
import brandsThunk from '@/slices/brands/thunk';
import { manageBrandsColumns } from '@/common/columns';
import { format } from 'date-fns';
import BreadCrumb from '@/components/Common/BreadCrumb';
import TableContainer from '@/components/Common/TableContainer';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import ImageComponent from '@/components/Atoms/Image';
import LogoModal from '@/components/Organisms/LogoModal';
import withAuthProtection from '../components/Common/withAuthProtection';
import Anchor from '@/components/Molecules/Anchor';

const ManageBrands = () => {
  const dispatch = useDispatch();
  const [currentLogo, setCurrentLogo] = useState({});
  const [viewLogoModal, setViewLogoModal] = useState(false);
  const [editLogoModal, setEditLogoModal] = useState(false);
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
  });

  const setSearchQueryCallback = useCallback(newSearchQuery => {
    setFilters(newSearchQuery);
  }, []);

  const actionBtns = _ => (
    <div className="d-flex gap-3">
      <div className="viewLogo">
        <Anchor href={_?.logo} target="_blank">
          <MdRemoveRedEye
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setCurrentLogo(_);
              setViewLogoModal(true);
            }}
            color="#007BFF"
            size={19}
            id="viewLogo"
          />
        </Anchor>
        <UncontrolledTooltip placement="top" target="viewLogo">
          View Logo
        </UncontrolledTooltip>
      </div>
      <div className="edit">
        <MdOutlineModeEdit
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentLogo(_);
            setEditLogoModal(true);
          }}
          color="green"
          size={19}
          id="edit"
        />
        <UncontrolledTooltip placement="top" target="edit">
          Edit
        </UncontrolledTooltip>
      </div>
      <div className="remove">
        <MdDeleteOutline
          style={{ cursor: 'pointer' }}
          id="delete"
          size={19}
          color="red"
          // onClick={() => {
          //   setPermissionToDelete(_?._id);
          //   setDeleteModal(true);
          // }}
        />
        <UncontrolledTooltip placement="top" target="delete">
          Delete
        </UncontrolledTooltip>
      </div>
    </div>
  );

  const { brands_rows, totalCount } = useMemo(
    () => ({
      brands_rows: brands?.items?.map(_ => [
        format(new Date(_?.created_at), 'yyyy-MM-dd') || '------------',
        _?.name || '------------',
        actionBtns(_),
      ]),
      totalCount: brands?.totalItems,
    }),
    [brands],
  );

  const handleBrand = payload => {
    console.log('payload', payload);
  };

  useEffect(() => {
    dispatch(brandsThunk.getAllBrands(filters));
  }, [filters]);

  return (
    <>
      <Head>
        <title>WebNova | MANAGE BRANDS</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {/* Edit Logo Modal */}
      <ModalWrapper
        isOpen={editLogoModal}
        toggle={() => setEditLogoModal(false)}
        title={currentLogo?.name?.toUpperCase()}
        size="md"
        backdrop="static"
        isContentCentered={false}>
        <LogoModal
          currentLogo={{
            name: currentLogo.name,
            logo: currentLogo.logo,
          }}
          handleClick={handleBrand}
        />
      </ModalWrapper>

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
                      isGeneralFilter
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
