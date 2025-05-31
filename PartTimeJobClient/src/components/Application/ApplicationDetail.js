import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Badge, Row, Col, Alert, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import './applicationDetail.scss';
import { states } from '../../utils/rolesAndStatus';
import { formatDate, formatSalary } from '../../utils/CommonUtils';
import { MyChatBoxContext, MyReceiverContext, MyUserContext } from '../../configs/Contexts';

const ApplicationDetail = () => {
    const { id } = useParams();
    const user = useContext(MyUserContext);
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isOpen, setIsOpen } = useContext(MyChatBoxContext);
    const { receiver, setReceiver } = useContext(MyReceiverContext);


    const handleMessage = async () => {
        try {
            const res = await authApis().get(endpoints['getUserIdFromCandidateId'](application?.candidateId?.id));
            if (res.status === 200) {
                setReceiver(res.data);
                setIsOpen(true);
            }
        } catch (e) {
            console.error('Lỗi khi mở chat:', e);
            toast.error('Không thể mở khung chat!');
        }
    };

    useEffect(() => {
        const loadApplication = async () => {
            setLoading(true);
            try {
                const res = await authApis().get(endpoints['getApplicationDetail'](id));
                if (res.status === 200) {
                    setApplication(res.data.data);
                } else {
                    setError('Không thể tải chi tiết ứng tuyển');
                    toast.error('Không thể tải chi tiết ứng tuyển');
                }
            } catch (error) {
                console.error('Lỗi khi tải chi tiết ứng tuyển:', error);
                setError(error.response?.data?.message || 'Lỗi khi tải chi tiết ứng tuyển');
                toast.error(error.response?.data?.message || 'Lỗi khi tải chi tiết ứng tuyển');
            } finally {
                setLoading(false);
            }
        };
        loadApplication();
    }, [id]);


    useEffect(() => {
        console.log(application);

    }, [application])

    const updateStatus = async (newStatus) => {
        setLoading(true);
        try {
            const res = await authApis().patch(endpoints['updateStatusApplication'], {
                id: parseInt(id),
                status: newStatus,
            });
            if (res.status === 200) {
                setApplication((prev) => ({ ...prev, status: newStatus }));
                toast.success(`Đã ${newStatus === states['application was approved'] ? 'duyệt' : 'từ chối'} ứng tuyển`);
            } else {
                toast.error('Không thể cập nhật trạng thái');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
        } finally {
            setLoading(false);
        }
    };

    const renderStatus = (status) => {
        switch (status) {
            case states['waiting for approving']:
                return <Badge bg="warning">Chờ duyệt</Badge>;
            case states['application was approved']:
                return <Badge bg="success">Đã duyệt</Badge>;
            case states['application was refused']:
                return <Badge bg="danger">Đã từ chối</Badge>;
            default:
                return <Badge bg="secondary">N/A</Badge>;
        }
    };

    const handleBack = () => {
        navigate('/company/applications');
    };

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" /> Đang tải...
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
                <Button variant="primary" onClick={handleBack}>
                    Quay lại
                </Button>
            </Container>
        );
    }

    if (!application) {
        return (
            <Container className="py-5">
                <Alert variant="warning">Không tìm thấy ứng tuyển</Alert>
                <Button variant="primary" onClick={handleBack}>
                    Quay lại
                </Button>
            </Container>
        );
    }

    return (
        <Container className="application-detail-container py-5">

            <h2 className="mb-4 text-center">Thông tin đơn ứng tuyển</h2>

            <Row>

                {/* Cột CV */}
                <Col lg={6} className="mb-4">
                    <Card className="cv-card">
                        <Card.Header>
                            <h5 className="mb-0">Curriculum Vitae</h5>
                        </Card.Header>
                        <Card.Body>
                            <a href={application.curriculumVitae}  target="_blank">Xem tab khác</a>
                            {application.curriculumVitae ? (
                                <iframe
                                    src={application.curriculumVitae}
                                    title="CV"
                                    className="cv-iframe"
                                />
                            ) : (
                                <Alert variant="info" className="text-center">
                                    Không có CV
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Cột thông tin cơ bản */}

                <Col lg={6}>

                    <Card className="info-card">

                        <Card.Body>

                            <h5>Thông tin ứng viên</h5>
                            <Table borderless hover size="sm">
                                <tbody>
                                    <tr>
                                        <td><strong>Họ và tên</strong></td>
                                        <td><span style={{ color: 'red' }}>{application.candidateId?.fullName || 'N/A'}</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email</strong></td>
                                        <td>{application.candidateId.userId.username || 'N/A'}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            <h5>Thông tin công việc</h5>
                            <Table borderless hover size="sm">
                                <tbody>
                                    <tr >
                                        <td><strong>Tên công việc</strong></td>
                                        <td>{application.jobId?.jobName || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Mô tả</strong></td>
                                        <td>{application.jobId?.description || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Ngày đăng</strong></td>
                                        <td>{formatDate(application.jobId?.postedDate) || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Yêu cầu</strong></td>
                                        <td>{application.jobId?.jobRequired || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Mức lương</strong></td>
                                        <td>{formatSalary(application.jobId?.salaryMin, application.jobId?.salaryMax) || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Địa chỉ làm việc</strong></td>
                                        <td>{application.jobId?.fullAddress || 'N/A'}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            <h5>Thông tin ứng tuyển</h5>
                            <Table borderless hover size="sm">
                                <tbody>
                                    <tr>
                                        <td><strong>Ngày ứng tuyển</strong></td>
                                        <td>{formatDate(application.appliedDate) || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Trạng thái</strong></td>
                                        <td>{renderStatus(application.status) || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Lời giới thiệu</strong></td>
                                        <td> <pre style={{
                                            margin: 0,
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word'
                                        }}>
                                            {application.message || 'Không có lời giới thiệu'}
                                        </pre></td>
                                    </tr>
                                </tbody>
                            </Table>

                            {application.status === states['waiting for approving'] && (
                                <div className="action-buttons mt-4 text-center">
                                    <Button
                                        variant="success"
                                        className="me-2"
                                        onClick={() => updateStatus(states['application was approved'])}
                                        disabled={loading}
                                    >
                                        Duyệt
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => updateStatus(states['application was refused'])}
                                        disabled={loading}
                                    >
                                        Từ chối
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                        <Card.Footer className=" text-center">
                            <div className="action-buttons mt-4 text-center">

                                <Button variant="primary" className="me-2" onClick={handleBack}>
                                    Quay lại
                                </Button>
                                <Button
                                    className="me-2"
                                    variant="primary"
                                    onClick={handleMessage}
                                >
                                    Nhắn tin
                                </Button>
                            </div>

                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ApplicationDetail;