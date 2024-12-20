import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row, Card, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { useContextHook } from 'use-context-hook';
import { MdOutlineModeEdit } from 'react-icons/md';
import { RiShapesFill } from 'react-icons/ri';
import { PiImages } from 'react-icons/pi';
import { format } from 'date-fns';

import productsThunk from '@/slices/products/thunk';
import { manageProductsColumns } from '@/common/columns';
import { UtilsContext } from '@/contexts/utilsContext';
import { handleApiCall, convertToFormData } from '@/helpers/common';
import BreadCrumb from '@/components/Common/BreadCrumb';
import TableContainer from '@/components/Common/TableContainer';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import Button from '@/components/Atoms/Button';
import withAuthProtection from '@/components/Common/withAuthProtection';
import ProductFilters from '@/components/Organisms/ProductFiltersModal';
import ProductVariants from '@/components/Organisms/ViewProductVariantsModal';
import ProductImages from '@/components/Organisms/ProductImagesModal';

const ManageProducts = () => {
  const dispatch = useDispatch();
  const [currentProduct, setCurrentProduct] = useState({});
  const [logoModal, setLogoModal] = useState(false);
  const [advancedFilterModal, setAdvancedFilterModal] = useState(false);
  const [productVariantsModal, setProductVariantsModal] = useState(false);
  const [productImagesModal, setProductImagesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { products } = useSelector(state => state?.Product) || {};
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

  // const handleProduct = async payload => {
  //   try {
  //     const { name, logo } = payload;

  //     setIsLoading(true);

  //     let success;
  //     if (Object?.keys(currentProduct)?.length > 0) {
  //       success = await handleApiCall(dispatch, productsThunk.updateBrand, {
  //         id: currentProduct?.id,
  //         payload: convertToFormData({
  //           name,
  //           ...(logo instanceof File && { logo }),
  //         }),
  //       });
  //     } else {
  //       success = await handleApiCall(dispatch, productsThunk.createBrand, {
  //         payload: convertToFormData({
  //           name,
  //           logo,
  //         }),
  //       });
  //     }

  //     if (success) {
  //       setLogoModal(false);
  //       setRefetch(prev => !prev);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const actionBtns = _ => (
    <div className="d-flex gap-3">
      <div className="viewImages">
        <PiImages
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentProduct({ model: _?.model, images: _?.images });
            setProductImagesModal(true);
          }}
          color="#007BFF"
          size={19}
          id="viewImages"
        />
        <UncontrolledTooltip placement="top" target="viewImages">
          View Images
        </UncontrolledTooltip>
      </div>
      <div className="viewVariants">
        <RiShapesFill
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentProduct({ id: _?.id, model: _?.model });
            setProductVariantsModal(true);
          }}
          color="#007BFF"
          size={19}
          id="viewVariants"
        />
        <UncontrolledTooltip placement="top" target="viewVariants">
          View Variants
        </UncontrolledTooltip>
      </div>
      <div className="edit">
        <MdOutlineModeEdit
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentProduct({ id: _?.id, name: _?.name, logo: _?.logo });
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
      brands_rows: products?.items?.map(_ => [
        format(new Date(_?.created_at), 'yyyy-MM-dd') || '------------',
        _?.model || '------------',
        _?.brandName || '------------',
        _?.screenSize || '------------',
        _?.description || '------------',
        actionBtns(_),
      ]),
      totalCount: products?.totalItems,
    }),
    [products],
  );

  useEffect(() => {
    dispatch(productsThunk.getAllProducts(filters));
  }, [filters, refetch]);

  return (
    <>
      <Head>
        <title>WebNova | MANAGE PRODUCTS</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {/* Advance Filter Modal */}
      <ModalWrapper
        isOpen={advancedFilterModal}
        toggle={() => setAdvancedFilterModal(false)}
        title="Advanced Filter"
        size="xl"
        backdrop="static"
        isContentCentered={false}>
        <ProductFilters />
      </ModalWrapper>

      {/* Product Images Modal */}
      <ModalWrapper
        isOpen={productImagesModal}
        toggle={() => setProductImagesModal(false)}
        title={`Images of ${currentProduct?.model}`}
        size="md"
        backdrop="static"
        isContentCentered={false}>
        <ProductImages images={currentProduct?.images} />
      </ModalWrapper>

      {/* Product Variants Modal */}
      <ModalWrapper
        isOpen={productVariantsModal}
        toggle={() => setProductVariantsModal(false)}
        title={`Variants of ${currentProduct?.model}`}
        size="xl"
        backdrop="static"
        isContentCentered={false}>
        <ProductVariants id={currentProduct?.id} />
      </ModalWrapper>

      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Manage Products" />
          <Row>
            <Col lg={12}>
              <Card id="permissionList">
                <CardHeader>
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 fw-semibold">Manage Products</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        <Button
                          onClick={() => {
                            setAdvancedFilterModal(true);
                          }}
                          type="button"
                          className="btn btn-secondary add-btn"
                          id="create-btn">
                          <i className="bx bx-search-alt search-icon" /> Advanced Filter
                        </Button>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        <Button
                          onClick={() => {
                            setCurrentProduct({});
                            setLogoModal(true);
                          }}
                          type="button"
                          className="btn btn-dark add-btn"
                          id="create-btn">
                          <i className="ri-add-line align-bottom me-1" /> Create Product
                        </Button>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                      columns={manageProductsColumns}
                      data={brands_rows || []}
                      isLoading={tableLoading}
                      isProductFilter
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
    </>
  );
};

export default withAuthProtection(ManageProducts);