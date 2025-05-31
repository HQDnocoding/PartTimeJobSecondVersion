import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const JobInfoForm = ({ inputValues, majors, days, errors, loading, onChange, onDayChange }) => {
  return (
    <>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column md={4}>Tên công việc</Form.Label>
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Nhập tên công việc"
            name="jobName"
            value={inputValues.jobName}
            onChange={(e) => onChange('jobName', e.target.value)}
            isInvalid={errors.includes('Tên công việc là bắt buộc.')}
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            Tên công việc là bắt buộc.
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column md={4}>Ngành nghề</Form.Label>
        <Col md={8}>
          <Form.Select
            name="majorId"
            value={inputValues.majorId}
            onChange={(e) => onChange('majorId', e.target.value)}
            isInvalid={errors.includes('Ngành nghề là bắt buộc.')}
            disabled={loading}
          >
            <option value="">Chọn ngành nghề</option>
            {majors.map((major) => (
              <option key={major.id} value={major.id}>
                {major.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Ngành nghề là bắt buộc.
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column md={4}>Thời gian làm việc</Form.Label>
        <Col md={8}>
          <div className="checkbox-group">
            {days.map((day) => (
              <Form.Check
                key={day.id}
                type="checkbox"
                style={{display:'flex'}}
                label={day.name}
                value={day.id}
                checked={inputValues.dayIds.includes(day.id)}
                onChange={() => onDayChange(day.id)}
                disabled={loading}
                isInvalid={errors.includes('Phải chọn ít nhất một thời gian làm việc.')}
              />
            ))}
          </div>
          {errors.includes('Phải chọn ít nhất một thời gian làm việc.') && (
            <div className="invalid-feedback d-block">
              Phải chọn ít nhất một thời gian làm việc.
            </div>
          )}
        </Col>
      </Form.Group>
    </>
  );
};

export default JobInfoForm;