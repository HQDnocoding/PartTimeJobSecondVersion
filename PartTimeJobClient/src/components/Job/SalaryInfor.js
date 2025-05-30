import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const SalaryInfor= ({ inputValues, errors, loading, onChange }) => {
  return (
    <>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column md={4}>Lương tối thiểu (VNĐ)</Form.Label>
        <Col md={8}>
          <Form.Control
            type="number"
            placeholder="Nhập lương tối thiểu"
            name="salaryMin"
            value={inputValues.salaryMin}
            onChange={(e) => onChange('salaryMin', e.target.value)}
            min="0"
            isInvalid={
              errors.includes('Lương tối thiểu là bắt buộc.') ||
              errors.includes('Lương tối thiểu phải là số dương.')
            }
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            {errors.includes('Lương tối thiểu là bắt buộc.')
              ? 'Lương tối thiểu là bắt buộc.'
              : 'Lương tối thiểu phải là số dương.'}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column md={4}>Lương tối đa (VNĐ)</Form.Label>
        <Col md={8}>
          <Form.Control
            type="number"
            placeholder="Nhập lương tối đa"
            name="salaryMax"
            value={inputValues.salaryMax}
            onChange={(e) => onChange('salaryMax', e.target.value)}
            min="0"
            isInvalid={
              errors.includes('Lương tối đa là bắt buộc.') ||
              errors.includes('Lương tối đa phải là số dương.') ||
              errors.includes('Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu.')
            }
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            {errors.includes('Lương tối đa là bắt buộc.')
              ? 'Lương tối đa là bắt buộc.'
              : errors.includes('Lương tối đa phải là số dương.')
              ? 'Lương tối đa phải là số dương.'
              : 'Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu.'}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
    </>
  );
};

export default SalaryInfor;