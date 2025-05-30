import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const DescriptionForm = ({ inputValues, errors, loading, onChange }) => {
  return (
    <>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column md={4}>Mô tả công việc</Form.Label>
        <Col md={8}>
          <Form.Control
            as="textarea"
            placeholder="Nhập mô tả công việc"
            name="description"
            value={inputValues.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={5}
            isInvalid={errors.includes('Mô tả công việc là bắt buộc.')}
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            Mô tả công việc là bắt buộc.
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column md={4}>Yêu cầu công việc</Form.Label>
        <Col md={8}>
          <Form.Control
            as="textarea"
            placeholder="Nhập yêu cầu công việc"
            name="jobRequired"
            value={inputValues.jobRequired}
            onChange={(e) => onChange('jobRequired', e.target.value)}
            rows={5}
            isInvalid={errors.includes('Yêu cầu công việc là bắt buộc.')}
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            Yêu cầu công việc là bắt buộc.
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
    </>
  );
};

export default DescriptionForm;