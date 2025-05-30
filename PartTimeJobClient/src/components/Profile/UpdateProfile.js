import React, { useContext, useState } from 'react';
import { Form, Button, Card, Row, Col, Alert, Image } from 'react-bootstrap';
import { MyUserContext, MyDispatchContext } from '../../configs/Contexts';
import { authApis, endpoints } from '../../configs/APIs';
import { useNavigate } from 'react-router-dom';
import './profile.scss';
import useLocationData from '../Authenticate/useLocationData';

const UpdateProfile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: user?.username || '',
        fullName: user?.candidate?.fullName || '',
        phone: user?.candidate?.phone || '',
        dateOfBirth: user?.candidate?.dateOfBirth ? new Date(user?.candidate?.dateOfBirth).toISOString().split('T')[0] : '',
        city: user?.candidate?.city || '',
        selfDescription: user?.candidate?.selfDescription || '',
        avatarFile: null,
        curriculumVitaeFile: null,
        otpMail: '',
        otpPhone: '',
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState({ email: false, phone: false });
    const [avatarPreview, setAvatarPreview] = useState(user?.candidate?.avatar || '');
    const { provinces, isProvinceLoading } = useLocationData(formData.city);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file changes
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        if (file) {
            if (name === 'avatarFile') {
                setAvatarPreview(URL.createObjectURL(file));
            }
            setFormData({ ...formData, [name]: file });
        }
    };

    // Request OTP for email
    const requestEmailOtp = async () => {
        if (!formData.email) {
            setError('Vui lòng nhập email.');
            return;
        }
        setOtpLoading({ ...otpLoading, email: true });
        try {
            await authApis().post(endpoints['requestOTP'], { email: formData.email });
            setSuccess('OTP đã được gửi đến email của bạn.');
        } catch (err) {
            setError(err.response?.data || 'Không thể gửi OTP email.');
        } finally {
            setOtpLoading({ ...otpLoading, email: false });
        }
    };

    // Request OTP for phone
    const requestPhoneOtp = async () => {
        if (!formData.phone || !/^0[0-9]{9}$/.test(formData.phone)) {
            setError('Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 chữ số).');
            return;
        }
        setOtpLoading({ ...otpLoading, phone: true });
        try {
            await authApis().post(endpoints['requestPhoneOTP'], { phoneNumber: formData.phone });
            setSuccess('OTP đã được gửi đến số điện thoại của bạn.');
        } catch (err) {
            setError(err.response?.data?.error || 'Không thể gửi OTP điện thoại.');
        } finally {
            setOtpLoading({ ...otpLoading, phone: false });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            console.log(user);
            
            formDataToSend.append('id', user.candidate.id)
            formDataToSend.append('email', formData.email);
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('dateOfBirth', formData.dateOfBirth);
            formDataToSend.append('city', formData.city);
            formDataToSend.append('selfDescription', formData.selfDescription);
            if (formData.otpMail) formDataToSend.append('otpMail', formData.otpMail);
            if (formData.otpPhone) formDataToSend.append('otpPhone', formData.otpPhone);
            if (formData.avatarFile) formDataToSend.append('avatarFile', formData.avatarFile);
            if (formData.curriculumVitaeFile) formDataToSend.append('curriculumVitaeFile', formData.curriculumVitaeFile);

            const response = await authApis().put(endpoints['updateCandidate'](user.id), formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            dispatch({
                type: 'update_user',
                payload: { ...user, username: formData.email, candidate: { ...user.candidate, ...response.data } },
            });

            setSuccess('Cập nhật hồ sơ thành công!');
            setTimeout(() => navigate('/candidate/profile'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ(Kiểm tra số điện thoại hoặc email có thể đã được dùng bởi tài khoản khác ).');
            console.error('Update error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <Card className="profile-card shadow-sm">
                <Card.Body>
                    <h2 className="text-center mb-4">Cập nhật hồ sơ</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={4} className="text-center">
                                <Image
                                    src={avatarPreview || 'https://via.placeholder.com/150'}
                                    alt="Avatar Preview"
                                    className="profile-avatar mb-3"
                                    style={{ borderRadius: '50%', width: 200, height: 200 }}
                                    thumbnail
                                />
                                <Form.Group controlId="avatarFile" className="mb-3">
                                    <Form.Label>Ảnh đại diện</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        name="avatarFile"
                                        onChange={handleFileChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group controlId="email" className="mb-3">
                                    <Row>
                                        <Col sm={4} className="d-flex align-items-center">
                                            <Form.Label>Email</Form.Label>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Nhập email"
                                            />
                                        </Col>
                                        <Col sm={2}>
                                            <Button
                                                variant="outline-primary"
                                                onClick={requestEmailOtp}
                                                disabled={otpLoading.email || !formData.email}
                                            >
                                                {otpLoading.email ? 'Đang gửi...' : 'Gửi OTP'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group controlId="otpMail" className="mb-3">
                                    <Row>
                                        <Col sm={4} className="d-flex align-items-center">
                                            <Form.Label>Mã OTP Email</Form.Label>
                                        </Col>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="otpMail"
                                                value={formData.otpMail}
                                                onChange={handleChange}
                                                placeholder="Nhập mã OTP email"
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group controlId="fullName" className="mb-3">
                                    <Row>
                                        <Col sm={4} className="d-flex align-items-center">
                                            <Form.Label>Họ và tên</Form.Label>
                                        </Col>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="Nhập họ và tên"
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group controlId="phone" className="mb-3">
                                    <Row>
                                        <Col sm={4} className="d-flex align-items-center">
                                            <Form.Label>Số điện thoại</Form.Label>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Nhập số điện thoại (0xxxxxxxxx)"
                                            />
                                        </Col>
                                        <Col sm={2}>
                                            <Button
                                                variant="outline-primary"
                                                onClick={requestPhoneOtp}
                                                disabled={otpLoading.phone || !formData.phone}
                                            >
                                                {otpLoading.phone ? 'Đang gửi...' : 'Gửi OTP'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group controlId="otpPhone" className="mb-3">
                                    <Row>
                                        <Col sm={4} className="d-flex align-items-center">
                                            <Form.Label>Mã OTP Điện thoại</Form.Label>
                                        </Col>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="otpPhone"
                                                value={formData.otpPhone}
                                                onChange={handleChange}
                                                placeholder="Nhập mã OTP điện thoại"
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group controlId="dateOfBirth" className="mb-3">
                                    <Row>
                                        <Col sm={4} className="d-flex align-items-center">
                                            <Form.Label>Ngày sinh</Form.Label>
                                        </Col>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col sm={4} className="d-flex align-items-center">
                                            <Form.Label>Tỉnh/Thành phố <span className="required">*</span></Form.Label>
                                        </Col>
                                        <Col sm={8}>
                                            <Form.Select
                                                id="city"
                                                name="city"
                                                value={formData.city}
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
                                <Form.Group controlId="curriculumVitaeFile" className="mb-3">
                                    <Row>
                                        <Col sm={4} className="d-flex align-items-center">
                                            <Form.Label>CV</Form.Label>
                                        </Col>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="file"
                                                name="curriculumVitaeFile"
                                                onChange={handleFileChange}
                                                accept=".pdf"
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group controlId="selfDescription" className="mb-3">
                                    <Row>
                                        <Col sm={4} className="d-flex align-items-center">
                                            <Form.Label>Mô tả bản thân</Form.Label>
                                        </Col>
                                        <Col sm={8}>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                name="selfDescription"
                                                value={formData.selfDescription}
                                                onChange={handleChange}
                                                placeholder="Mô tả ngắn về bản thân"
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                    className="w-100"
                                >
                                    {loading ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default UpdateProfile;