import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Pagination, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './applicationsList.scss';
import { toast } from 'react-toastify';
import { authApis, endpoints } from '../../configs/APIs';
import roles, { states } from '../../utils/rolesAndStatus';
import { MyUserContext } from '../../configs/Contexts';

const ApplicationsWatchList = () => {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 6,
    totalItems: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
  });
  const [sortBy, setSortBy] = useState('appliedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useContext(MyUserContext);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const appParams = new URLSearchParams({
          status: filters.status,
          sortBy,
          sortOrder,
          page: pagination.currentPage,
        }).toString();
        const appRes = await authApis().get(`${endpoints['getApplications']}?${appParams}`);
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
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        toast.error(error.response?.data?.message || 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters, sortBy, sortOrder, pagination.currentPage]);

  useEffect(() => {
    console.log('Applications:', applications);
    console.log('User:', user);
  }, [applications, user]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, pagination.currentPage - halfVisible);
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    items.push(
      <Pagination.First
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={pagination.currentPage === 1}
      />
    );
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1}
      />
    );

    if (startPage > 1) {
      items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === pagination.currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (endPage < pagination.totalPages) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    }

    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.totalPages}
      />
    );
    items.push(
      <Pagination.Last
        key="last"
        onClick={() => handlePageChange(pagination.totalPages)}
        disabled={pagination.currentPage === pagination.totalPages}
      />
    );

    return items;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split('|');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleReview = async (app) => {
    if (app && app.status === states['application was approved'] && user?.role === roles.candidate) {
      try {
        // Kiểm tra trạng thái ứng tuyển
        const response = await authApis().get(`/secure/applications/${app.id}`);
        console.log("ok",response.data.dat)
        if (response.data.data.status !== states['application was approved']) {
          toast.error('Ứng tuyển chưa được phê duyệt.');
          return;
        }

        // Lưu dữ liệu vào localStorage
        localStorage.setItem(
          'reviewData',
          JSON.stringify({
            applicationId: app.id,
            candidateId: app.candidateId.id,
            companyId: app.jobId.companyId.id,
            jobId: app.jobId.id, // Thêm jobId
          })
        );
        navigate(`/detail-job/${app.jobId.id}`);
      } catch (error) {
        console.error('Lỗi khi kiểm tra ứng tuyển:', error);
        toast.error('Không thể xác minh trạng thái ứng tuyển.');
      }
    } else {
      toast.error('Bạn không có quyền đánh giá hoặc đơn ứng tuyển chưa được duyệt.');
    }
  };

  return (
    <div className="applications-page">
      <h1 className="page-title">Danh sách ứng tuyển</h1>

      <Card className="filter-card shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả</option>
                  <option value={states['application was approved']}>Được duyệt</option>
                  <option value={states['waiting for approving']}>Đang chờ phản hồi</option>
                  <option value={states['application was refused']}>Bị từ chối</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Sắp xếp</Form.Label>
                <Form.Select value={`${sortBy}|${sortOrder}`} onChange={handleSortChange}>
                  <option value="appliedDate|desc">Ngày ứng tuyển (Mới nhất)</option>
                  <option value="appliedDate|asc">Ngày ứng tuyển (Cũ nhất)</option>
                  <option value="jobId.jobName|asc">Tên công việc (A-Z)</option>
                  <option value="jobId.jobName|desc">Tên công việc (Z-A)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="applications-card shadow-sm">
        <Card.Body>
          <Table responsive hover className="applications-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Công việc</th>
                <th>Công ty</th>
                <th>Địa điểm</th>
                <th>Ngày ứng tuyển</th>
                <th>Trạng thái</th>
                <th>CV</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : applications.length > 0 ? (
                applications.map((app, index) => (
                  <tr key={app.id}>
                    <td>{(pagination.currentPage - 1) * pagination.pageSize + index + 1}</td>
                    <td>{app.jobId.jobName}</td>
                    <td>{app.jobId.companyId.name}</td>
                    <td>{`${app.jobId.city}, ${app.jobId.district}`}</td>
                    <td>{formatDate(app.appliedDate)}</td>
                    <td>
                      <Badge
                        bg={app.status === 'approved' ? 'success' : app.status === 'refused' ? 'danger' : 'warning'}
                        className="applications-status"
                      >
                        {app.status === 'approved' ? 'Được duyệt' : app.status === 'refused' ? 'Bị từ chối' : 'Đang chờ'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        href={app.curriculumVitae}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="applications-cv-button"
                      >
                        Xem CV
                      </Button>
                    </td>
                    <td>
                      {app.status === states['application was approved'] && user?.role === roles.candidate && (
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleReview(app)}
                        >
                          Đánh giá công ty
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    Không có ứng tuyển nào.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {pagination.totalPages > 1 && (
            <div className="applications-pagination-wrapper">
              <div className="pagination-info">
                Hiển thị {(pagination.currentPage - 1) * pagination.pageSize + 1} -{' '}
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} /{' '}
                {pagination.totalItems} ứng tuyển
              </div>
              <Pagination className="applications-pagination justify-content-center">
                {getPaginationItems()}
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ApplicationsWatchList;