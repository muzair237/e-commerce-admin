import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row, Card, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { useContextHook } from 'use-context-hook';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';
import { GrUpdate } from 'react-icons/gr';
import { format } from 'date-fns';

import { adminColumns } from '@/common/columns';
import { UtilsContext } from '@/contexts/utilsContext';
import { handleApiCall, isObjectEmptyOrFieldsNull } from '@/helpers/common';
import adminsThunk from '@/slices/admins/thunk';
import rolesThunk from '@/slices/roles/thunk';
import BreadCrumb from '@/components/Common/BreadCrumb';
import TableContainer from '@/components/Common/TableContainer';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import Button from '@/components/Atoms/Button';
import withAuthProtection from '@/components/Common/withAuthProtection';
import ConfirmationModal from '@/components/Molecules/ConfirmationModal';
import UpdatePasswordModal from '@/components/Organisms/UpdatePassword';
import AdminModal from '@/components/Organisms/AdminModal';

const Admins = () => {
  const dispatch = useDispatch();
  const [currentAdmin, setCurrentAdmin] = useState({});
  const [adminModal, setAdminModal] = useState(false);
  const [updatePasswordModal, setUpdatePasswordModal] = useState(false);
  const [deleteAdminModal, setDeleteAdminModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { admins } = useSelector(state => state?.Admin) || {};
  const { uniqueRoles } = useSelector(state => state?.Role) || [];
  const { tableLoading } = useSelector(state => state?.Admin) || false;
  const { refetch, setRefetch } = useContextHook(UtilsContext, ['refetch', 'setRefetch']);

  const [filters, setFilters] = useState({
    page: 1,
    itemsPerPage: 10,
    getAll: false,
    startDate: '',
    endDate: '',
    searchText: '',
    sort: 'latest',
    roleType: 'all',
  });

  const setSearchQueryCallback = useCallback(newSearchQuery => {
    setFilters(newSearchQuery);
  }, []);

  const handleDeleteAdmin = async () => {
    try {
      setIsLoading(true);
      const success = await handleApiCall(dispatch, adminsThunk.deleteAdmin, { id: currentAdmin?.id });

      if (success) {
        setDeleteAdminModal(false);
        setCurrentAdmin({});
        setRefetch(prev => !prev);
      }
    } catch ({ message }) {
      console.error('Error deleting admin: ', message);
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
            setCurrentAdmin(_);
            setAdminModal(true);
          }}
          color="green"
          size={19}
          id="edit"
        />
        <UncontrolledTooltip placement="top" target="edit">
          Edit Admin
        </UncontrolledTooltip>
      </div>
      <div className="update-password">
        <GrUpdate
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentAdmin({ id: _?.id });
            setUpdatePasswordModal(true);
          }}
          color="blue"
          size={15}
          id="update-password"
        />
        <UncontrolledTooltip placement="top" target="update-password">
          Update Password
        </UncontrolledTooltip>
      </div>
      <div className="deleteAdmin">
        <MdDeleteOutline
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentAdmin({ id: _?.id });
            setDeleteAdminModal(true);
          }}
          color="red"
          size={19}
          id="deleteAdmin"
        />
        <UncontrolledTooltip placement="top" target="deleteAdmin">
          Delete Admin
        </UncontrolledTooltip>
      </div>
    </div>
  );

  const { admin_rows, totalCount } = useMemo(
    () => ({
      admin_rows: admins?.items?.map(_ => [
        format(new Date(_?.created_at), 'yyyy-MM-dd') || '------------',
        _?.name || '------------',
        _?.email || '------------',
        _?.roles?.length > 0 ? _.roles.map(role => role).join(', ') : '------------',
        actionBtns(_),
      ]),
      totalCount: admins?.totalItems,
    }),
    [admins],
  );

  useEffect(() => {
    dispatch(adminsThunk.getAllAdmins(filters));
    dispatch(rolesThunk.getUniqueRoles());
  }, [filters, refetch]);

  return (
    <>
      <Head>
        <title>WebNova | ADMINS</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Admins" />
          <Row>
            <Col lg={12}>
              <Card id="adminList">
                <CardHeader>
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 fw-semibold">Admins</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        <Button
                          onClick={() => {
                            setCurrentAdmin({});
                            setAdminModal(true);
                          }}
                          type="button"
                          className="btn btn-dark add-btn"
                          id="create-btn">
                          <i className="ri-add-line align-bottom me-1" /> Create Admin
                        </Button>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                      columns={adminColumns}
                      data={admin_rows || []}
                      isLoading={tableLoading}
                      isAdminFilter
                      currentPage={+filters?.page}
                      totalCount={+totalCount}
                      itemsPerPage={+filters?.itemsPerPage}
                      uniqueRoles={uniqueRoles}
                      setFilters={setSearchQueryCallback}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Admin Modal */}
      <ModalWrapper
        isOpen={adminModal}
        toggle={() => setAdminModal(false)}
        title={!isObjectEmptyOrFieldsNull(currentAdmin) ? 'Update Admin' : 'Create Admin'}
        size="md"
        backdrop="static"
        isContentCentered={false}>
        <AdminModal
          admin={currentAdmin}
          closeMe={() => {
            setAdminModal(false);
            setRefetch(prev => !prev);
          }}
        />
      </ModalWrapper>

      {/* Update Password Modal */}
      <ModalWrapper
        isOpen={updatePasswordModal}
        toggle={() => setUpdatePasswordModal(false)}
        title="Update Password"
        size="md"
        backdrop="static"
        isContentCentered={false}>
        <UpdatePasswordModal
          adminId={currentAdmin?.id}
          closeMe={() => {
            setUpdatePasswordModal(false);
          }}
        />
      </ModalWrapper>

      {/* Delete Admin  Modal */}
      <ModalWrapper
        isOpen={deleteAdminModal}
        toggle={() => setDeleteAdminModal(false)}
        title="Delete Admin"
        backdrop="static"
        isContentCentered={false}>
        <ConfirmationModal
          type="delete"
          message="Are you sure you want to delete this admin?"
          isLoading={isLoading}
          handleClick={handleDeleteAdmin}
        />
      </ModalWrapper>
    </>
  );
};

export default withAuthProtection(Admins);
