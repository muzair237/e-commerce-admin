import React, { useState } from 'react';
import classnames from 'classnames';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
  TabContent,
  Button,
  Container,
} from 'reactstrap';

const CustomizePermissionModal = ({ isEdit, tabs, selected, setPermissions, permissions, isOpen, setIsOpen }) => {
  const [rightTabs, setRightTabs] = useState(tabs || []);
  const [searchTabPermission, setSearchTabPermission] = useState();
  const [searchGroupPermission, setSearchGroupPermission] = useState();
  const [verticalTab, setVerticalTab] = useState(rightTabs[0]?.value);
  const [selectedPermissions, setSelectedPermissions] = useState(selected);
  const [filteredPermissions, setfilteredPermissions] = useState(
    permissions.filter(
      permission => permission.parent.includes(verticalTab) || permission.can === `${verticalTab}.nav`,
    ),
  );
  const handlePermissions = () => {
    setPermissions(selectedPermissions);
    setIsOpen(prev => !prev);
  };
  return (
    <Modal
      size="xl"
      id="createPermission"
      isOpen={isOpen}
      toggle={() => setIsOpen(prev => !prev)}
      centered
      backdrop="static"
      tabIndex="-1">
      <ModalHeader toggle={() => setIsOpen(prev => !prev)} className="p-3 bg-soft-success">
        {isEdit ? 'Edit Customize Permissions' : 'Customize Permissions'}
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col>
            <div className="search-box me-2 mb-0 d-inline-block">
              <input
                type="text"
                onChange={e => {
                  const searchValue = e.target.value;
                  setSearchGroupPermission(searchValue);
                  const filteredTabs = tabs?.filter(ele => ele?.value?.includes(searchValue));
                  setRightTabs(filteredTabs);
                  if (filteredTabs.length > 0) {
                    setVerticalTab(() => {
                      const newVerticalTab = filteredTabs[0]?.value;
                      const selectedTabsPermissions = permissions.filter(
                        ele => ele?.parent?.includes(newVerticalTab) || ele?.can === `${newVerticalTab}.nav`,
                      );
                      setfilteredPermissions(selectedTabsPermissions);
                      return newVerticalTab;
                    });
                  } else {
                    setfilteredPermissions([]);
                  }
                }}
                value={searchGroupPermission}
                className="form-control search"
                placeholder="Search Permissions Group"
              />
              <i className="bx bx-search-alt search-icon" />
            </div>
          </Col>
          <Col className="text-end pe-5">
            <div className="form-check form-switch form-check-right">
              <Input
                className="form-check-input"
                checked={
                  permissions.every(permission => selectedPermissions.includes(permission.can)) && rightTabs?.length > 0
                }
                disabled={!rightTabs?.length}
                onChange={({ target: { checked } }) => {
                  const allPermissions = permissions.map(permission => permission.can);
                  setSelectedPermissions(checked ? allPermissions : []);
                }}
                type="checkbox"
              />

              <Label className="form-check-label" for="flexSwitchCheckRightDisabled">
                Select All Groups Permissions
              </Label>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  {/* // Sidebar */}
                  <Col lg={3} style={{ maxHeight: '480px', overflowY: 'auto' }}>
                    <Nav tabs className="flex-column nav nav-tabs nav-tabs-custom nav-primary">
                      {rightTabs && rightTabs?.length > 0 ? (
                        rightTabs.map(item => (
                          <NavItem key={item?.value}>
                            <NavLink
                              style={{ cursor: 'pointer' }}
                              className={classnames({
                                'mb-2': true,
                                active: verticalTab === item.value,
                              })}
                              onClick={() => {
                                setVerticalTab(() => {
                                  const newVerticalTab = item.value;
                                  const selectedTabsPermissions = permissions.filter(
                                    ele =>
                                      ele?.parent?.includes(newVerticalTab) || ele?.can === `${newVerticalTab}.nav`,
                                  );
                                  setfilteredPermissions(selectedTabsPermissions);
                                  return newVerticalTab;
                                });
                              }}
                              id={`v-pills-${item.value}-tab`}>
                              {item.label}
                            </NavLink>
                          </NavItem>
                        ))
                      ) : (
                        <Label>No Permissions Group Found!</Label>
                      )}
                    </Nav>
                  </Col>

                  {/* // content body */}
                  <Col lg={9} style={{ maxHeight: '480px', overflowY: 'auto' }}>
                    <div>
                      {/* // switch search */}
                      <Row style={{ alignItems: 'center' }}>
                        <Col>
                          <Container>
                            <div className="form-check form-switch form-check-right">
                              <Input
                                type="checkbox"
                                className="form-check-input"
                                checked={
                                  filteredPermissions.every(permission =>
                                    selectedPermissions.includes(permission.can),
                                  ) && filteredPermissions?.length > 0
                                }
                                disabled={!rightTabs?.length}
                                onChange={e => {
                                  const isChecked = e.target.checked;
                                  const currentTabPermissions = filteredPermissions.map(permission => permission.can);
                                  setSelectedPermissions(prev => {
                                    if (isChecked) {
                                      return [...prev, ...currentTabPermissions];
                                    }
                                    return prev.filter(permission => !currentTabPermissions.includes(permission));
                                  });
                                }}
                                id="customSwitchsizemd"
                              />

                              <Label className="form-check-label" for="flexSwitchCheckRightDisabled">
                                Select All
                              </Label>
                            </div>
                          </Container>
                        </Col>

                        <Col className="text-end">
                          <div className="search-box me-2 mb-0 d-inline-block">
                            <input
                              type="text"
                              onChange={e => {
                                const searchValue = e.target.value;
                                setSearchTabPermission(searchValue);
                                if (searchValue === '') {
                                  setfilteredPermissions(
                                    permissions.filter(
                                      permission =>
                                        permission.parent.includes(verticalTab) ||
                                        permission.can === `${verticalTab}.nav`,
                                    ),
                                  );
                                } else {
                                  setfilteredPermissions(() =>
                                    permissions.filter(
                                      ele =>
                                        ele?.can?.includes(searchValue) &&
                                        (ele.parent.includes(verticalTab) || ele.can === `${verticalTab}.nav`),
                                    ),
                                  );
                                }
                              }}
                              disabled={!rightTabs?.length}
                              value={searchTabPermission}
                              className="form-control search"
                              placeholder="Search permissions"
                            />
                            <i className="bx bx-search-alt search-icon" />
                          </div>
                        </Col>
                      </Row>

                      <TabContent className="text-muted mt-4">
                        <Row>
                          <ul
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              listStyle: 'none',
                              columnGap: '35px',
                            }}>
                            {filteredPermissions &&
                              filteredPermissions.length > 0 &&
                              filteredPermissions.map((item, index) => (
                                <li key={index}>
                                  <div className="form-check mb-3">
                                    <Input
                                      className="form-check-input"
                                      checked={selectedPermissions.includes(item?.can)}
                                      onChange={() => {
                                        if (selectedPermissions.includes(item.can)) {
                                          setSelectedPermissions(prev =>
                                            prev.filter(permission => permission !== item.can),
                                          );
                                        } else {
                                          setSelectedPermissions(prev => [...prev, item.can]);
                                        }
                                      }}
                                      type="checkbox"
                                    />
                                    <Label className="form-check-label" htmlFor={`checkbox-${index}`}>
                                      {item.can}
                                    </Label>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </Row>
                      </TabContent>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              className="btn btn-success w-100"
              disabled={!selectedPermissions?.length}
              onClick={handlePermissions}>
              Confirm
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default CustomizePermissionModal;
