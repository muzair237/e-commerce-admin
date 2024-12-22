import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col, UncontrolledTooltip } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { PiImages } from 'react-icons/pi';
import { RiShapesFill } from 'react-icons/ri';
import { MdOutlineModeEdit } from 'react-icons/md';
import { VscGitPullRequestCreate } from 'react-icons/vsc';

import productsThunk from '@/slices/products/thunk';
import { prepareProductFiltersData, traverseAndModifyObject } from '@/helpers/common';
import { manageProductsColumns } from '@/common/columns';
import { clearAdvancedSearchProducts } from '@/slices/products/reducer';
import Field from '@/components/Atoms/Field';
import Button from '@/components/Atoms/Button';
import TableContainer from '@/components/Common/TableContainer';
import Form, { useForm } from '../Form';

const AdvancedProductFilter = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const [paginationFilters, setPaginationFilters] = useState({
    page: 1,
    itemsPerPage: 2,
    getAll: false,
  });
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [allFilters, setAllFilters] = useState({});

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
          // onClick={() => {
          //   setCurrentProduct({ model: _?.model, images: _?.images });
          //   setProductImagesModal(true);
          // }}
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
            // setCurrentProduct({ id: _?.id });
            // setCreateVariantModal(true);
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
            // setCurrentProduct({ id: _?.id, model: _?.model });
            // setProductVariantsModal(true);
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
            // setCurrentProduct({ id: _?.id, name: _?.name, logo: _?.logo });
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
    setPaginationFilters({
      page: 1,
      itemsPerPage: 2,
      getAll: false,
    });
  };

  useEffect(() => {
    if (isFirstRender) {
      dispatch(clearAdvancedSearchProducts());
      setIsFirstRender(false);

      return;
    }
    onSubmit(allFilters);
  }, [paginationFilters]);

  return (
    <>
      <Row>
        <Col lg={12}>
          <Form
            form={form}
            onSubmit={values => {
              setPaginationFilters({
                page: 1,
                itemsPerPage: 2,
                getAll: false,
              });
              onSubmit(values);
            }}>
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
                <Form.Item label="Min Price" type="number" name="minPrice" placeholder="Min Price">
                  <Field />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Max Price" type="number" name="maxPrice" placeholder="Max Price">
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
              {/* Show below button only when filters are applied */}
              <Col xs="auto">
                <Button onClick={clearAllFilters} color="danger" type="button">
                  Clear All Filters
                </Button>
              </Col>
              <Col xs="auto">
                <Button loading={isLoading} color="primary" type="submit">
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
    </>
  );
};

export default AdvancedProductFilter;
