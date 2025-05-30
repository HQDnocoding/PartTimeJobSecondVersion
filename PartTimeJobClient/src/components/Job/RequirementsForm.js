import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const RequirementsForm = ({ inputValues, errors, loading, onChange }) => {
  return (
    <>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column md={4}>Độ tuổi tối thiểu</Form.Label>
        <Col md={8}>
          <Form.Control
            type="number"
            placeholder="Nhập độ tuổi tối thiểu (từ 16)"
            name="ageFrom"
            value={inputValues.ageFrom}
            onChange={(e) => onChange('ageFrom', e.target.value)}
            min="16"
            isInvalid={
              errors.includes('Độ tuổi tối thiểu là bắt buộc.') ||
              errors.includes('Độ tuổi tối thiểu phải từ 16 trở lên.')
            }
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            {errors.includes('Độ tuổi tối thiểu là bắt buộc.')
              ? 'Độ tuổi tối thiểu là bắt buộc.'
              : 'Độ tuổi tối thiểu phải từ 16 trở lên.'}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column md={4}>Độ tuổi tối đa</Form.Label>
        <Col md={8}>
          <Form.Control
            type="number"
            placeholder="Nhập độ tuổi tối đa"
            name="ageTo"
            value={inputValues.ageTo}
            onChange={(e) => onChange('ageTo', e.target.value)}
            min="16"
            max="100"
            isInvalid={
              errors.includes('Độ tuổi tối đa là bắt buộc.') ||
              errors.includes('Độ tuổi tối đa phải lớn hơn hoặc bằng độ tuổi tối thiểu.') ||
              errors.includes('Độ tuổi tối đa không được vượt quá 100.')
            }
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            {errors.includes('Độ tuổi tối đa là bắt buộc.')
              ? 'Độ tuổi tối đa là bắt buộc.'
              : errors.includes('Độ tuổi tối đa không được vượt quá 100.')
              ? 'Độ tuổi tối đa không được vượt quá 100.'
              : 'Độ tuổi tối đa phải lớn hơn hoặc bằng độ tuổi tối thiểu.'}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column md={4}>Số năm kinh nghiệm yêu cầu</Form.Label>
        <Col md={8}>
          <Form.Control
            type="number"
            placeholder="Nhập số năm kinh nghiệm yêu cầu"
            name="experienceRequired"
            value={inputValues.experienceRequired}
            onChange={(e) => onChange('experienceRequired', e.target.value)}
            min="0"
            isInvalid={
              errors.includes('Số năm kinh nghiệm yêu cầu là bắt buộc.') ||
              errors.includes('Số năm kinh nghiệm phải là số không âm.')
            }
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            {errors.includes('Số năm kinh nghiệm yêu cầu là bắt buộc.')
              ? 'Số năm kinh nghiệm yêu cầu là bắt buộc.'
              : 'Số năm kinh nghiệm phải là số không âm.'}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
    </>
  );
};

export default RequirementsForm;