import React, { useContext, useState } from 'react';
import { Card, Row, Col, Image, Button, Carousel, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MyDispatchContext, MyUserContext } from '../../configs/Contexts';
import AuthenticationStatus from './AuthenticationStatus';
import AddAuthenticationModal from './AddAuthenticationModal';
import './profile.scss';
import { authApis, endpoints } from '../../configs/APIs';

const CompanyInfo = () => {
  const user = useContext(MyUserContext);
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    paperFile: null,
    idCardFrontFile: null,
    idCardBackFile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const dispatch = useContext(MyDispatchContext);

  const handleViewJobs = () => {
    navigate('/company/profile/job-list');
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleUpdate = async () => {
    if (!user.company.companyAuthentication) {
      setError('Không có thông tin chứng thực để cập nhật');
      return;
    }

    const data = new FormData();
    if (formData.paperFile) data.append('paperFile', formData.paperFile);
    if (formData.idCardFrontFile) data.append('idCardFrontFile', formData.idCardFrontFile);
    if (formData.idCardBackFile) data.append('idCardBackFile', formData.idCardBackFile);

    if (!formData.paperFile && !formData.idCardFrontFile && !formData.idCardBackFile) {
      setError('Vui lòng chọn ít nhất một file để cập nhật');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await authApis().put(
        endpoints['updateCompanyAuthentication'](user.company.companyAuthentication.id),
        data
      );
      setSuccess('Cập nhật thông tin chứng thực thành công! Vui lòng tải lại trang để cập nhật.');

      setFormData({ paperFile: null, idCardFrontFile: null, idCardBackFile: null });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      // setError(err.response?.data?.error || 'Lỗi khi cập nhật thông tin chứng thực');
    } finally {
      setLoading(false);
      await authApis().get(endpoints['infor']).then(res => { dispatch({ type: 'update_user', payload: res.data }) }).catch(err => {
        dispatch({ type: 'logout' });
      });
    }
  };

  const handleDelete = async () => {
    if (!user.company.companyAuthentication) {
      setError('Không có thông tin chứng thực để xóa');
      return;
    }

    if (!window.confirm('Bạn có chắc muốn xóa thông tin chứng thực này?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await authApis().delete(
        endpoints['deleteCompanyAuthentication'](user.company.companyAuthentication.id)
      );
      setSuccess('Xóa thông tin chứng thực thành công! Vui lòng tải lại trang để cập nhật.');
      setFormData({ paperFile: null, idCardFrontFile: null, idCardBackFile: null });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi xóa thông tin chứng thực');
    } finally {
      setLoading(false);
      await authApis().get(endpoints['infor']).then(res => { dispatch({ type: 'update_user', payload: res.data }) }).catch(err => {
        dispatch({ type: 'logout' });
      });
    }
  };

  const handleAddSuccess = () => {
    setSuccess('Thêm thông tin chứng thực thành công! Vui lòng tải lại trang để cập nhật.');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="profile-container">
      <Card className="profile-card shadow-sm">
        <Row className="g-0">
          <Col md={4} className="profile-image-section">
            <Image
              src={user?.company?.avatar || 'https://via.placeholder.com/150'}
              alt={`${user?.company?.name}'s avatar`}
              roundedCircle
              className="profile-avatar"
              thumbnail
            />
            <h3 className="profile-username">{user?.company?.name || 'Chưa cập nhật'}</h3>
            <Button
              variant="primary"
              className="mt-4 profile-applications-button"
              onClick={handleViewJobs}
            >
              Bài đăng tuyển
            </Button>
            {!user?.company?.companyAuthentication && (
              <Button
                variant="success"
                className="mt-2"
                onClick={() => setShowAddModal(true)}
              >
                Thêm thông tin chứng thực
              </Button>
            )}
          </Col>

          <Col md={8} className="profile-details-section">
            <Card.Body>
              <h2 className="profile-fullname">{user?.company?.name || 'Chưa cập nhật'}</h2>
              <hr className="profile-divider" />
              <Row className="profile-info-row mb-4">
                <Col md={4} className="profile-label">Email:</Col>
                <Col md={8}>{user?.username || 'Chưa cập nhật'}</Col>
              </Row>
              <Row className="profile-info-row mb-4">
                <Col md={4} className="profile-label">Địa chỉ:</Col>
                <Col md={8}>
                  {user?.company?.fullAddress}, {user?.company?.district}, {user?.company?.city}
                </Col>
              </Row>
              <Row className="profile-info-row mb-4">
                <Col md={4} className="profile-label">Mã số thuế:</Col>
                <Col md={8}>{user?.company?.taxCode || 'Chưa cập nhật'}</Col>
              </Row>
              <Row className="profile-info-row mb-4">
                <Col md={4} className="profile-label">Giới thiệu:</Col>
                <Col md={8}>{user?.company?.selfDescription || 'Chưa cập nhật'}</Col>
              </Row>
              <Row className="profile-info-row mb-4">
                <Col md={4} className="profile-label">Hình ảnh nơi làm việc:</Col>
                <Col md={8}>
                  {user?.company?.imageWorkplaceCollection?.length > 0 ? (
                    <Carousel className="workplace-carousel">
                      {user.company.imageWorkplaceCollection.map((img, index) => (
                        <Carousel.Item key={index}>
                          <Image
                            style={{ objectFit: 'contain' }}
                            src={img?.imageUrl}
                            alt={`Workplace image ${index + 1}`}
                            className="workplace-image"
                            thumbnail
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    'Chưa có ảnh môi trường làm việc'
                  )}
                </Col>
              </Row>
              <AuthenticationStatus />
              {user?.company?.companyAuthentication && (
                <>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  <Form.Group className="mb-3">
                    <Form.Label>Cập nhật giấy phép kinh doanh</Form.Label>
                    <br />
                    <a href={user?.company?.companyAuthentication.paper} target='_blank'>Giấy tờ</a>
                    <Form.Control
                      type="file"
                      name="paperFile"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">

                    <Form.Label>Cập nhật mặt trước CMND/CCCD</Form.Label>
                    <br />
                    <a href={user?.company?.companyAuthentication.idCardFront} target='_blank'>CCCD mặt trước</a>
                    <Form.Control
                      type="file"
                      name="idCardFrontFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Cập nhật mặt sau CMND/CCCD</Form.Label>
                    <br />
                    <a href={user?.company?.companyAuthentication.idCardBack} target='_blank'>CCCD mặt sau</a>
                    <Form.Control
                      type="file"
                      name="idCardBackFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    onClick={handleUpdate}
                    disabled={loading || (!formData.paperFile && !formData.idCardFrontFile && !formData.idCardBackFile)}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Cập nhật'}
                  </Button>
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    Xóa chứng thực
                  </Button>
                </>
              )}
            </Card.Body>
          </Col>
        </Row>
      </Card>
      <AddAuthenticationModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default CompanyInfo;