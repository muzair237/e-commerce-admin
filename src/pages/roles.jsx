import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row, Card, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { useContextHook } from 'use-context-hook';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';
import { format } from 'date-fns';

import rolesThunk from '@/slices/roles/thunk';
import { roleColumns } from '@/common/columns';
import { UtilsContext } from '@/contexts/utilsContext';
import { handleApiCall, isObjectEmptyOrFieldsNull } from '@/helpers/common';
import BreadCrumb from '@/components/Common/BreadCrumb';
import TableContainer from '@/components/Common/TableContainer';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import Button from '@/components/Atoms/Button';
import withAuthProtection from '@/components/Common/withAuthProtection';
import ConfirmationModal from '@/components/Molecules/ConfirmationModal';
import RoleModal from '@/components/Organisms/RoleModal';

const Roles = () => {
  const dispatch = useDispatch();
  const [currentRole, setCurrentRole] = useState({});
  const [roleModal, setRoleModal] = useState(false);
  const [deletePermissionModal, setDeletePermissionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { roles } = useSelector(state => state?.Role) || {};
  const { tableLoading } = useSelector(state => state?.Role) || false;
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

  const handleDeletePermission = async () => {
    try {
      setIsLoading(true);
      const success = await handleApiCall(dispatch, rolesThunk.deletePermission, { id: currentRole?.id });

      if (success) {
        setDeletePermissionModal(false);
        setCurrentRole({});
        setRefetch(prev => !prev);
      }
    } catch ({ message }) {
      console.error('Error deleting permission: ', message);
    } finally {
      setIsLoading(false);
    }
  };

  const actionBtns = _ => (
    <div className="d-flex gap-3">
      <div className="edit">
        <MdOutlineModeEdit
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentRole(_);
            setRoleModal(true);
          }}
          color="green"
          size={19}
          id="edit"
        />
        <UncontrolledTooltip placement="top" target="edit">
          Edit Role
        </UncontrolledTooltip>
      </div>
      <div className="deletePermission">
        <MdDeleteOutline
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentRole(_);
            setDeletePermissionModal(true);
          }}
          color="red"
          size={19}
          id="deletePermission"
        />
        <UncontrolledTooltip placement="top" target="deletePermission">
          Delete Role
        </UncontrolledTooltip>
      </div>
    </div>
  );

  const { roles_rows, totalCount } = useMemo(
    () => ({
      roles_rows: roles?.items?.map(_ => [
        format(new Date(_?.created_at), 'MMMM dd, yyyy') || '------------',
        _?.type || '------------',
        _?.description || '------------',
        actionBtns(_),
      ]),
      totalCount: roles?.totalItems,
    }),
    [roles],
  );

  useEffect(() => {
    dispatch(rolesThunk.getAllRoles(filters));
  }, [filters, refetch]);

  return (
    <>
      <Head>
        <title>WebNova | ROLES</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Roles" />
          <Row>
            <Col lg={12}>
              <Card id="roleList">
                <CardHeader>
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 fw-semibold">Roles</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        <Button
                          onClick={() => {
                            setCurrentRole({});
                            setRoleModal(true);
                          }}
                          type="button"
                          className="btn btn-dark add-btn"
                          id="create-btn">
                          <i className="ri-add-line align-bottom me-1" /> Create Role
                        </Button>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                      columns={roleColumns}
                      data={roles_rows || []}
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

      {/* Role Modal */}
      <ModalWrapper
        isOpen={roleModal}
        toggle={() => setRoleModal(false)}
        title={!isObjectEmptyOrFieldsNull(currentRole) ? 'Update Role' : 'Create Role'}
        size="md"
        backdrop="static"
        isContentCentered={false}>
        <RoleModal
          role={currentRole}
          closeMe={() => {
            setRoleModal(false);
            setRefetch(prev => !prev);
          }}
        />
      </ModalWrapper>

      {/* Delete Permission Confirmation Modal */}
      <ModalWrapper
        isOpen={deletePermissionModal}
        toggle={() => setDeletePermissionModal(false)}
        title="Delete Permission"
        backdrop="static"
        isContentCentered={false}>
        <ConfirmationModal
          type="delete"
          message="Are you sure you want to delete this permission?"
          isLoading={isLoading}
          handleClick={handleDeletePermission}
        />
      </ModalWrapper>
    </>
  );
};

export default withAuthProtection(Roles);
