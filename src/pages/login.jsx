import React, { useState } from 'react';
import Head from 'next/head';
import { Card, Col, Container, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { useForm } from '@/components/Organisms/Form';
import Field from '@/components/Atoms/Field';
import Form from '../components/Organisms/Form/Form';
import Button from '../components/Atoms/Button';
import AuthSlider from '../components/Organisms/AuthCarousel';
import authThunk from '../slices/auth/thunk';
import isLoggedIn from '../components/Common/isLoggedIn';

const Login = () => {
  const router = useRouter();
  const [form] = useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async payload => {
    try {
      setIsLoading(true);
      await dispatch(authThunk.login({ payload, router }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>WebNova | Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="auth-page-wrapper auth-bg-cover py-4 d-flex justify-content-center align-items-center min-vh-100">
        <div className="auth-page-content overflow-hidden pt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <Card className="overflow-hidden">
                  <Row className="g-0">
                    <AuthSlider />
                    <Col lg={6}>
                      <div className="p-lg-5 p-4">
                        <div>
                          <h5 className="text-primary">Welcome Back !</h5>
                          <p className="text-muted">Sign in to continue to WebNova Admin.</p>
                        </div>
                        <div className="mt-4">
                          <Form form={form} onSubmit={onSubmit}>
                            <div className="mb-3">
                              <Form.Item
                                label="Email"
                                type="text"
                                name="email"
                                placeholder="admin@example.com"
                                rules={[{ required: true }]}>
                                <Field />
                              </Form.Item>
                            </div>
                            <div className="mb-3">
                              <Form.Item
                                label="Password"
                                type="password"
                                name="password"
                                placeholder="********"
                                rules={[{ required: true }]}>
                                <Field />
                              </Form.Item>
                            </div>
                            <div>
                              <Form.Item
                                label="Remember Me"
                                type="checkbox"
                                name="rememberMe"
                                // eslint-disable-next-line no-console
                                onChange={e => console.log('e: ', e.target.checked)}>
                                <Field />
                              </Form.Item>
                            </div>
                            <div className="mt-4 mb-5">
                              <Button
                                color="primary"
                                disabled={isLoading}
                                loading={isLoading}
                                className="w-100"
                                type="submit">
                                Sign In
                              </Button>
                            </div>
                            <div className="text-center">
                              <p className="mb-0">&copy; {new Date().getFullYear()} WebNova, Developed by WebNova</p>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default isLoggedIn(Login);
