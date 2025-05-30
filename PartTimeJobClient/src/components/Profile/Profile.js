import React, { useContext, useEffect, useState } from 'react';
import { Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './profile.scss';
import { MyUserContext } from '../../configs/Contexts';
import { authApis, endpoints } from '../../configs/APIs';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const user = useContext(MyUserContext);
  // eslint-disable-next-line no-unused-vars
  const [jobs, setJobs] = useState();
  // eslint-disable-next-line no-unused-vars
  const [applications, setApplications] = useState();
  const [followedCompanies, setFollowedCompanies] = useState([]);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [unfollowLoading, setUnfollowLoading] = useState({}); // Thêm state để quản lý trạng thái unfollow cho từng công ty
  const navigate = useNavigate();

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    console.log(followedCompanies);

  }, [])

  // Load danh sách ứng tuyển
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const res = await authApis().get(endpoints['getApplications']);
        const applications = res.data.data.applications || {};
        setApplications(applications);
      } catch (e) {
        console.error('Lỗi khi tải danh sách ứng tuyển:', e);
        toast.error('Không thể tải danh sách ứng tuyển!');
      }
    };
    loadApplications();
  }, []);

  // Load danh sách công ty đã theo dõi
  const loadFollowedCompanies = async () => {
    setLoadingFollowed(true);
    try {
      const res = await authApis().get(endpoints['followedCompanies']);
      if (res.status === 200) {
        setFollowedCompanies(res.data.data);
      } else {
        toast.error('Không thể tải danh sách công ty đã theo dõi');
      }
    } catch (e) {
      console.error('Lỗi khi tải danh sách công ty đã theo dõi:', e);
      toast.error('Có lỗi xảy ra khi tải danh sách công ty đã theo dõi');
    } finally {
      setLoadingFollowed(false);
    }
  };

  useEffect(() => {
    if (user?.candidate?.id) {
      loadFollowedCompanies();
    }
  }, [user]);

  // Xử lý bỏ theo dõi công ty
  const handleUnfollow = async (companyId) => {
    setUnfollowLoading((prev) => ({ ...prev, [companyId]: true }));
    try {
      const res = await authApis().delete(endpoints.unfollowCompany(companyId));
      if (res.status === 200) {
        setFollowedCompanies(followedCompanies.filter(fc => fc.companyId.id !== companyId));
        toast.success('Bỏ theo dõi công ty thành công!');
      }
    } catch (e) {
      console.error('Lỗi khi bỏ theo dõi:', e);
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setUnfollowLoading((prev) => ({ ...prev, [companyId]: false }));
    }
  };

  const handleViewApplications = () => {
    navigate('/candidate/profile/applications');
  };

  const handleViewCompany = (companyId) => {
    navigate(`/detail-company/${companyId}`);
  };

  const handleUpdate = () => {
    navigate('/candidate/profile/update');
  };

  return (
    <div className="profile-container">
      <Card className="profile-card shadow-sm">
        <Row className="g-0">
          <Col md={4} className="profile-image-section">
            <img
              src={user?.candidate?.avatar || '/assets/img/default-avatar.jpg'}
              alt={`${user?.candidate?.fullName || 'Người dùng'}'s avatar`}
              className="profile-avatar"
            />
            <h3 className="profile-username">{user?.username || 'Chưa cập nhật'}</h3>
            <Button
              variant="primary"
              className="mt-4 profile-applications-button"
              onClick={handleViewApplications}
            >
              Xem ứng tuyển
            </Button>
            <Button
              variant="primary"
              className="mt-2 profile-applications-button"
              onClick={handleUpdate}
            >
              Cập nhật hồ sơ
            </Button>
          </Col>

          <Col md={8} className="profile-details-section">
            <Card.Body>
              <h2 className="profile-fullname">{user?.candidate?.fullName || 'Chưa nhận'}</h2>
              <hr className="profile-divider" />
              <Row className="profile-info-row mb-4">
                <Col md={4} className="profile-label">Email:</Col>
                <Col md={8}>{user?.username || 'Chưa cập nhật'}</Col>
              </Row>
              <Row className="profile-info-row mb-4">
                <Col md={4} className="profile-label">Số điện thoại:</Col>
                <Col md={8}>{user?.candidate?.phone || 'Chưa cập nhật'}</Col>
              </Row>
              <Row className="profile-info-row mb-4">
                <Col md={4} className="profile-label">Ngày sinh:</Col>
                <Col md={8}>{user?.candidate?.dateOfBirth ? formatDate(user?.data?.candidate?.dateOfBirth) : 'Chưa cập nhật'}</Col>
              </Row>
              <Row className="profile-info-row mb-4">
                <Col md={4} className="profile-label">Thành phố:</Col>
                <Col md={8}>{user?.candidate?.city || 'Chưa cập nhật'}</Col>
              </Row>
              <Row className="profile-info-row mb-4">
                <Col md={4} className="profile-label">CV:</Col>
                <Col md={8}>
                  {user?.data?.candidate?.curriculumVitae ? (
                    <a href={user?.candidate?.curriculumVitae} target="_blank" rel="noopener noreferrer" className="profile-link">
                      Xem CV
                    </a>
                  ) : 'Chưa cập nhật'}
                </Col>
              </Row>
              <Row className="profile-info-row mb-4">
                <Col md={4} className="profile-label">Mô tả bản thân:</Col>
                <Col md={8}>{user?.data?.candidate?.selfDescription || 'Chưa cập nhật'}</Col>
              </Row>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      <div className="followed-companies-section mt-5">
        <h2 className="section-title">Danh sách công ty đã theo dõi</h2>
        {loadingFollowed ? (
          <div className="text-center">
            <Spinner animation="border" size="sm" /> Đang tải danh sách...
          </div>
        ) : followedCompanies.length === 0 ? (
          <p className="text-muted">Bạn chưa theo dõi công ty nào.</p>
        ) : (
          <Row>
            {followedCompanies.map((follow) => (
              <Col key={follow.companyId.id} md={4} className="mb-4">
                <Card className="company-card shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={follow.companyId.avatar || '/assets/img/default-company.jpg'}
                        alt={`Logo ${follow.companyId.name}`}
                        className="company-logo me-3"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                      />
                      <h5 className="mb-0">{follow.companyId.name}</h5>
                    </div>
                    <p className="text-muted">{`${follow.companyId.fullAddress || ''}, ${follow.companyId.district || ''}, ${follow.companyId.city || ''}`}</p>
                    <div className="d-flex gap-2">
                      <Button
                        variant="primary"
                        onClick={() => handleViewCompany(follow.companyId.id)}
                        className="rounded-pill"
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleUnfollow(follow.companyId.id)}
                        className="rounded-pill"
                        disabled={unfollowLoading[follow.companyId.id]}
                      >
                        {unfollowLoading[follow.companyId.id] ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          'Bỏ theo dõi'
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Profile;