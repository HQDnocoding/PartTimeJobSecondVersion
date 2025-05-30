import { toast } from 'react-toastify';
import { Form, Button, Alert, InputGroup, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import useCompanyForm from './useCompanyForm';
import useLocationData from './useLocationData';
import useOtpCooldown from './useOtpCooldown';
import './RegisterCompany.scss';

const RegisterCompany = () => {
  const navigate = useNavigate();
  const { cooldown, setCooldown } = useOtpCooldown();
  const { inputValues, errors, isLoading, isOtpSent, handleChange, handleSendOtp, handleSubmit, handleRemoveFile } =
    useCompanyForm(navigate, setCooldown);
  const { provinces, districts, isProvinceLoading, isDistrictLoading } = useLocationData(inputValues.city);

  return (
    <div className="register-company-container">
      {errors.length > 0 && (
        <Alert variant="danger">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} encType="multipart/form-data" className="register-company-form">
        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-center">
              <Form.Label className="mb-0">Tên công ty <span className="required">*</span></Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                type="text"
                id="name"
                name="name"
                value={inputValues.name}
                onChange={handleChange}
                placeholder="Nhập tên công ty"
                required
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-center">
              <Form.Label className="mb-0">Mã số thuế <span className="required">*</span></Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                type="text"
                id="taxCode"
                name="taxCode"
                value={inputValues.taxCode}
                onChange={handleChange}
                placeholder="Nhập mã số thuế"
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
              <Form.Label className="mb-0">Địa chỉ <span className="required">*</span></Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                type="text"
                id="fullAddress"
                name="fullAddress"
                value={inputValues.fullAddress}
                onChange={handleChange}
                placeholder="Nhập địa chỉ công ty"
                required
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-center">
              <Form.Label className="mb-0">Tỉnh/Thành phố <span className="required">*</span></Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Select
                id="city"
                name="city"
                value={inputValues.city}
                onChange={handleChange}
                required
                disabled={isProvinceLoading || provinces.length === 0}
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map(province => (
                  <option key={province.code} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-center">
              <Form.Label className="mb-0">Quận/Huyện <span className="required">*</span></Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Select
                id="district"
                name="district"
                value={inputValues.district}
                onChange={handleChange}
                required
                disabled={isDistrictLoading || districts.length === 0 || !inputValues.city}
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map(district => (
                  <option key={district.code} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row>
            <Col sm={4} className="d-flex align-items-start">
              <Form.Label className="mb-0">Giới thiệu công ty</Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                as="textarea"
                id="selfDescription"
                name="selfDescription"
                value={inputValues.selfDescription}
                onChange={handleChange}
                placeholder="Nhập giới thiệu công ty (tùy chọn)"
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
              <Form.Label className="mb-0">Logo công ty <span className="required">*</span></Form.Label>
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
              <Form.Label className="mb-0">Hình ảnh công ty <span className="required">*</span></Form.Label>
            </Col>
            <Col sm={8}>
              <Form.Control
                type="file"
                id="files"
                name="files"
                onChange={handleChange}
                accept="image/jpeg,image/png"
                multiple
              />
              <Form.Text className="text-muted">
                Vui lòng chọn ít nhất 3 hình ảnh (JPG, PNG).
              </Form.Text>
              {inputValues.files.length > 0 && (
                <div className="mt-2">
                  <h6>Hình ảnh đã chọn:</h6>
                  <ul className="list-group">
                    {inputValues.files.map((file, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {file.name}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                        >
                          Gỡ
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                  id="otp"
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

export default RegisterCompany;