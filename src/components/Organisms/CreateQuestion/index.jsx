import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useContextHook } from 'use-context-hook';
import { RefetchContext } from '../../../contexts/refetchContext';
import Label from '../../Atoms/Label';
import Input from '../../Atoms/Input';
import questionThunk from '../../../slices/qnas/thunk';
import Button from '../../Atoms/Button';

export default function CreateQuestionModal({ question, isOpen, setIsOpen }) {
  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState(false);

  const { refetch } = useContextHook(RefetchContext, v => ({
    refetch: v.refetch,
  }));

  const isLoading = useSelector(state => state.Question.isLoading || false);

  const initialValues = { question: '', answer: '', keywords: [] };

  const validationSchema = Yup.object().shape({
    question: Yup.string().required('Question is required').max(500, 'Question must not exceed 500 characters!'),
    answer: Yup.string().required('Answer is required').max(500, 'Answer must not exceed 500 characters!'),
    keywords: Yup.array().min(1, 'Please Enter at least One Keyword!'),
  });

  const onSubmit = data => {
    const payload = {
      ...data,
      keywords: data.keywords.map(keyword => keyword.toLowerCase()),
    };

    if (!question) {
      dispatch(questionThunk.createQuestion({ payload, setIsOpen, refetch }));
    } else {
      dispatch(questionThunk.editQuestion({ id: question?._id, payload, setIsOpen, refetch }));
    }
  };

  useEffect(() => {
    if (question) setIsEdit(true);
  }, []);
  return (
    <>
      <Modal id="showModal" backdrop="static" isOpen={isOpen} centered>
        <ModalHeader className="bg-light p-3" toggle={() => setIsOpen(false)}>
          {isEdit ? 'Edit Question' : 'Create Question'}
        </ModalHeader>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          <Form>
            <ModalBody>
              <Row>
                <Col>
                  <Label className="form-label">Question *</Label>
                  <Input
                    name="question"
                    value={question && question?.question}
                    type="textarea"
                    placeholder="What majors does your university offer?"
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Label className="form-label">Answer *</Label>
                  <Input
                    name="answer"
                    value={question && question?.answer}
                    type="textarea"
                    placeholder="We offer majors in various fields including engineering, business etc."
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Label className="form-label">Keywords *</Label>
                  <Input
                    name="keywords"
                    value={question && question?.keywords?.length && question.keywords}
                    type="tags"
                    placeholder="Keywords..."
                  />
                </Col>
              </Row>
            </ModalBody>

            <ModalFooter>
              <div className="hstack gap-2 justify-content-end">
                <Button type="submit" loading={isLoading} className="btn btn-success">
                  {isEdit ? 'Edit Question' : 'Create Question'}
                </Button>
              </div>
            </ModalFooter>
          </Form>
        </Formik>
      </Modal>
    </>
  );
}
