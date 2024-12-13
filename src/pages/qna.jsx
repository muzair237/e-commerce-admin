import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { Col, Container, Row, Card, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { MdOutlineModeEdit, MdDeleteOutline } from 'react-icons/md';
import { useContextHook } from 'use-context-hook';
import { RefetchContext } from '../contexts/refetchContext';
import withAuthProtection from '../components/Common/withAuthProtection';
import { qnaColumns } from '../common/columns';
import TableContainer from '../components/Common/TableContainer';
import BreadCrumb from '../components/Common/BreadCrumb';
import questionThunk from '../slices/qnas/thunk';
import Button from '../components/Atoms/Button';
import CreateQuestionModal from '../components/Organisms/CreateQuestion';
import DeleteModal from '../components/Molecules/DeleteModal';

const QnA = () => {
  const dispatch = useDispatch();
  const { fetch, refetch } = useContextHook(RefetchContext, v => ({
    fetch: v.fetch,
    refetch: v.refetch,
  }));
  const questions = useSelector(state => state?.Question?.questions || {});
  const isLoading = useSelector(state => state?.Question?.isLoading);
  const hasPermission = useSelector(state => state?.Auth?.hasPermission);

  const [createQuesModal, setCreateQuesModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [question, setQuestion] = useState();
  const [quesToDelete, setQuesToDelete] = useState();
  const [filters, setFilters] = useState({
    page: 1,
    itemsPerPage: 10,
    getAll: false,
    startDate: '',
    endDate: '',
    searchText: '',
    sort: 'latest',
    type: '',
  });

  const setSearchQueryCallback = useCallback(newSearchQuery => {
    setFilters(newSearchQuery);
  }, []);

  const deleteQuestion = () => {
    dispatch(questionThunk.deleteQuestion({ quesToDelete, setDeleteModal, refetch }));
  };

  useEffect(() => {
    dispatch(questionThunk.getAllQuestions(filters));
  }, [filters, fetch]);

  const actionBtns = _ => (
    <>
      <div className="d-flex gap-3">
        {hasPermission.includes('qna.edit') && (
          <div className="edit">
            <MdOutlineModeEdit
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setQuestion(_);
                setCreateQuesModal(true);
              }}
              color="green"
              size={19}
              id="edit"
            />
            <UncontrolledTooltip placement="top" target="edit">
              Edit
            </UncontrolledTooltip>
          </div>
        )}
        {hasPermission.includes('qna.delete') && (
          <div className="remove">
            <MdDeleteOutline
              style={{ cursor: 'pointer' }}
              id="delete"
              size={19}
              color="red"
              onClick={() => {
                setQuesToDelete(_?._id);
                setDeleteModal(true);
              }}
            />
            <UncontrolledTooltip placement="top" target="delete">
              Delete
            </UncontrolledTooltip>
          </div>
        )}
      </div>
    </>
  );
  const { question_rows, totalCount } = useMemo(
    () => ({
      question_rows: questions?.items?.map(_ => [
        format(new Date(_?.createdAt), 'yyyy-MM-dd') || '------------',
        _?.question || '------------',
        _?.answer || '------------',
        _?.keywords?.length > 0 ? _.keywords.map(__ => __).join(', ') : '------------',
        actionBtns(_),
      ]),
      totalCount: questions?.totalItems,
    }),
    [questions?.items],
  );

  return (
    <>
      <Head>
        <title>WebNova | QnA&apos;s</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="page-content card-animate">
        <Container fluid>
          <BreadCrumb title="QnA's" />
          <Row>
            <Col lg={12}>
              <Card id="qnaList">
                <CardHeader>
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 fw-semibold">QnA List</h5>
                      </div>
                    </div>
                    {hasPermission.includes('qna.create') && (
                      <div className="col-sm-auto">
                        <div>
                          <Button
                            onClick={() => {
                              setQuestion();
                              setCreateQuesModal(true);
                            }}
                            type="button"
                            className="btn btn-success add-btn"
                            id="create-btn">
                            <i className="ri-add-line align-bottom me-1" /> Create Question
                          </Button>{' '}
                        </div>
                      </div>
                    )}
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                      columns={qnaColumns}
                      data={question_rows || []}
                      isGlobalFilter
                      isLoading={isLoading}
                      isAdminFilter
                      currentPage={filters?.page}
                      totalCount={totalCount}
                      itemsPerPage={filters?.itemsPerPage}
                      setFilters={setSearchQueryCallback}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      {createQuesModal && (
        <CreateQuestionModal question={question} isOpen={createQuesModal} setIsOpen={setCreateQuesModal} />
      )}
      {deleteModal && (
        <DeleteModal
          isOpen={deleteModal}
          setIsOpen={setDeleteModal}
          handleClick={deleteQuestion}
          message="Are you sure you Want to Delete this Question?"
        />
      )}
    </>
  );
};

export default withAuthProtection(QnA);
