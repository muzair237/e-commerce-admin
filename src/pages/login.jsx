import React from 'react';
import Head from 'next/head';
import { Card, Col, Container, Row } from 'reactstrap';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Label from '../components/Atoms/Label';
import Input from '../components/Atoms/Input';
import Button from '../components/Atoms/Button';
import AuthSlider from '../components/Organisms/AuthCarousel';
import authThunk from '../slices/auth/thunk';
import isLoggedIn from '../components/Common/isLoggedIn';

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state?.Auth?.isLoading);
  const initialValues = { email: '', password: '' };

  const validationSchema = Yup.object({
    email: Yup.string().required('Please Enter Email!').email('Please Enter a Valid Email!'),
    password: Yup.string().required('Please Enter Password!'),
  });

  const onSubmit = async payload => {
    dispatch(authThunk.login({ payload, router }));
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
                          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                            <Form>
                              <div className="mb-3">
                                <Label htmlFor="email">Email</Label>
                                <Input name="email" type="text" placeholder="Enter email" />
                              </div>
                              <div className="mb-3">
                                <Label htmlFor="password-input">Password</Label>
                                <div className="position-relative auth-pass-inputgroup mb-3">
                                  <Input name="password" type="password" placeholder="Enter password" />
                                </div>
                              </div>
                              <div className="form-check">
                                <Input name="rememberMe" className="form-check-input" type="checkbox" />
                                <Label htmlFor="auth-remember-check">Remember me</Label>
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
                          </Formik>
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
