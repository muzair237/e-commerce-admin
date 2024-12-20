import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Table, UncontrolledTooltip } from 'reactstrap';

import productsThunk from '@/slices/products/thunk';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import Skeleton from '@/components/Atoms/Skeleton';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import ProductVariantModal from '../ProductVariantModal';

const ProductVariants = ({ id }) => {
  const dispatch = useDispatch();
  const { productVariants } = useSelector(state => state?.Product) || [];
  const [isLoading, setIsLoading] = useState(false);
  const [updateVariant, setUpdateVariant] = useState(false);

  useEffect(() => {
    const fetchProductVariants = async () => {
      try {
        setIsLoading(true);
        await dispatch(productsThunk.getProductVariants({ id }));
      } catch ({ message }) {
        console.log('Error occurred while fetching product variants: ', message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductVariants();
  }, [dispatch, id]);

  return (
    <>
      <Row className="mx-1">
        <Table className="table table-bordered border-secondary table-wrap rounded">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">RAM</th>
              <th colSpan="2" scope="col">
                Storage
              </th>
              <th colSpan="2" scope="col">
                Processor
              </th>
              <th scope="col">Graphics Card</th>
              <th scope="col">Graphics Card Memory Size</th>
              <th scope="col">Price</th>
              <th scope="col">Actions</th>
            </tr>
            <tr>
              <th scope="col" />
              <th scope="col" />
              <th scope="col">Type</th>
              <th scope="col">Size</th>
              <th scope="col">Name</th>
              <th scope="col">Generation</th>
              <th scope="col" />
              <th scope="col" />
              <th scope="col" />
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <tr key={index}>
                  <th scope="row">
                    <Skeleton height="20px" width="30px" />
                  </th>
                  <td>
                    <Skeleton height="20px" width="100px" />
                  </td>
                  <td>
                    <Skeleton height="20px" width="100px" />
                  </td>
                  <td>
                    <Skeleton height="20px" width="100px" />
                  </td>
                  <td>
                    <Skeleton height="20px" width="100px" />
                  </td>
                  <td>
                    <Skeleton height="20px" width="100px" />
                  </td>
                  <td>
                    <Skeleton height="20px" width="100px" />
                  </td>
                  <td>
                    <Skeleton height="20px" width="100px" />
                  </td>
                  <td>
                    <Skeleton height="20px" width="100px" />
                  </td>
                  <td>
                    <Skeleton height="20px" width="55px" />
                  </td>
                </tr>
              ))
            ) : productVariants.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  <span className="fs-5">No variants found!</span>
                </td>
              </tr>
            ) : (
              productVariants.map((variant, index) => (
                <tr key={variant.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{variant.ram}</td>
                  <td>{variant.storage.type}</td>
                  <td>{variant.storage.size}</td>
                  <td>{variant.processor.name}</td>
                  <td>{variant.processor.generation}</td>
                  <td>{variant.graphicsCard.isGraphicsCard ? `${variant.graphicsCard.type}` : 'No Graphics Card'}</td>
                  <td>{variant.graphicsCard.isGraphicsCard ? variant.graphicsCard.memory : 'N/A'}</td>
                  <td>{parseFloat(variant.price).toFixed(2)} AED</td>
                  <td className="text-center">
                    <MdOutlineModeEditOutline
                      onClick={() => setUpdateVariant(true)}
                      style={{ cursor: 'pointer' }}
                      color="green"
                      size={19}
                      id="editVariant"
                    />
                    <UncontrolledTooltip placement="top" target="editVariant">
                      Edit Variant
                    </UncontrolledTooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Row>

      {/* Advance Filter Modal */}
      <ModalWrapper
        isOpen={updateVariant}
        toggle={() => setUpdateVariant(false)}
        title="Update Variant"
        backdrop="static"
        isContentCentered={false}>
        <ProductVariantModal />
      </ModalWrapper>
    </>
  );
};

ProductVariants.propTypes = {
  id: PropTypes.number.isRequired,
};

export default ProductVariants;
