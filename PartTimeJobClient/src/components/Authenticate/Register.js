import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import RegisterCandidate from './RegisterCandidate';
import RegisterCompany from './RegisterCompany';
import { MyUserContext } from '../../configs/Contexts';
import './Register.scss';

const Register = () => {
  const u = useContext(MyUserContext);
  const [role, setRole] = useState('candidate');
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  useEffect(() => {
    if (u) {
      navigate("/");
    }
  }, [u, navigate]);

  return (
    <Container fluid className="register-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col lg={6} md={8} sm={10}>
          <Card className="register-card">
            <Card.Body className="p-5">
              <h2 className="register-title">Đăng ký tài khoản</h2>
              <Form.Group className="mb-4 role-group">
                <Row>
                  <Col sm={4} className="d-flex align-items-center">
                    <Form.Label htmlFor="role" className="mb-0">Vai trò</Form.Label>
                  </Col>
                  <Col sm={8}>
                    <Form.Select
                      id="role"
                      value={role}
                      onChange={handleRoleChange}
                      className="form-control role-select"
                    >
                      <option value="candidate">Ứng viên</option>
                      <option value="company">Công ty</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>
              {role === 'candidate' ? <RegisterCandidate /> : <RegisterCompany />}
              <div className="text-center mt-4">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-primary">
                  Đăng nhập
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;