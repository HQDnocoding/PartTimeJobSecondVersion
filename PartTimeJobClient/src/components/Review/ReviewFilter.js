import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import rolesAndStatus from '../../utils/rolesAndStatus';

const ReviewFilter = ({ role, onFilterChange }) => {
  const [candidateName, setCandidateName] = useState('');
  const [jobName, setJobName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [reviewText, setReviewText] = useState('');

  const handleFilter = (e) => {
    e.preventDefault();
    onFilterChange({
      candidateName,
      jobName,
      companyName,
      reviewText,
    });
  };

  const handleClear = () => {
    setCandidateName('');
    setJobName('');
    setCompanyName('');
    setReviewText('');
    onFilterChange({
      candidateName: '',
      jobName: '',
      companyName: '',
      reviewText: '',
    });
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Form onSubmit={handleFilter}>
          <Row>
            {role === rolesAndStatus.company && (
              <Col md={4}>
                <Form.Group controlId="candidateName">
                  <Form.Label>Tên ứng viên</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên ứng viên"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            )}
            <Col md={4}>
              <Form.Group controlId="jobName">
                <Form.Label>Công việc</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên công việc"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="companyName">
                <Form.Label>{role === rolesAndStatus.candidate ? 'Tên công ty' : 'Công ty đánh giá'}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={role === rolesAndStatus.candidate ? 'Nhập tên công ty' : 'Nhập tên công ty đánh giá'}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </Form.Group>
            </Col>
            {role === rolesAndStatus.candidate && (
              <Col md={4}>
                <Form.Group controlId="reviewText">
                  <Form.Label>Nhận xét</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập nội dung nhận xét"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </Form.Group>
              </Col>
            )}
          </Row>
          <div className="mt-3 text-end">
            <Button variant="secondary" onClick={handleClear} className="me-2">
              Xóa bộ lọc
            </Button>
            <Button variant="primary" type="submit">
              Lọc
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ReviewFilter;