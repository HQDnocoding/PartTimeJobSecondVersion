import React from 'react';
import { Button, Row, Col, Spinner } from 'react-bootstrap';

const SubmitButton = ({ loading, onSubmit }) => {
  return (
    <Row>
      <Col md={{ span: 8, offset: 4 }}>
        <Button
          type="submit"
          variant="primary"
          className="w-100 mt-3"
          disabled={loading}
          onClick={onSubmit}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              {' '}Đang tạo...
            </>
          ) : (
            'Tạo Tin Tuyển Dụng'
          )}
        </Button>
      </Col>
    </Row>
  );
};

export default SubmitButton;