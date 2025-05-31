import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Alert, Form, Modal, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import roles, { states } from '../../utils/rolesAndStatus';
import { formatDate } from '../../utils/CommonUtils';
import cookie from 'react-cookies';
import { MyUserContext } from '../../configs/Contexts';
import { useNavigate } from 'react-router-dom';

const CandidateReview = ({ application, userRole, roles }) => {
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 1,
        review: '',
    });
    const user = useContext(MyUserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const loadReview = async () => {
            if (application?.status === states['application was approved'] && application.candidateId?.id) {
                try {
                    setLoading(true);
                    const res = await authApis().get(endpoints['getCandidateReviews'](application.candidateId.id));
                    const reviews = res.data.reviews;
                    const currentReview = reviews.find(
                        (r) => r.companyId === application.jobId.companyId.id && r.jobId === application.jobId.id
                    );
                    setReview(currentReview);
                    console.log('Loaded reviews:', reviews);
                    console.log('Current review:', currentReview);
                } catch (error) {
                    console.error('Lỗi khi tải đánh giá:', error);
                    toast.error(error.response?.data?.message || 'Lỗi khi tải đánh giá');
                } finally {
                    setLoading(false);
                }
            }
        };
        loadReview();
    }, [application]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Kiểm tra token
            const token = cookie.load('token');
            if (!token) {
                toast.error('Vui lòng đăng nhập lại!');
                navigate('/login');
                return;
            }

            // Kiểm tra vai trò người dùng
            if (user?.role !== roles.company) {
                toast.error('Chỉ công ty mới có thể tạo đánh giá!');
                return;
            }

            // Kiểm tra trạng thái đơn ứng tuyển
            if (application.status !== states['application was approved']) {
                toast.error('Đơn ứng tuyển phải được duyệt trước khi tạo đánh giá!');
                return;
            }

            // Kiểm tra quyền sở hữu công ty
            const companyRes = await authApis().get(endpoints['getCompanyByUserId'](user.id));
            const userCompanyId = companyRes.data.id;
            if (application.jobId.companyId.id !== userCompanyId) {
                toast.error('Bạn không có quyền tạo đánh giá cho công ty này!');
                return;
            }

            // Kiểm tra công việc thuộc công ty
            if (application.jobId.companyId.id !== userCompanyId) {
                toast.error('Công việc không thuộc công ty này!');
                return;
            }

            const payload = {
                companyId: application.jobId.companyId.id,
                jobId: application.jobId.id, // Sử dụng jobId từ application
                candidateId: application.candidateId.id, // Sử dụng candidateId từ application
                rating: parseInt(reviewForm.rating),
                review: reviewForm.review,
            };

            // Kiểm tra dữ liệu payload
            if (!payload.companyId || !payload.jobId || !payload.candidateId || !payload.rating || !payload.review) {
                toast.error('Dữ liệu không đầy đủ! Vui lòng kiểm tra lại.');
                return;
            }

            console.log('Token:', token);
            console.log('Payload:', payload);
            console.log('User:', user);
            console.log('Application:', application);

            if (review) {
                const res = await authApis().put(endpoints['updateCandidateReview'](review.id), payload);
                if (res.status === 200) {
                    setReview(res.data);
                    toast.success('Cập nhật đánh giá thành công');
                }
            } else {
                const res = await authApis().post(endpoints['createCandidateReview'], payload);
                if (res.status === 201) {
                    setReview(res.data);
                    toast.success('Tạo đánh giá thành công');
                }
            }
            setShowReviewModal(false);
        } catch (error) {
            console.error('Lỗi khi lưu đánh giá:', error);
            const errorMessage = error.response?.data?.message || 'Lỗi khi lưu đánh giá: ' + error.message;
            toast.error(errorMessage);
            if (error.response?.status === 401) {
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                cookie.remove('token', { path: '/' });
                cookie.remove('user', { path: '/' });
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!review) return;
        setLoading(true);
        try {
            await authApis().delete(endpoints['deleteCandidateReview'](review.id));
            setReview(null);
            toast.success('Xóa đánh giá thành công');
        } catch (error) {
            console.error('Lỗi khi xóa đánh giá:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi xóa đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewForm((prev) => ({ ...prev, [name]: value }));
    };

    if (!application || userRole !== roles.company || application.status !== states['application was approved']) {
        return null;
    }

    return (
        <>
            <h5>Đánh giá ứng viên</h5>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" size="sm" /> Đang tải đánh giá...
                </div>
            ) : review ? (
                <Table borderless hover size="sm">
                    <tbody>
                        <tr>
                            <td><strong>Điểm đánh giá</strong></td>
                            <td>{review.rating} / 5</td>
                        </tr>
                        <tr>
                            <td><strong>Nội dung</strong></td>
                            <td>{review.review}</td>
                        </tr>
                        <tr>
                            <td><strong>Ngày đánh giá</strong></td>
                            <td>{formatDate(review.reviewDate)}</td>
                        </tr>
                    </tbody>
                </Table>
            ) : (
                <Alert variant="info">Chưa có đánh giá cho ứng viên này.</Alert>
            )}
            <div className="action-buttons mt-4 text-center">
                <Button
                    variant="primary"
                    onClick={() => {
                        setReviewForm({
                            rating: review?.rating || 1,
                            review: review?.review || '',
                        });
                        setShowReviewModal(true);
                    }}
                    disabled={loading}
                >
                    {review ? 'Sửa đánh giá' : 'Tạo đánh giá'}
                </Button>
                {review && (
                    <Button
                        variant="danger"
                        className="ms-2"
                        onClick={handleDeleteReview}
                        disabled={loading}
                    >
                        Xóa đánh giá
                    </Button>
                )}
            </div>

            {/* Modal để tạo/sửa đánh giá */}
            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{review ? 'Sửa đánh giá' : 'Tạo đánh giá'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleReviewSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Điểm đánh giá (1-5)</Form.Label>
                            <Form.Control
                                as="select"
                                name="rating"
                                value={reviewForm.rating}
                                onChange={handleReviewChange}
                                required
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung đánh giá</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="review"
                                value={reviewForm.review}
                                onChange={handleReviewChange}
                                required
                                maxLength={200}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CandidateReview;