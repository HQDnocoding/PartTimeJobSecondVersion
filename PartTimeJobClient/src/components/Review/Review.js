import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Pagination } from 'react-bootstrap';
import { authApis } from '../../configs/APIs';
import { MyUserContext } from '../../configs/Contexts';
import { toast } from 'react-hot-toast';
import rolesAndStatus from '../../utils/rolesAndStatus';

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

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
        }).toString();
        
        const endpoint = user?.role === rolesAndStatus.candidate 
          ? `/secure/reviews/candidate` // Lấy đánh giá về công ty
          : `/secure/reviews/company`; // Lấy đánh giá về ứng viên

        const res = await authApis().get(`${endpoint}?${params}`);
        if (res.status === 200) {
          const responseData = res.data.data || {};
          setReviews(responseData.reviews || []);
          setPagination({
            currentPage: responseData.currentPage || 1,
            totalPages: responseData.totalPages || 1,
            pageSize: responseData.pageSize || 6,
            totalItems: responseData.totalItems || 0,
          });
        } else {
          toast.error('Không thể tải danh sách đánh giá');
        }
      } catch (error) {
        console.error('Lỗi khi tải đánh giá:', error);
        toast.error('Lỗi khi tải đánh giá');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadReviews();
    }
  }, [user, pagination.currentPage]);

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
    });
  };

  return (
    <div className="review-page container my-5">
      <h1 className="page-title mb-4">
        {user?.role === rolesAndStatus.candidate ? 'Đánh giá công ty' : 'Đánh giá ứng viên'}
      </h1>

      <Card className="reviews-card shadow-sm">
        <Card.Body>
          <Table responsive hover className="reviews-table">
            <thead>
              <tr>
                <th>#</th>
                {user?.role === rolesAndStatus.candidate ? (
                  <>
                    <th>Công ty</th>
                    <th>Công việc</th>
                  </>
                ) : (
                  <>
                    <th>Ứng viên</th>
                    <th>Công việc</th>
                  </>
                )}
                <th>Điểm đánh giá</th>
                <th>Nhận xét</th>
                <th>Ngày đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={user?.role === rolesAndStatus.candidate ? 6 : 6} className="text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <tr key={review.id}>
                    <td>{(pagination.currentPage - 1) * pagination.pageSize + index + 1}</td>
                    {user?.role === rolesAndStatus.candidate ? (
                      <>
                        <td>{review.company?.name}</td>
                        <td>{review.job?.jobName}</td>
                      </>
                    ) : (
                      <>
                        <td>{review.candidate?.fullName}</td>
                        <td>{review.job?.jobName}</td>
                      </>
                    )}
                    <td>{review.rating}/5</td>
                    <td>{review.comment}</td>
                    <td>{formatDate(review.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={user?.role === rolesAndStatus.candidate ? 6 : 6} className="text-center">
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