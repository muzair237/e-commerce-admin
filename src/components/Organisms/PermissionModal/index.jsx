import React, { useEffect, useMemo } from 'react';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useContextHook } from 'use-context-hook';
import { RefetchContext } from '../../../contexts/refetchContext';
import Label from '../../Atoms/Label';
import Input from '../../Atoms/Input';
import permissionThunk from '../../../slices/permissions/thunk';
import Button from '../../Atoms/Button';

export default function PermissionModal({ permission, isOpen, setIsOpen }) {
  const dispatch = useDispatch();

  const { refetch } = useContextHook(RefetchContext, v => ({
    refetch: v.refetch,
  }));

  const isLoading = useSelector(state => state.Permission.isLoading || false);
  const parents = useSelector(state => state.Permission.parents || []);

  const initialValues = { route: '', can: '', description: '', parent: [], group: null };

  const validationSchema = Yup.object().shape({
    route: Yup.string()
      .required('Please Enter Route!')
      .matches(/^\/[a-zA-Z/_.-]+$/, 'Route can only contain letters, underscores, dots, and must start with a slash.')
      .max(40, "Route's Maximum Character Length Is 40."),
    can: Yup.string()
      .required('Please Enter Can!')
      .matches(/^[a-zA-Z._-]+$/, 'Can can only contain letters, underscores, and dashes.')
      .max(40, "Can's Maximum Character Length Is 40."),
    description: Yup.string()
      .required('Please Enter Description')
      .max(40, "Description's Maximum Character Length Is 40."),
    parent: Yup.array().min(1, 'Please select at least One Parent'),
    group: Yup.object().required('Please Select Group.'),
  });

  const permissionOptions = useMemo(
    () => [
      {
        label: 'No-Parent',
        value: '$',
      },
      ...parents.map(({ can }) => ({
        label: can.split('.nav')[0].charAt(0).toUpperCase() + can.split('.nav')[0].slice(1),
        value: can.split('.nav')[0],
      })),
    ],
    [parents],
  );

  const groupOptions = [
    {
      label: 'ADMIN',
      value: 'ADMIN',
    },
    {
      label: 'USER',
      value: 'USER',
    },
  ];

  const onSubmit = data => {
    const payload = {
      ...data,
      parent: data.parent.map(ele => ele.value),
      group: data.group.label,
    };
    if (!permission) {
      dispatch(permissionThunk.createPermission({ payload, setIsOpen, refetch }));
    } else {
      dispatch(permissionThunk.editPermission({ id: permission?._id, payload, setIsOpen, refetch }));
    }
  };

  useEffect(() => {
    dispatch(permissionThunk.getUniqueParents());
  }, []);
  return (
    <Modal id="showModal" backdrop="static" isOpen={isOpen} centered>
      <ModalHeader className="bg-light p-3" toggle={() => setIsOpen(false)}>
        {permission ? 'Edit Permission' : 'Add Permission'}
      </ModalHeader>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form>
          <ModalBody>
            <div className="mb-1">
              <Label className="form-label">Route *</Label>
              <Input name="route" value={permission && permission?.route} type="text" placeholder="/route" />
            </div>

            <div className="mb-1">
              <Label className="form-label">Can *</Label>
              <Input name="can" value={permission && permission?.can} placeholder="route.nav" type="text" />
            </div>

            <div className="mb-1">
              <Label className="form-label">Description *</Label>
              <Input
                name="description"
                value={permission && permission?.description}
                type="text"
                placeholder="Can view the route page"
              />
            </div>

            <div className="mb-1">
              <Row>
                <Col>
                  <Label className="form-label">Parent *</Label>
                  <Input
                    name="parent"
                    type="select"
                    defaultValue={
                      permission && permissionOptions?.filter(({ value }) => permission?.parent?.includes(value))
                    }
                    options={permissionOptions}
                    isMulti
                    isSearchable
                    hideSelectedOptions={false}
                    closeMenuOnSelect={false}
                  />
                </Col>
                <Col>
                  <Label className="form-label">Group *</Label>
                  <Input
                    name="group"
                    type="select"
                    value={permission && groupOptions?.find(option => option?.value === permission?.group)}
                    options={groupOptions}
                    hideSelectedOptions={false}
                  />
                </Col>
              </Row>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <Button type="submit" loading={isLoading} className="btn btn-success">
                {permission ? 'Edit Permission' : 'Create Permission'}
              </Button>
            </div>
          </ModalFooter>
        </Form>
      </Formik>
    </Modal>
  );
}
