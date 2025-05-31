import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Form, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { authApis, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/Contexts';
import { states } from '../../utils/rolesAndStatus';
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';

const CompanyReview = ({ companyId }) => {
  const user = useContext(MyUserContext);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 1, review: '', jobId: null, companyId: parseInt(companyId, 10) });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [candidateId, setCandidateId] = useState(null);

  const fetchCandidateId = useCallback(async () => {
    try {
      const res = await authApis().get(endpoints.infor);
      const candidateId = res.data.candidate?.id || null;
      setCandidateId(candidateId);
      console.log('Fetched candidateId:', candidateId);
    } catch (error) {
      console.error('Lỗi lấy candidateId:', error);
      toast.error('Không thể lấy thông tin ứng viên!');
    }
  }, []);

  const checkCanReview = useCallback(async () => {
    if (!cookie.load('token') || !user?.id || !candidateId) {
      setCanReview(false);
      console.log('Cannot review: Missing token, user ID, or candidateId');
      return;
    }

    if (user?.role !== 'ROLE_CANDIDATE') {
      setCanReview(false);
      console.log('Cannot review: User role is not ROLE_CANDIDATE');
      return;
    }

    try {
      const res = await authApis().get(endpoints.getApplications);
      const applications = res.data?.data?.applications || [];
      console.log('Applications for review check:', JSON.stringify(applications, null, 2));
      console.log('Checking for companyId:', companyId);

      const approvedApp = applications.find((app) => {
        const appCandidateId = typeof app.candidateId === 'object' ? app.candidateId?.id : app.candidateId;
        const companyMatch = app.jobId?.companyId?.id === parseInt(companyId, 10);
        const statusMatch = app.status.toLowerCase() === states['application was approved'].toLowerCase();
        const candidateMatch = appCandidateId === candidateId;
        const jobIdExists = !!app.jobId?.id;
        console.log(`App ${app.id}: CompanyMatch=${companyMatch}, StatusMatch=${statusMatch}, CandidateMatch=${candidateMatch}, JobIdExists=${jobIdExists}`);
        return companyMatch && statusMatch && candidateMatch && jobIdExists;
      });

      if (approvedApp) {
        setCanReview(true);
        setNewReview((prev) => ({ ...prev, jobId: approvedApp.jobId?.id }));
        console.log('Can review: Found approved application:', approvedApp);
      } else {
        setCanReview(false);
        setNewReview((prev) => ({ ...prev, jobId: null }));
        console.log('Cannot review: No approved application found for this company');
      }
    } catch (error) {
      console.error('Lỗi kiểm tra đơn ứng tuyển:', error);
      toast.error('Không thể kiểm tra quyền đánh giá!');
      setCanReview(false);
    }
  }, [companyId, user, candidateId]);

  const loadReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const [reviewsRes, avgRes] = await Promise.all([
        authApis().get(endpoints.getCompanyReviews(companyId)),
        authApis().get(endpoints.getCompanyAverageRating(companyId)),
      ]);
      setReviews(reviewsRes.data?.reviews || []);
      setAverageRating(avgRes.data || 0);
    } catch (error) {
      console.error('Lỗi tải đánh giá:', error);
      toast.error('Không thể tải đánh giá!');
    } finally {
      setLoadingReviews(false);
    }
  }, [companyId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!cookie.load('token') || !user?.id || !candidateId) {
      toast.error('Vui lòng đăng nhập để đánh giá công ty!');
      navigate('/login');
      return;
    }

    if (user?.role !== 'ROLE_CANDIDATE') {
      toast.error('Chỉ ứng viên mới có thể đánh giá công ty!');
      return;
    }

    if (!newReview.jobId) {
      toast.error('Không tìm thấy công việc hợp lệ để đánh giá!');
      return;
    }

    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      toast.error('Điểm đánh giá phải từ 1 đến 5!');
      return;
    }

    if (!newReview.review || newReview.review.length > 200) {
      toast.error('Nội dung đánh giá không hợp lệ (tối đa 200 ký tự)!');
      return;
    }

    if (!newReview.companyId) {
      toast.error('Company ID không hợp lệ!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        companyId: newReview.companyId,
        candidateId: candidateId,
        jobId: newReview.jobId,
        rating: newReview.rating,
        review: newReview.review,
      };
      console.log('Submitting review payload:', payload);

      const response = await authApis()[editingReviewId ? 'put' : 'post'](
        editingReviewId
          ? endpoints.updateCompanyReview(editingReviewId)
          : endpoints.createCompanyReview,
        payload,
      );

      toast.success(editingReviewId ? 'Cập nhật đánh giá thành công!' : 'Tạo đánh giá thành công!');
      setNewReview({ rating: 1, review: '', jobId: null, companyId: parseInt(companyId, 10) });
      setEditingReviewId(null);
      await loadReviews();
    } catch (error) {
      console.error('Lỗi xử lý đánh giá:', error);
      const errorMsg = error.response?.data?.message || 'Không thể xử lý đánh giá!';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await authApis().delete(endpoints.deleteCompanyReview(reviewId));
      toast.success('Xóa đánh giá thành công!');
      await loadReviews();
    } catch (error) {
      console.error('Lỗi xóa đánh giá:', error);
      toast.error('Không thể xóa đánh giá!');
    }
  };

  const handleEditReview = (review) => {
    setNewReview({
      rating: review.rating,
      review: review.review,
      jobId: review.jobId?.id || review.jobId,
      companyId: parseInt(companyId, 10),
    });
    setEditingReviewId(review.id);
  };

  useEffect(() => {
    if (cookie.load('token') && user) {
      fetchCandidateId();
    }
  }, [user, fetchCandidateId]);

  useEffect(() => {
    if (candidateId) {
      checkCanReview();
      loadReviews();
    }
  }, [candidateId, checkCanReview, loadReviews]);

  return (
    <div className="reviews-section mt-5">
      <h2 className="section-title">Đánh giá công ty</h2>
      <p>
        <strong>Điểm trung bình:</strong> {averageRating.toFixed(1)} / 5
      </p>
      {loadingReviews ? (
        <div className="text-center">
          <Spinner animation="border" size="sm" /> Đang tải đánh giá...
        </div>
      ) : reviews.length === 0 ? (
        <p>Chưa có đánh giá nào.</p>
      ) : (
        <ListGroup>
          {reviews.map((review) => (
            <ListGroup.Item key={review.id}>
              <p>
                <strong>{review.candidateId?.fullName || 'Ẩn danh'}</strong>: {review.review}
              </p>
              <p>Điểm: {review.rating} / 5</p>
              <p>Ngày: {new Date(review.reviewDate).toLocaleDateString('vi-VN')}</p>
              {review.candidateId?.id === candidateId && (
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditReview(review)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      {canReview ? (
        <Form onSubmit={handleSubmitReview} className="mt-4">
          <h4>{editingReviewId ? 'Sửa đánh giá' : 'Viết đánh giá của bạn'}</h4>
          <Form.Group className="mb-3">
            <Form.Label>Điểm đánh giá (1-5)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, rating: parseInt(e.target.value, 10) || 1 }))
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nội dung đánh giá</Form.Label>
            <Form.Control
              as="textarea"
              maxLength="200"
              value={newReview.review}
              onChange={(e) => setNewReview((prev) => ({ ...prev, review: e.target.value }))}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? <Spinner size="sm" /> : editingReviewId ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
          </Button>
        </Form>
      ) : (
        <Alert variant="warning" className="mt-4">
          Bạn cần có đơn ứng tuyển được duyệt để đánh giá công ty này.
        </Alert>
      )}
    </div>
  );
};

export default CompanyReview;