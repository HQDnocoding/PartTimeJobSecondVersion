import React, { useContext } from 'react';
import { Row, Col, Image, Badge } from 'react-bootstrap';
import { MyUserContext } from '../../configs/Contexts';
import { states } from '../../utils/rolesAndStatus';

const AuthenticationStatus = () => {
    const user = useContext(MyUserContext);
    const authentication = user?.company?.companyAuthentication;

    return (
        <Row className="profile-info-row mb-4">
            <Col md={4} className="profile-label">Trạng thái chứng thực:</Col>
            <Col md={8}>
                {authentication ? (
                    <>
                        <Badge
                            bg={
                                authentication.status === states['application was approved']
                                    ? 'success'
                                    : authentication.status === states['waiting for approving']
                                        ? 'warning'
                                        : 'danger'
                            }
                        >
                            {authentication.status === states['application was approved']
                                ? 'Đã duyệt'
                                : authentication.status === states['waiting for approving']
                                    ? 'Đang chờ duyệt'
                                    : 'Từ chối'}
                        </Badge>
                        {authentication.feedback && (
                            <div className="mt-2 text-muted">Phản hồi: {authentication.feedback}</div>
                        )}

                    </>
                ) : (
                    <div>Chưa có thông tin chứng thực</div>
                )}
            </Col>
        </Row>
    );
};

export default AuthenticationStatus;