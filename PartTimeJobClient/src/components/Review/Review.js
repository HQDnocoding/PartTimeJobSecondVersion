import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Pagination } from 'react-bootstrap';
import { authApis, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/Contexts';
import { toast } from 'react-hot-toast';
import rolesAndStatus from '../../utils/rolesAndStatus';
import ReviewFilter from './ReviewFilter';

const Review = () => {
  const user = useContext(MyUserContext);
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 6,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    candidateName: '',
    jobName: '',
    companyName: '',
  });

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        if (!user) {
          toast.error('Vui lòng đăng nhập để xem đánh giá');
          return;
        }

        if (user.role !== rolesAndStatus.company) {
          toast.error('Chỉ công ty mới có quyền xem đánh giá ứng viên');
          return;
        }

        // Lấy companyId từ user
        const companyRes = await authApis().get(endpoints['getCompanyByUserId'](user.id));
        if (companyRes.status !== 200) {
          throw new Error('Không thể lấy thông tin công ty');
        }
        const companyId = companyRes.data.id;

        // Gọi API mới với bộ lọc
        const params = new URLSearchParams({
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          candidateName: filters.candidateName,
          jobName: filters.jobName,
          companyName: filters.companyName,
        }).toString();

        const res = await authApis().get(`${endpoints['getCandidateReviewsByCompany'](companyId)}?${params}`);
        if (res.status === 200) {
          setReviews(res.data.reviews || []);
          setPagination((prev) => ({
            ...prev,
            totalItems: res.data.totalItems || 0,
            totalPages: res.data.totalPages || 1,
          }));
        } else {
          throw new Error('Không thể lấy danh sách đánh giá');
        }
      } catch (error) {
        console.error('Lỗi khi tải đánh giá:', error);
        toast.error(error.message || 'Lỗi khi tải đánh giá');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadReviews();
    }
  }, [user, pagination.currentPage, filters]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
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
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="review-page container my-5">
      <h1 className="page-title mb-4">Đánh giá về ứng viên</h1>

      <ReviewFilter onFilterChange={setFilters} />

      <Card className="reviews-card shadow-sm">
        <Card.Body>
          <Table responsive hover className="reviews-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ứng viên</th>
                <th>Công việc</th>
                <th>Công ty đánh giá</th>
                <th>Điểm đánh giá</th>
                <th>Nhận xét</th>
                <th>Ngày đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <tr key={review.id || index}>
                    <td>{(pagination.currentPage - 1) * pagination.pageSize + index + 1}</td>
                    <td>{review.candidateId?.fullName || 'N/A'}</td>
                    <td>{review.jobId?.jobName || 'N/A'}</td>
                    <td>{review.companyId?.companyName || 'N/A'}</td>
                    <td>{review.rating ? `${review.rating}/5` : 'N/A'}</td>
                    <td>{review.review || 'N/A'}</td>
                    <td>{formatDate(review.reviewDate)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    Chưa có đánh giá nào.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {pagination.totalPages > 1 && (
            <div className="reviews-pagination-wrapper">
              <div className="pagination-info">
                Hiển thị {(pagination.currentPage - 1) * pagination.pageSize + 1} -{' '}
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} /{' '}
                {pagination.totalItems} đánh giá
              </div>
              <Pagination className="reviews-pagination justify-content-center">
                {getPaginationItems()}
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Review;