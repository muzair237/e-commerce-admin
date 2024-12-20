import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import productsThunk from '@/slices/products/thunk';
import { prepareProductFiltersData } from '@/helpers/common';
import Field from '@/components/Atoms/Field';
import Button from '@/components/Atoms/Button';
import Form, { useForm } from '../Form';
import TableContainer from '@/components/Common/TableContainer';
import { manageProductsColumns } from '@/common/columns';

const ProductFilters = () => {
  const dispatch = useDispatch();
  const [form] = useForm();

  const { productFilterOptions } = useSelector(state => state?.Product) || {};

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

  const onSubmit = payload => {
    console.log('payload: ', payload);
  };

  useEffect(() => {
    dispatch(productsThunk.getProductFilterOptions());
  }, []);

  return (
    <>
      <Row>
        <Col lg={12}>
          <Form form={form} onSubmit={onSubmit}>
            <Row className="mb-4">
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
            <Row className="mb-4">
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
                  name="processorGen"
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
                <Form.Item label="Min Price" name="minPrice" placeholder="Min Price">
                  <Field type="number" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Max Price" name="maxPrice" placeholder="Max Price">
                  <Field type="number" />
                </Form.Item>
              </Col>
            </Row>
            <Row className="mb-4 justify-content-end">
              {/* Show below button only when filters are applied */}
              <Col xs="auto">
                <Button color="danger" type="button">
                  Clear All Filters
                </Button>
              </Col>
              <Col xs="auto">
                <Button color="primary" type="submit">
                  Search Products
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <div className="card-body px-3">
        <div>
          <TableContainer
            columns={manageProductsColumns}
            data={[]}
            isLoading={true}
            // currentPage={+filters?.page}
            // totalCount={+totalCount}
            // itemsPerPage={+filters?.itemsPerPage}
            // setFilters={setSearchQueryCallback}
          />
        </div>
      </div>
    </>
  );
};

export default ProductFilters;
