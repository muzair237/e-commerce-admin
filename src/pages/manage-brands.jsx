import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row, Card, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { useContextHook } from 'use-context-hook';
import { MdRemoveRedEye, MdOutlineModeEdit } from 'react-icons/md';
import { format } from 'date-fns';

import brandsThunk from '@/slices/brands/thunk';
import { manageBrandsColumns } from '@/common/columns';
import { UtilsContext } from '@/contexts/utilsContext';
import { handleApiCall, convertToFormData } from '@/helpers/common';
import BreadCrumb from '@/components/Common/BreadCrumb';
import TableContainer from '@/components/Common/TableContainer';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import BrandModal from '@/components/Organisms/BrandModal';
import Anchor from '@/components/Molecules/Anchor';
import Button from '@/components/Atoms/Button';
import withAuthProtection from '@/components/Common/withAuthProtection';

const ManageBrands = () => {
  const dispatch = useDispatch();
  const [currentLogo, setCurrentLogo] = useState({});
  const [brandModal, setBrandModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { brands } = useSelector(state => state?.Brand) || {};
  const { tableLoading } = useSelector(state => state?.Brand) || false;
  const { refetch, setRefetch } = useContextHook(UtilsContext, ['refetch', 'setRefetch']);

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

  const handleBrand = async payload => {
    try {
      const { name, logo } = payload;

      setIsLoading(true);

      let success;
      if (Object?.keys(currentLogo)?.length > 0) {
        success = await handleApiCall(dispatch, brandsThunk.updateBrand, {
          id: currentLogo?.id,
          payload: convertToFormData({
            name,
            ...(logo instanceof File && { logo }),
          }),
        });
      } else {
        success = await handleApiCall(dispatch, brandsThunk.createBrand, {
          payload: convertToFormData({
            name,
            logo,
          }),
        });
      }

      if (success) {
        setBrandModal(false);
        setRefetch(prev => !prev);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const actionBtns = _ => (
    <div className="d-flex gap-3">
      <div className="viewLogo">
        <Anchor href={_?.logo} target="_blank">
          <MdRemoveRedEye
            style={{ cursor: 'pointer' }}
            onClick={() => setCurrentLogo(_)}
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
            setCurrentLogo({ id: _?.id, name: _?.name, logo: _?.logo });
            setBrandModal(true);
          }}
          color="green"
          size={19}
          id="edit"
        />
        <UncontrolledTooltip placement="top" target="edit">
          Edit
        </UncontrolledTooltip>
      </div>
    </div>
  );

  const { brands_rows, totalCount } = useMemo(
    () => ({
      brands_rows: brands?.items?.map(_ => [
        format(new Date(_?.created_at), 'MMMM dd, yyyy') || '------------',
        _?.name || '------------',
        actionBtns(_),
      ]),
      totalCount: brands?.totalItems,
    }),
    [brands],
  );

  useEffect(() => {
    dispatch(brandsThunk.getAllBrands(filters));
  }, [filters, refetch]);

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
                    <div className="col-sm-auto">
                      <div>
                        <Button
                          onClick={() => {
                            setCurrentLogo({});
                            setBrandModal(true);
                          }}
                          type="button"
                          className="btn btn-dark add-btn"
                          id="create-btn">
                          <i className="ri-add-line align-bottom me-1" /> Create Brand
                        </Button>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                      columns={manageBrandsColumns}
                      data={brands_rows || []}
                      isLoading={tableLoading}
                      isGeneralGlobalFilter
                      currentPage={+filters?.page}
                      totalCount={+totalCount}
                      itemsPerPage={+filters?.itemsPerPage}
                      setFilters={setSearchQueryCallback}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Logo Modal */}
      <ModalWrapper
        isOpen={brandModal}
        toggle={() => setBrandModal(false)}
        title={Object.keys(currentLogo)?.length > 0 ? `Update ${currentLogo?.name}` : 'Create Brand'}
        size="md"
        backdrop="static"
        isContentCentered={false}>
        <BrandModal currentLogo={currentLogo} isLoading={isLoading} handleClick={handleBrand} />
      </ModalWrapper>
    </>
  );
};

export default withAuthProtection(ManageBrands);
