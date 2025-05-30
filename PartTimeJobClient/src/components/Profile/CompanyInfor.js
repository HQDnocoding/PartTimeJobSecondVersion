import React, { useContext } from 'react';
import { Card, Row, Col, Image, Badge, Button, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MyUserContext } from '../../configs/Contexts';
import './profile.scss';

const CompanyInfo = () => {
  const  user  = useContext(MyUserContext);
  const navigate = useNavigate();

  const handleViewJobs = () => {
    navigate('/company/profile/job-list');
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
                          style={{objectFit:'contain'}}
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
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CompanyInfo;