import { Link, NavLink } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import './header.scss';
import ChatDropdown from './ChatDropdown';
import { memo, useContext, useEffect, useState } from 'react';
import rolesAndStatus from '../../utils/rolesAndStatus';
import { MyChatBoxContext, MyDispatchContext, MyUserContext } from '../../configs/Contexts';
import cookie from 'react-cookies';
import { authApis, endpoints } from '../../configs/APIs';
import { toast } from 'react-hot-toast';

const Header = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const { setIsOpen } = useContext(MyChatBoxContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  // Hàm lấy thông báo cho ROLE_COMPANY (follower)
  const loadCompanyNotifications = async () => {
    if (!user?.role || user.role !== rolesAndStatus.company || !user?.company?.id) {
      console.warn('Không gọi API thông báo: user không phải ROLE_COMPANY hoặc thiếu companyId');
      return [];
    }

    try {
      const res = await authApis().get(endpoints.followers(user.company.id));
      if (res.status === 200 && res.data?.data) {
        return res.data.data.map(follow => ({
          id: follow.id,
          message: `${follow.candidateId?.fullName || 'Một ứng viên'} đã theo dõi công ty của bạn`,
          timestamp: new Date(follow.followDate).toLocaleString('vi-VN'),
          isRead: false,
          type: 'company_follower',
        }));
      }
      return [];
    } catch (e) {
      console.error('Lỗi khi tải thông báo công ty:', e);
      if (e.response?.status === 404) {
        toast.error('API thông báo không tồn tại, vui lòng kiểm tra backend!');
      } else if (e.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập danh sách người theo dõi!');
      } else {
        toast.error('Không thể tải thông báo công ty!');
      }
      return [];
    }
  };

  // Hàm lấy thông báo cho ROLE_CANDIDATE (công ty đã theo dõi)
  const loadCandidateNotifications = async () => {
    if (!user?.role || user.role !== rolesAndStatus.candidate || !user?.candidate?.id) {
      console.warn('Không gọi API thông báo: user không phải ROLE_CANDIDATE hoặc thiếu candidateId');
      return [];
    }

    try {
      const res = await authApis().get(endpoints.followedCompanies);
      if (res.status === 200 && res.data?.data) {
        return res.data.data.map(follow => ({
          id: follow.id,
          message: `Bạn đã theo dõi công ty ${follow.companyId?.name || 'Không xác định'}`,
          timestamp: new Date(follow.followDate).toLocaleString('vi-VN'),
          isRead: false,
          type: 'candidate_follow',
          companyId: follow.companyId?.id, // Lưu companyId để chuyển hướng
        }));
      }
      return [];
    } catch (e) {
      console.error('Lỗi khi tải thông báo ứng viên:', e);
      if (e.response?.status === 404) {
        toast.error('API thông báo công ty đã theo dõi không tồn tại!');
      } else if (e.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập danh sách công ty đã theo dõi!');
      } else {
        toast.error('Không thể tải thông báo ứng viên!');
      }
      return [];
    }
  };

  // Hàm tải tất cả thông báo
  const loadNotifications = async () => {
    let newNotifications = [];
    if (user?.role === rolesAndStatus.company && user?.company?.id) {
      newNotifications = await loadCompanyNotifications();
    } else if (user?.role === rolesAndStatus.candidate && user?.candidate?.id) {
      newNotifications = await loadCandidateNotifications();
    }

    setNotifications(newNotifications);
    setNotificationCount(newNotifications.filter(n => !n.isRead).length);

    // Lưu vào localStorage
    const storageKey = user?.role === rolesAndStatus.company
      ? `notifications_${user.company.id}`
      : `notifications_candidate_${user.candidate.id}`;
    localStorage.setItem(storageKey, JSON.stringify(newNotifications));
  };

  // Tải thông báo từ localStorage hoặc API
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setNotificationCount(0);
      return;
    }

    const storageKey = user?.role === rolesAndStatus.company
      ? `notifications_${user.company.id}`
      : `notifications_candidate_${user.candidate.id}`;
    const storedNotifications = localStorage.getItem(storageKey);

    if (storedNotifications) {
      const parsed = JSON.parse(storedNotifications);
      setNotifications(parsed);
      setNotificationCount(parsed.filter(n => !n.isRead).length);
    }

    loadNotifications();
  }, [user]);

  // Đánh dấu tất cả thông báo là đã đọc
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
    setNotificationCount(0);

    // Cập nhật localStorage
    const storageKey = user?.role === rolesAndStatus.company
      ? `notifications_${user.company.id}`
      : `notifications_candidate_${user.candidate.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
  };

  // Đánh dấu một thông báo là đã đọc
  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, isRead: true } : notification
    );
    setNotifications(updatedNotifications);
    setNotificationCount(updatedNotifications.filter(n => !n.isRead).length);

    // Cập nhật localStorage
    const storageKey = user?.role === rolesAndStatus.company
      ? `notifications_${user.company.id}`
      : `notifications_candidate_${user.candidate.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
  };

  // Đăng xuất
  const handleLogout = () => {
    dispatch({ type: 'logout' });
    setIsOpen(false);
    setNotifications([]);
    setNotificationCount(0);

    // Xóa localStorage
    const storageKey = user?.role === rolesAndStatus.company
      ? `notifications_${user.company.id}`
      : `notifications_candidate_${user.candidate.id}`;
    localStorage.removeItem(storageKey);
  };

  // Toggle dropdown thông báo
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <Navbar expand="lg" className="header-area" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <img src="/assets/img/logo/logo.png" alt="Logo" className="logo-img" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={NavLink}
              to="/"
              onClick={() => window.scrollTo(0, 0)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Trang chủ
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/jobs"
              onClick={() => window.scrollTo(0, 0)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Việc làm
            </Nav.Link>
            {user?.role === rolesAndStatus.company && (
              <NavDropdown title="Quản lý" id="job-dropdown">
                <NavDropdown.Item as={Link} to="/company/job-form">
                  <i className="far fa-plus-square text-primary me-2" />
                  Tạo tin tuyển dụng
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/company/applications">
                  <i className="far fa-plus-square text-primary me-2" />
                  Danh sách đơn ứng tuyển
                </NavDropdown.Item>
              </NavDropdown>
            )}
            <Nav.Link
              as={NavLink}
              to="/company"
              onClick={() => window.scrollTo(0, 0)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Công ty
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/review"
              onClick={() => window.scrollTo(0, 0)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Xem đánh giá
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {user !== null && (
              <>
                <Nav.Item className="position-relative me-3">
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={toggleDropdown}
                  >
                    <i className="bi bi-bell" style={{ fontSize: 24 }}></i>
                    {notificationCount > 0 && (
                      <span
                        className="notification-badge"
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          background: 'red',
                          color: 'white',
                          borderRadius: '50%',
                          fontSize: 12,
                          width: 18,
                          height: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                  {showDropdown && (
                    <div
                      className="notification-dropdown shadow rounded bg-white position-absolute"
                      style={{ right: 0, zIndex: 1000, width: 300 }}
                    >
                      <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                        <strong>Thông báo</strong>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={markAllAsRead}
                          disabled={notificationCount === 0}
                        >
                          Đánh dấu đã đọc
                        </Button>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="text-center p-2">Không có thông báo</div>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-2 border-bottom ${
                              notification.isRead ? 'text-muted' : 'font-weight-bold'
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              if (notification.type === 'candidate_follow' && notification.companyId) {
                                markAsRead(notification.id);
                                window.location.href = `/company/${notification.companyId}`;
                              }
                            }}
                          >
                            <div>{notification.message}</div>
                            <small className="text-muted">{notification.timestamp}</small>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </Nav.Item>
                <ChatDropdown />
              </>
            )}
            {user !== null ? (
              <NavDropdown
                title={
                  <div className="box-header-profile">
                    {user?.role === rolesAndStatus.company && (
                      <>
                        <img
                          src={user.company?.avatar}
                          alt="profile"
                          className="profile-img"
                        />
                        <span className="header-name-user">
                          {user.company?.fullName}
                        </span>
                      </>
                    )}
                    {user?.role === rolesAndStatus.candidate && (
                      <>
                        <span className="header-name-user">
                          {user.candidate?.fullName}
                        </span>
                        <img
                          src={user.candidate?.avatar}
                          alt="profile"
                          className="profile-img"
                        />
                      </>
                    )}
                  </div>
                }
                id="profileDropdown"
              >
                {user?.role === rolesAndStatus.candidate && (
                  <>
                    <NavDropdown.Item as={Link} to="/candidate/profile">
                      <i className="far fa-user text-primary me-2" />
                      Thông tin
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/candidate/profile/applications/">
                      <i className="far fa-file-word text-primary me-2" />
                      Công việc đã nộp
                    </NavDropdown.Item>
                  </>
                )}
                {user?.role === rolesAndStatus.company && (
                  <>
                    <NavDropdown.Item as={Link} to="/company/profile">
                      <i className="far fa-user text-primary me-2" />
                      Thông tin
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/company/applications">
                      <i className="far fa-file-word text-primary me-2" />
                      Xem các đơn ứng tuyển
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/company/profile/job-list">
                      <i className="" />
                      Bài tuyển dụng
                    </NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Item
                  as={NavLink}
                  to="/login"
                  onClick={handleLogout}
                >
                  <i className="ti-power-off text-primary me-2" />
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/register" className="btn head-btn1">
                  Đăng kí
                </Nav.Link>
                <NavLink as={Link} to="/login" className="btn head-btn2">
                  Đăng nhập
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default memo(Header);