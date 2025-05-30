import { Link, NavLink } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import './header.scss';
import ChatDropdown from './ChatDropdown';
import { memo, useContext, useEffect, useState } from 'react';
import rolesAndStatus from '../../utils/rolesAndStatus';
import { MyChatBoxContext, MyDispatchContext, MyUserContext } from '../../configs/Contexts';
import cookie from 'react-cookies';


const Header = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const { setIsOpen } = useContext(MyChatBoxContext);

    const [showDropdown, setShowDropdown] = useState(false); // Trạng thái để toggle dropdown

    const handleLogout = () => {
        dispatch({ type: "logout" });
        // cookie.remove('token');
        setIsOpen(false);
        // window.localStorage.clear();
    };

    useEffect(() => {
        console.log(user?.role);
        console.log(user);

    }, [user])

    // Hàm toggle dropdown thông báo
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
                                        <span
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
                                            0
                                        </span>
                                    </Button>
                                    {showDropdown && (
                                        <div
                                            className="notification-dropdown shadow rounded bg-white position-absolute"
                                            style={{ right: 0, zIndex: 1000, width: 300 }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                                                <strong>Thông báo</strong>
                                                <Button variant="link" size="sm" onClick={() => { }}>
                                                    Đánh dấu đã đọc
                                                </Button>
                                            </div>
                                            <div className="text-center p-2">Không có thông báo</div>
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