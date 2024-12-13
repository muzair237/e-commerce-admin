import React from 'react';
import CountUp from 'react-countup';
import { Col, Card, CardBody } from 'reactstrap';

const DashCards = ({ dashboardCards }) => (
  <>
    {dashboardCards &&
      dashboardCards?.length > 0 &&
      dashboardCards?.map((ele, index) => (
        <Col xl={3} md={6} key={index}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{ele?.label}</p>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value" data-target="559.25">
                      <CountUp start={0} separator="," end={ele?.value} duration={4} />
                    </span>
                  </h4>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title rounded fs-3 bg-soft-bg-info">
                    <i className={ele?.icon} />
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
  </>
);

export default DashCards;
