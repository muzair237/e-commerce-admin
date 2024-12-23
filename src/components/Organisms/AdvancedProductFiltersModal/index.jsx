import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useContextHook } from 'use-context-hook';
import { Row, Col, UncontrolledTooltip } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { PiImages } from 'react-icons/pi';
import { RiShapesFill } from 'react-icons/ri';
import { MdOutlineModeEdit } from 'react-icons/md';
import { VscGitPullRequestCreate } from 'react-icons/vsc';

import productsThunk from '@/slices/products/thunk';
import { isObjectEmptyOrFieldsNull, prepareProductFiltersData, traverseAndModifyObject } from '@/helpers/common';
import { manageProductsColumns } from '@/common/columns';
import { clearAdvancedSearchProducts } from '@/slices/products/reducer';
import { UtilsContext } from '@/contexts/utilsContext';
import { amountRegex } from '@/helpers/regexes';
import Field from '@/components/Atoms/Field';
import Button from '@/components/Atoms/Button';
import TableContainer from '@/components/Common/TableContainer';
import { Toast } from '@/components/Molecules/Toast';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import Form, { useForm } from '../Form';
import ProductVariantModal from '../ProductVariantModal';
import ProductVariants from '../ViewProductVariantsModal';
import ProductImages from '../ProductImagesModal';
import CreateProductModal from '../ProductModal';

const AdvancedProductFilter = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const { refetch, setRefetch } = useContextHook(UtilsContext, ['refetch', 'setRefetch']);
  const [currentProduct, setCurrentProduct] = useState({});
  const [paginationFilters, setPaginationFilters] = useState({
    page: 1,
    itemsPerPage: 3,
    getAll: false,
  });
  const [isInteracted, setIsInteracted] = useState({});
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [allFilters, setAllFilters] = useState({});
  const [productModal, setProductModal] = useState(false);
  const [productVariantsModal, setProductVariantsModal] = useState(false);
  const [productImagesModal, setProductImagesModal] = useState(false);
  const [createVariantModal, setCreateVariantModal] = useState(false);

  const { productFilterOptions } = useSelector(state => state?.Product) || {};
  const { advancedSearchProducts } = useSelector(state => state?.Product) || {};

  const sortOptions = [
    { label: 'A - Z', value: 'asc' },
    { label: 'Z - A', value: 'desc' },
    { label: 'Latest', value: 'latest' },
    { label: 'Earliest', value: 'earliest' },
  ];

  const {
    brandOptions,
    ramOptions,
    storageTypeOptions,
    storageSizeOptions,
    processorNameOptions,
    processorGenOptions,
    graphicsCardTypeOptions,
    graphicsCardMemorySizes,
  } = prepareProductFiltersData(productFilterOptions);

  const onSubmit = async values => {
    try {
      setIsLoading(true);
      const payload = {
        ...traverseAndModifyObject(values),
        ...(values?.minPrice && { minPrice: parseInt(values.minPrice, 10) }),
        ...(values?.maxPrice && { maxPrice: parseInt(values.maxPrice, 10) }),
        ...(values?.brand?.value && { brand: values.brand.value }),
        ...(values?.sort?.value && { sort: values.sort.value }),
        ...paginationFilters,
      };

      setAllFilters(payload);
      await dispatch(productsThunk.advancedProductSearch({ payload }));
      setShowTable(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error in performing advanced product search: ', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(productsThunk.getProductFilterOptions());
  }, []);

  const setSearchQueryCallback = useCallback(newSearchQuery => {
    setPaginationFilters(newSearchQuery);
  }, []);

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
            setCurrentProduct(_);
            setProductModal(true);
          }}
          color="green"
          size={19}
          id="edit"
        />
        <UncontrolledTooltip placement="top" target="edit">
          Edit Product
        </UncontrolledTooltip>
      </div>
    </div>
  );

  const { product_rows, totalCount } = useMemo(
    () => ({
      product_rows: advancedSearchProducts?.items?.map(_ => [
        format(new Date(_?.created_at), 'MMMM dd, yyyy') || '------------',
        _?.model || '------------',
        _?.brand?.name || '------------',
        _?.screenSize || '------------',
        _?.description || '------------',
        _?.noOfVariants || '------------',
        actionBtns(_),
      ]),
      totalCount: advancedSearchProducts?.totalItems,
    }),
    [advancedSearchProducts],
  );

  const clearAllFilters = () => {
    setShowTable(false);
    setIsInteracted({});
    setIsFirstRender(true);
    dispatch(clearAdvancedSearchProducts());
    setPaginationFilters({
      page: 1,
      itemsPerPage: 3,
      getAll: false,
    });
    form.resetForm();

    Toast({
      type: 'success',
      message: 'Filters cleared successfully!',
    });
  };

  useEffect(() => {
    if (isFirstRender) {
      dispatch(clearAdvancedSearchProducts());
      setIsFirstRender(false);

      return;
    }
    onSubmit(allFilters);
  }, [paginationFilters, refetch]);

  return (
    <>
      <Row>
        <Col lg={12}>
          <Form
            form={form}
            onSubmit={values => {
              setPaginationFilters({
                page: 1,
                itemsPerPage: 3,
                getAll: false,
              });
              onSubmit(values);
            }}
            onTouched={_ => setIsInteracted(__ => ({ ...__, ..._ }))}>
            <Row className="mb-3">
              <Col>
                <Form.Item
                  label="Search Text"
                  type="text"
                  name="searchText"
                  placeholder="Search for laptops..."
                  options={brandOptions}>
                  <Field />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Brand" type="select" name="brand" placeholder="Select" options={brandOptions}>
                  <Field />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="RAM Size" name="ram" placeholder="Select RAM Size" type="select" options={ramOptions}>
                  <Field />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="Storage Type"
                  name="storageType"
                  placeholder="Select Storage Type"
                  type="select"
                  options={storageTypeOptions}>
                  <Field />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="Storage Size"
                  name="storageSize"
                  type="select"
                  placeholder="Select Storage Size"
                  options={storageSizeOptions}>
                  <Field />
                </Form.Item>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Item
                  label="Processor Name"
                  name="processorName"
                  type="select"
                  placeholder="Select Processor Name"
                  options={processorNameOptions}>
                  <Field />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="Processor Generation"
                  name="processorGeneration"
                  type="select"
                  placeholder="Select Processor Gen"
                  options={processorGenOptions}>
                  <Field />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="Graphics Card Type"
                  name="graphicsCardType"
                  type="select"
                  placeholder="Select Graphic Card Type"
                  options={graphicsCardTypeOptions}>
                  <Field />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="Graphics Card Memory Size"
                  name="graphicsCardMemorySize"
                  type="select"
                  placeholder="Select Graphic Card Memory Size"
                  options={graphicsCardMemorySizes}>
                  <Field />
                </Form.Item>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Item
                  label="Min Price"
                  type="number"
                  name="minPrice"
                  placeholder="600"
                  rules={[
                    {
                      pattern: amountRegex,
                      message: 'Enter a positive number greater than 0 with up to 2 decimal places.',
                    },
                  ]}>
                  <Field />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="Max Price"
                  type="number"
                  name="maxPrice"
                  placeholder="1800"
                  rules={[
                    {
                      pattern: amountRegex,
                      message: 'Enter a positive number greater than 0 with up to 2 decimal places.',
                    },
                  ]}>
                  <Field />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Sort By" type="select" name="sort" placeholder="Select" options={sortOptions}>
                  <Field />
                </Form.Item>
              </Col>
            </Row>
            <Row className="mb-3 justify-content-end">
              {showTable && (
                <Col xs="auto">
                  <Button onClick={clearAllFilters} color="danger" type="button">
                    Clear All Filters
                  </Button>
                </Col>
              )}
              <Col xs="auto">
                <Button
                  loading={isLoading}
                  disabled={isObjectEmptyOrFieldsNull(isInteracted)}
                  color="primary"
                  type="submit">
                  Search Products
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      {(isLoading || advancedSearchProducts?.items?.length > 0 || showTable) && (
        <div className="card-body px-3">
          <div>
            <TableContainer
              columns={manageProductsColumns}
              data={product_rows || []}
              isLoading={isLoading}
              currentPage={paginationFilters?.page}
              totalCount={+totalCount}
              itemsPerPage={paginationFilters?.itemsPerPage}
              setFilters={setSearchQueryCallback}
            />
          </div>
        </div>
      )}

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
    </>
  );
};

export default AdvancedProductFilter;
