import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row, Card, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { useContextHook } from 'use-context-hook';
import { VscGitPullRequestCreate } from 'react-icons/vsc';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';
import { RiShapesFill } from 'react-icons/ri';
import { PiImages } from 'react-icons/pi';
import { format } from 'date-fns';

import productsThunk from '@/slices/products/thunk';
import { manageProductsColumns } from '@/common/columns';
import { UtilsContext } from '@/contexts/utilsContext';
import { handleApiCall } from '@/helpers/common';
import BreadCrumb from '@/components/Common/BreadCrumb';
import TableContainer from '@/components/Common/TableContainer';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import Button from '@/components/Atoms/Button';
import withAuthProtection from '@/components/Common/withAuthProtection';
import AdvancedProductFilter from '@/components/Organisms/AdvancedProductFiltersModal';
import ProductVariants from '@/components/Organisms/ViewProductVariantsModal';
import ProductImages from '@/components/Organisms/ProductImagesModal';
import ProductVariantModal from '@/components/Organisms/ProductVariantModal';
import CreateProductModal from '@/components/Organisms/ProductModal';
import ConfirmationModal from '@/components/Molecules/ConfirmationModal';

const ManageProducts = () => {
  const dispatch = useDispatch();
  const [currentProduct, setCurrentProduct] = useState({});
  const [advancedFilterModal, setAdvancedFilterModal] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [productVariantsModal, setProductVariantsModal] = useState(false);
  const [productImagesModal, setProductImagesModal] = useState(false);
  const [createVariantModal, setCreateVariantModal] = useState(false);
  const [deleteProductModal, setDeleteProductModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { products } = useSelector(state => state?.Product) || {};
  const { hasPermission } = useSelector(state => state?.Auth) || [];
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

  const handleDeleteProduct = async () => {
    try {
      setIsLoading(true);
      const success = await handleApiCall(dispatch, productsThunk.deleteProduct, { id: currentProduct?.id });

      if (success) {
        setDeleteProductModal(false);
        setCurrentProduct({});
        setRefetch(prev => !prev);
      }
    } catch ({ message }) {
      console.error('Error deleting product: ', message);
    } finally {
      setIsLoading(false);
    }
  };

  const actionBtns = _ => (
    <div className="d-flex gap-3">
      {hasPermission.includes('manage-products.view-product-images') && (
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
      )}

      {hasPermission.includes('manage-products.create-product-variant') && (
        <div className="createVariant">
          <VscGitPullRequestCreate
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setCurrentProduct({ id: _?.id });
              setCreateVariantModal(true);
            }}
            color="#007BFF"
            size={19}
            id="createVariant"
          />
          <UncontrolledTooltip placement="top" target="createVariant">
            Create Variant
          </UncontrolledTooltip>
        </div>
      )}

      {hasPermission.includes('manage-products.view-product-variants') && (
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
      )}

      {hasPermission.includes('manage-products.update-product') && (
        <div className="edit">
          <MdOutlineModeEdit
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setCurrentProduct(_);
              setProductModal(true);
            }}
            color="green"
            size={19}
            id="edit"
          />
          <UncontrolledTooltip placement="top" target="edit">
            Update Product
          </UncontrolledTooltip>
        </div>
      )}

      {hasPermission.includes('manage-products.delete-product') && (
        <div className="deleteProduct">
          <MdDeleteOutline
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setCurrentProduct({ id: _?.id });
              setDeleteProductModal(true);
            }}
            color="red"
            size={19}
            id="deleteProduct"
          />
          <UncontrolledTooltip placement="top" target="deleteProduct">
            Delete Product
          </UncontrolledTooltip>
        </div>
      )}
    </div>
  );

  const { brands_rows, totalCount } = useMemo(
    () => ({
      brands_rows: products?.items?.map(_ => [
        format(new Date(_?.created_at), 'MMMM dd, yyyy') || '------------',
        _?.model || '------------',
        _?.brandName || '------------',
        _?.screenSize || '------------',
        _?.description || '------------',
        _?.totalQuantity ? parseInt(_?.totalQuantity, 10) : 0,
        _?.noOfVariants ? parseInt(_?.noOfVariants, 10) : 0,
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
                    {hasPermission.includes('manage-products.apply-advanced-product') && (
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
                    )}
                    {hasPermission.includes('manage-products.create-product') && (
                      <div className="col-sm-auto">
                        <div>
                          <Button
                            onClick={() => {
                              setCurrentProduct({});
                              setProductModal(true);
                            }}
                            type="button"
                            className="btn btn-dark add-btn"
                            id="create-btn">
                            <i className="ri-add-line align-bottom me-1" /> Create Product
                          </Button>
                        </div>
                      </div>
                    )}
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

      {/* Advance Filter Modal */}
      <ModalWrapper
        isOpen={advancedFilterModal}
        toggle={() => setAdvancedFilterModal(false)}
        title="Advanced Filter"
        size="xl"
        backdrop="static"
        isContentCentered={false}>
        <AdvancedProductFilter />
      </ModalWrapper>

      {/* Product Modal */}
      <ModalWrapper
        isOpen={productModal}
        toggle={() => setProductModal(false)}
        title={Object.keys(currentProduct)?.length > 0 ? `Update ${currentProduct?.name}` : 'Create Product'}
        size="lg"
        backdrop="static"
        isContentCentered={false}>
        <CreateProductModal
          product={currentProduct}
          closeMe={() => {
            setProductModal(false);
            setRefetch(prev => !prev);
          }}
        />
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
        <ProductVariants
          closeMe={() => {
            setProductVariantsModal(false);
            setRefetch(prev => !prev);
          }}
          id={currentProduct?.id}
        />
      </ModalWrapper>

      {/* Update Product Variant Modal */}
      <ModalWrapper
        isOpen={createVariantModal}
        toggle={() => setCreateVariantModal(false)}
        title="Create Variant"
        backdrop="static"
        isContentCentered={false}>
        <ProductVariantModal
          closeMeAndMyParent={() => {
            setCreateVariantModal(false);
            setRefetch(prev => !prev);
          }}
          productId={currentProduct?.id}
        />
      </ModalWrapper>

      {/* Delete Product Confirmation Modal */}
      <ModalWrapper
        isOpen={deleteProductModal}
        toggle={() => setDeleteProductModal(false)}
        title="Delete Brand"
        backdrop="static"
        isContentCentered={false}>
        <ConfirmationModal
          type="delete"
          message="Are you sure you want to delete this product?"
          isLoading={isLoading}
          handleClick={handleDeleteProduct}
        />
      </ModalWrapper>
    </>
  );
};

export default withAuthProtection(ManageProducts);
