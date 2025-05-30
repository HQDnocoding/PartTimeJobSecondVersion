import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Table, Button, Card, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './applicationList.scss';
import ApplicationFilter from './ApplicationFilter';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import { MyChatBoxContext, MyReceiverContext, MyUserContext } from '../../configs/Contexts';
import { states } from '../../utils/rolesAndStatus';
import { formatDate } from '../../utils/CommonUtils';


const ApplicationList = () => {
    const { isOpen, setIsOpen } = useContext(MyChatBoxContext);
    const { receiver, setReceiver } = useContext(MyReceiverContext);
    const user = useContext(MyUserContext);
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        jobId: '',
    });
    const [sortBy, setSortBy] = useState('appliedDate');
    const [sortOrder, setSortOrder] = useState('desc');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        pageSize: 6,
        totalItems: 0,
    });

    useEffect(() => {
        console.log(applications);

    }, [applications])

    const handleMessage = async (application) => {
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
        const loadData = async () => {
            setLoading(true);
            try {
                const appParams = new URLSearchParams({
                    status: filters.status,
                    jobId: filters.jobId,
                    sortBy,
                    sortOrder,
                    page: pagination.currentPage,
                });
                const appRes = await authApis().get(`${endpoints['getApplications']}?${appParams.toString()}`);
                if (appRes.status === 200) {
                    const responseData = appRes.data.data || {};
                    setApplications(responseData.applications || []);
                    setPagination({
                        currentPage: responseData.currentPage || 1,
                        totalPages: responseData.totalPages || 1,
                        pageSize: responseData.pageSize || 6,
                        totalItems: responseData.totalItems || 0,
                    });
                } else {
                    toast.error('Không thể tải danh sách ứng tuyển');
                }

                const jobRes = await authApis().get(endpoints['companyGetJob']);
                if (jobRes.status === 200) {
                    setJobs(jobRes.data.data || []);
                } else {
                    toast.error('Không thể tải danh sách công việc');
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
                toast.error(error.response?.data?.message || 'Lỗi khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [filters, sortBy, sortOrder, pagination.currentPage]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to page 1 on filter change
    };

    // Handle sort change
    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
        setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to page 1 on sort change
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
        }
    };

    // Update application status
    const updateStatus = async (applicationId, newStatus) => {
        setLoading(true);
        try {
            const res = await authApis().patch(endpoints['updateStatusApplication'],
                {
                    id: applicationId,
                    status: newStatus
                });
            if (res.status === 200) {
                setApplications((prev) =>
                    prev.map((app) =>
                        app.id === applicationId ? { ...app, status: newStatus } : app
                    )
                );
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

    // Navigate to application detail
    const viewDetail = (applicationId) => {
        navigate(`/company/applications/${applicationId}`);
    };


    // Render status badge
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

    return (
        <Container className="application-list-container py-5">
            <h2 className="mb-4 text-center">Danh sách ứng tuyển</h2>

            <ApplicationFilter
                jobs={jobs}
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" /> Đang tải...
                </div>
            ) : applications.length === 0 ? (
                <Card className="text-center p-4">
                    <Card.Body>Không có ứng tuyển nào phù hợp với bộ lọc</Card.Body>
                </Card>
            ) : (
                <>
                    <Table striped bordered hover responsive className="application-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>
                                    Ứng viên
                                </th>
                                <th onClick={() => handleSortChange('jobId.jobName')}>
                                    Công việc {sortBy === 'jobId.jobName' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSortChange('appliedDate')}>
                                    Ngày nộp {sortBy === 'appliedDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSortChange('status')}>
                                    Trạng thái {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app.id} onClick={() => viewDetail(app.id)} className="application-row">
                                    <td>{app.id}</td>
                                    <td>{app.candidateId?.fullName || 'N/A'}</td> {/* Adjusted to match backend field */}
                                    <td>{app.jobId?.jobName || 'N/A'}</td>
                                    <td>{formatDate(app.appliedDate)}</td>
                                    <td>{renderStatus(app.status)}</td>
                                    <td>
                                        {app.status === states['waiting for approving'] && (
                                            <>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus(app.id, states['application was approved']);
                                                    }}
                                                    disabled={loading}
                                                    className="me-2"
                                                >
                                                    Duyệt
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus(app.id, states['application was refused']);
                                                    }}
                                                    disabled={loading}
                                                >
                                                    Từ chối
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                         variant="warning"
                                            size="sm"
                                            style={{marginLeft:5}}
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                handleMessage(app);
                                            }}
                                        >
                                            Nhắn tin
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-center mt-4">
                        <Button
                            variant="outline-primary"
                            disabled={pagination.currentPage === 1}
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            className="me-2"
                        >
                            Trước
                        </Button>
                        <span className="align-self-center">
                            Trang {pagination.currentPage} / {pagination.totalPages}
                        </span>
                        <Button
                            variant="outline-primary"
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            className="ms-2"
                        >
                            Sau
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
};

export default ApplicationList;