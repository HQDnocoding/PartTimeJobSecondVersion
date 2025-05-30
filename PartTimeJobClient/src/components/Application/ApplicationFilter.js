import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './applicationFilter.scss';
import { states } from '../../utils/rolesAndStatus';

const ApplicationFilter = ({ jobs, filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = { status: '', jobId: '' };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Form onSubmit={handleSubmit} className="application-filter p-3 rounded shadow-sm bg-light">
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select name="status" value={localFilters.status} onChange={handleChange}>
              <option value="">Tất cả</option>
              <option value={states['waiting for approving']}>Chờ duyệt</option>
              <option value={states['application was approved']}>Đã duyệt</option>
              <option value={states['application was refused']}>Đã từ chối</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Công việc</Form.Label>
            <Form.Select name="jobId" value={localFilters.jobId} onChange={handleChange}>
              <option value="">Tất cả</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.jobName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-center">
          <Button type="submit" variant="primary" className="me-2">
            Lọc
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Xóa bộ lọc
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ApplicationFilter;