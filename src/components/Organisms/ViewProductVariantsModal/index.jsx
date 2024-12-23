import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Table, UncontrolledTooltip } from 'reactstrap';

import productsThunk from '@/slices/products/thunk';
import { MdOutlineModeEditOutline, MdDeleteOutline } from 'react-icons/md';
import { handleApiCall } from '@/helpers/common';
import Skeleton from '@/components/Atoms/Skeleton';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import ConfirmationModal from '@/components/Molecules/ConfirmationModal';
import ProductVariantModal from '../ProductVariantModal';

const ProductVariants = ({ closeMe, id }) => {
  const dispatch = useDispatch();
  const { productVariants } = useSelector(state => state?.Product) || [];
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState();
  const [updateVariantModal, setUpdateVariantModal] = useState(false);
  const [deleteVariantModal, setDeleteVariantModal] = useState(false);

  const handleDeleteVariant = async () => {
    try {
      setIsLoading(true);
      const success = await handleApiCall(dispatch, productsThunk.deleteProductVariant, { id: selectedVariant?.id });

      if (success) {
        setDeleteVariantModal(false);
        setSelectedVariant(null);
        closeMe();
      }
    } catch ({ message }) {
      console.error('Error deleting variant: ', message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductVariants = async () => {
      try {
        setIsLoading(true);
        await dispatch(productsThunk.getProductVariants({ id }));
      } catch ({ message }) {
        // eslint-disable-next-line no-console
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
              <th colSpan="2" scope="col">
                Actions
              </th>
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
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map(_ => (
                <tr key={_}>
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
                      onClick={() => {
                        setSelectedVariant(variant);
                        setUpdateVariantModal(true);
                      }}
                      style={{ cursor: 'pointer' }}
                      color="green"
                      size={19}
                      id="editVariant"
                    />
                    <UncontrolledTooltip placement="top" target="editVariant">
                      Edit Variant
                    </UncontrolledTooltip>
                  </td>
                  <td className="text-center">
                    <MdDeleteOutline
                      onClick={() => {
                        setSelectedVariant(variant);
                        setDeleteVariantModal(true);
                      }}
                      style={{ cursor: 'pointer' }}
                      color="red"
                      size={19}
                      id="deleteVariant"
                    />
                    <UncontrolledTooltip placement="top" target="deleteVariant">
                      Delete Variant
                    </UncontrolledTooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Row>

      {/* Update Product Variant Modal */}
      <ModalWrapper
        isOpen={updateVariantModal}
        toggle={() => setUpdateVariantModal(false)}
        title="Update Variant"
        backdrop="static"
        isContentCentered={false}>
        <ProductVariantModal
          closeMeAndMyParent={() => {
            setUpdateVariantModal(false);
            closeMe();
          }}
          variant={selectedVariant}
        />
      </ModalWrapper>

      {/* Delete Variant Modal */}
      <ModalWrapper
        isOpen={deleteVariantModal}
        toggle={() => setDeleteVariantModal(false)}
        title="Delete Variant"
        backdrop="static"
        isContentCentered={false}>
        <ConfirmationModal
          type="delete"
          message="Are you sure you want to delete this variant?"
          isLoading={isLoading}
          handleClick={handleDeleteVariant}
        />
      </ModalWrapper>
    </>
  );
};

ProductVariants.propTypes = {
  closeMe: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default ProductVariants;
