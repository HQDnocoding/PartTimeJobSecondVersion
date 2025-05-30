import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, InputGroup, Row, Col } from 'react-bootstrap';
import APIs, { endpoints } from '../../configs/APIs';
import useValidatePassword from '../../utils/useValidatePassword';
import useValidateUsername from '../../utils/useValidateUsername';
import './RegisterCandidate.scss';

const RegisterCandidate = () => {
  const [inputValues, setInputValues] = useState({
    fullName: '',
    username: '', 
    dateOfBirth: '',
    selfDescription: '',
    password: '',
    confirmPassword: '',
    avatarFile: null,
    curriculumVitaeFile: null,
    otp: '',
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const { validate: validatePassword, error: passwordError } = useValidatePassword();
  const { validate: validateUsername, error: usernameError } = useValidateUsername();

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setInputValues(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
      ...(name === 'username' && isOtpSent ? { otp: '' } : {}),
    }));
    if (name === 'username' && isOtpSent) {
      setIsOtpSent(false);
    }
    setErrors([]);
  };

  const handleSendOtp = async () => {
    if (!inputValues.username) {
      setErrors(['Vui lòng nhập email']);
      return;
    }
    setIsLoading(true);
    try {
      await APIs.post(endpoints['requestOTP'], { email: inputValues.username }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setIsOtpSent(true);
      setCooldown(60);
      setInputValues(prev => ({ ...prev, otp: '' })); 
      toast.success(isOtpSent ? 'Đã gửi lại OTP thành công!' : 'Mã OTP đã được gửi đến email của bạn!');
    } catch (err) {
      setErrors(['Không thể gửi OTP. Vui lòng thử lại.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const isUsernameValid = validateUsername(inputValues.username);
    const isPasswordValid = validatePassword(inputValues.password);

    let validationErrors = [];
    if (!isUsernameValid && usernameError) {
      validationErrors.push(usernameError);
    }
    if (!isPasswordValid && passwordError) {
      validationErrors.push(passwordError);
    }
    if (inputValues.password !== inputValues.confirmPassword) {
      validationErrors.push('Mật khẩu và xác nhận mật khẩu không khớp.');
    }
    if (!inputValues.avatarFile) {
      validationErrors.push('Bạn phải tải lên ảnh đại diện.');
    }
    if (isOtpSent && !inputValues.otp.trim()) {
      validationErrors.push('Vui lòng nhập mã OTP.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    Object.entries(inputValues).forEach(([key, value]) => {
      if (key !== 'confirmPassword' && value) {
        formData.append(key, value);
      }
    });

    setIsLoading(true);
    try {
      const response = await APIs.post(endpoints['registerCandidate'], formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message || 'Đăng ký thành công!');
      navigate('/login', { replace: true });
    } catch (err) {
      let errorMessages = ['Đăng ký thất bại!'];
      if (err.response?.data?.message) {
        errorMessages = [err.response.data.message];
      } else if (err.response?.data?.errors) {
        errorMessages = Object.entries(err.response.data.errors).map(([field, msg]) => `${field}: ${msg}`);
      }
      setErrors(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-candidate-container">
      {errors.length > 0 && (
        <Alert variant="danger">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} encType="multipart/form-data" className="register-candidate-form">
        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-center">
              <Form.Label className="mb-0">Họ và tên <span className="required">*</span></Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                type="text"
                id="fullName"
                name="fullName"
                value={inputValues.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-center">
              <Form.Label className="mb-0">Email <span className="required">*</span></Form.Label>
            </Col>
            <Col sm={8}>
              <InputGroup>
                <Form.Control
                  type="email"
                  id="username"
                  name="username"
                  value={inputValues.username}
                  onChange={handleChange}
                  placeholder="abc@email.xyz"
                  required
                />
                <Button
                  variant="outline-primary"
                  onClick={handleSendOtp}
                  disabled={isLoading || cooldown > 0}
                >
                  {cooldown > 0 ? `Chờ (${cooldown}s)` : isOtpSent ? 'Gửi lại OTP' : 'Gửi OTP'}
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-center">
              <Form.Label className="mb-0">Ngày sinh <span className="required">*</span></Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={inputValues.dateOfBirth}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
        </Form.Group>


        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-start">
              <Form.Label className="mb-0">Giới thiệu bản thân</Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                as="textarea"
                id="selfDescription"
                name="selfDescription"
                value={inputValues.selfDescription}
                onChange={handleChange}
                placeholder="Nhập giới thiệu bản thân (tùy chọn)"
                rows={5}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-center">
              <Form.Label className="mb-0">Mật khẩu <span className="required">*</span></Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                type="password"
                id="password"
                name="password"
                value={inputValues.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-center">
              <Form.Label className="mb-0">Xác nhận mật khẩu <span className="required">*</span></Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={inputValues.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                required
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-center">
              <Form.Label className="mb-0">Ảnh đại diện <span className="required">*</span></Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                type="file"
                id="avatarFile"
                name="avatarFile"
                onChange={handleChange}
                accept="image/jpeg,image/png"
                required
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-center">
              <Form.Label className="mb-0">CV</Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                type="file"
                id="curriculumVitaeFile"
                name="curriculumVitaeFile"
                onChange={handleChange}
                accept=".pdf"
              />
            </Col>
          </Row>
        </Form.Group>

        {isOtpSent && (
          <Form.Group className="mb-3">
            <Row>
              <Col sm={4} className="d-flex align-items-center">
                <Form.Label className="mb-0">Mã OTP <span className="required">*</span></Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  id="otpInput"
                  name="otp"
                  value={inputValues.otp}
                  onChange={handleChange}
                  placeholder="Nhập mã OTP"
                  required
                />
              </Col>
            </Row>
          </Form.Group>
        )}

        <div className="text-center">
          <Button
            variant="primary"
            type="submit"
            disabled={!isOtpSent || isLoading}
            className="btn-block"
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RegisterCandidate;