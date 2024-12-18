import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { Col, Container, Row, Card, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { MdRemoveRedEye, MdOutlineModeEdit, MdDeleteOutline } from 'react-icons/md';
import brandsThunk from '@/slices/brands/thunk';
import { manageBrandsColumns } from '@/common/columns';
import { format } from 'date-fns';
import { useContextHook } from 'use-context-hook';
import { UtilsContext } from '@/contexts/utilsContext';
import { handleApiCall, convertToFormData } from '@/helpers/common';
import BreadCrumb from '@/components/Common/BreadCrumb';
import TableContainer from '@/components/Common/TableContainer';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import LogoModal from '@/components/Organisms/LogoModal';
import Anchor from '@/components/Molecules/Anchor';
import withAuthProtection from '../components/Common/withAuthProtection';
import Button from '@/components/Atoms/Button';

const ManageBrands = () => {
  const dispatch = useDispatch();
  const [currentLogo, setCurrentLogo] = useState({});
  const [logoModal, setLogoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const brands = useSelector(state => state?.Brand?.brands) || {};
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
      }

      if (success) {
        setLogoModal(false);
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
            setCurrentLogo({ name: _?.name, logo: _?.logo });
            setLogoModal(true);
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
        format(new Date(_?.created_at), 'yyyy-MM-dd') || '------------',
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

      {/* Logo Modal */}
      <ModalWrapper
        isOpen={logoModal}
        toggle={() => setLogoModal(false)}
        title={currentLogo?.name?.toUpperCase() || 'Create Brand'}
        size="md"
        backdrop="static"
        isContentCentered={false}>
        <LogoModal currentLogo isLoading={isLoading} handleClick={handleBrand} />
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
                    <div className="col-sm-auto">
                      <div>
                        <Button
                          onClick={() => {
                            setCurrentLogo({});
                            setLogoModal(true);
                          }}
                          type="button"
                          className="btn btn-success add-btn"
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
                      isGlobalFilter
                      isLoading={tableLoading}
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
