import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Table, Card, Row, Col, Alert, Pagination } from 'react-bootstrap';
import { MyUserContext } from '../../configs/Contexts';
import { authApis, endpoints } from '../../configs/APIs';
import './JobWatchList.scss';
import { states } from '../../utils/rolesAndStatus';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';


const JobWatchList = () => {
    const user = useContext(MyUserContext);
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        status: '',
        keyword: '',
        sort: 'desc',
        page: 1,
    });
    const [changePage, setChangePage] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        pageSize: 5,
        totalItems: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const nav = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (changePage) {
            fetchJobs();
        }
    }, [changePage])

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApis().get(endpoints['companyJobs'], {
                params: {
                    status: filters.status,
                    keyword: filters.keyword,
                    sort: filters.sort,
                    page: filters.page,
                },
            });

            const data = response.data.data;
            setJobs(data.jobs || []);
            setPagination({
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                pageSize: data.pageSize,
                totalItems: data.totalItems,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy danh sách công việc.');
            console.error('Fetch jobs error:', err);
        } finally {
            setLoading(false);
            setChangePage(false);
        }
    };


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value, page: 1 });
    };

    const handlePageChange = (page) => {
        setFilters({ ...filters, page });
        setChangePage(true);
    };

    const handleDelete = (jobId) => {
        const deleteJob = async (id) => {
            try {
                setLoading(true);
                const url = `${endpoints['deleteJob'](id)}?username=${user.username}`;
                const res = await authApis().delete(url, {
                    headers: { 'Content-Type': 'application/json' },
                });


                if (res.status === 200) toast.success("Xóa thành công");
                else toast.error("Thất bại")

            } catch (e) {
                console.log(e.message);

            } finally {
                fetchJobs();
                setLoading(false);
            }
        }
        const isConfirmed = window.confirm(`Bạn có muốn xóa bài tuyển dụng cho công việc này không ?`)
        if (isConfirmed) {
            deleteJob(jobId);
        }
    }

    const renderPagination = () => {
        const items = [];
        for (let i = 1; i <= pagination.totalPages; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === pagination.currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }
        return items;
    };

    return (
        <div className="company-jobs-container">
            <Card className="jobs-card shadow-sm">
                <Card.Body>
                    <h2 className="text-center mb-4">Danh sách công việc của công ty</h2>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form>
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Group controlId="status">
                                    <Form.Label>Trạng thái</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Tất cả</option>
                                        <option value={states['waiting for approving']}>Chờ duyệt</option>
                                        <option value={states['application was approved']}>Đã duyệt</option>
                                        <option value={states['application was refused']}>Đã từ chối</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="keyword">
                                    <Form.Label>Tên công việc</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="keyword"
                                        value={filters.keyword}
                                        onChange={handleFilterChange}
                                        placeholder="Nhập tên công việc"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="sort">
                                    <Form.Label>Sắp xếp theo ngày đăng</Form.Label>
                                    <Form.Select
                                        name="sort"
                                        value={filters.sort}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="desc">Mới nhất</option>
                                        <option value="asc">Cũ nhất</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button
                            variant="primary"
                            onClick={fetchJobs}
                            disabled={loading}
                            className="mb-3"
                        >
                            {loading ? 'Đang tải...' : 'Tìm kiếm'}
                        </Button>
                    </Form>

                    {jobs.length > 0 ? (
                        <>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên công việc</th>
                                        <th>Mô tả</th>
                                        <th>Địa điểm</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày đăng</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job.id} >
                                            <td>{job.id}</td>
                                            <td style={{ backgroundColor: 'gainsboro' }} onClick={() => { nav(`/detail-job/${job.id}`) }}>{job.jobName}</td>
                                            <td>
                                                {job.description.length > 100
                                                    ? job.description.substring(0, 100) + '...'
                                                    : job.description}
                                            </td>

                                            <td>
                                                {job.district}, {job.city}
                                            </td>
                                            <td>
                                                {job.status === states['waiting for approving'] ? 'Chờ duyệt' : job.status === states['application was approved'] ? 'Đã duyệt' : 'Bị từ chối'}
                                            </td>
                                            <td>
                                                {new Date(job.postedDate).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td>
                                                <Button className='btn btn-danger' onClick={() => { handleDelete(job.id) }}>
                                                    Xóa
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <Pagination className="justify-content-center">
                                <Pagination.First
                                    onClick={() => handlePageChange(1)}
                                    disabled={pagination.currentPage === 1}
                                />
                                <Pagination.Prev
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                />
                                {renderPagination()}
                                <Pagination.Next
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                />
                                <Pagination.Last
                                    onClick={() => handlePageChange(pagination.totalPages)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                />
                            </Pagination>
                        </>
                    ) : (
                        <Alert variant="info">Không có bài đăng tuyển nào.</Alert>
                    )}
                </Card.Body>
            </Card>
        </div >
    );
}

export default JobWatchList;