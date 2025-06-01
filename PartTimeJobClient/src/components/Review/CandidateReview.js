import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Alert, Form, Modal, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { authApis, endpoints } from '../../configs/APIs';
import roles, { states } from '../../utils/rolesAndStatus';
import { formatDate } from '../../utils/CommonUtils';
import { MyUserContext } from '../../configs/Contexts';
import './candidateReview.scss';

const CandidateReview = ({ application, userRole, roles }) => {
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 1,
        review: '',
    });
    const user = useContext(MyUserContext);

    useEffect(() => {
        const loadReview = async () => {
            if (!application?.candidateId?.id || !application?.jobId?.id) return;

            try {
                setLoading(true);
                const res = await authApis().get(
                    `${endpoints['getCandidateReviews'](application.candidateId.id)}?jobId=${application.jobId.id}`
                );
                if (res.status === 200 && res.data.reviews?.length > 0) {
                    setReview(res.data.reviews[0]);
                    setReviewForm({
                        rating: res.data.reviews[0].rating || 1,
                        review: res.data.reviews[0].review || '',
                    });
                } else {
                    setReview(null);
                }
            } catch (error) {
                console.error('Lỗi khi tải đánh giá:', error);
                toast.error(error.response?.data?.message || 'Lỗi khi tải đánh giá');
            } finally {
                setLoading(false);
            }
        };

        loadReview();
    }, [application]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
            toast.error('Điểm đánh giá phải từ 1 đến 5');
            return;
        }
        if (!reviewForm.review) {
            toast.error('Vui lòng nhập nội dung đánh giá');
            return;
        }
        if (user?.role !== roles.company) {
            toast.error('Chỉ công ty mới có thể tạo đánh giá!');
            return;
        }
        if (application.status !== states['application was approved']) {
            toast.error('Đơn ứng tuyển phải được duyệt trước khi tạo đánh giá!');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                companyId: application.jobId.companyId.id,
                jobId: application.jobId.id,
                candidateId: application.candidateId.id,
                rating: parseInt(reviewForm.rating),
                review: reviewForm.review,
            };

            let res;
            if (review) {
                res = await authApis().put(endpoints['updateCandidateReview'](review.id), payload);
            } else {
                res = await authApis().post(endpoints['createCandidateReview'], payload);
            }

            if (res.status === 200 || res.status === 201) {
                setReview(res.data);
                setShowReviewModal(false);
                toast.success(review ? 'Cập nhật đánh giá thành công' : 'Tạo đánh giá thành công');
            } else {
                toast.error('Không thể lưu đánh giá');
            }
        } catch (error) {
            console.error('Lỗi khi lưu đánh giá:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi lưu đánh giá');
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
            setReviewForm({ rating: 1, review: '' });
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

    return (
        <div className="candidate-review">
            <h5>Đánh giá ứng viên</h5>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" size="sm" /> Đang tải...
                </div>
            ) : userRole === roles.company && application.status === states['application was approved'] ? (
                <>
                    {review ? (
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
                </>
            ) : userRole === roles.candidate && review ? (
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
            ) : userRole === roles.candidate ? (
                <Alert variant="info">Chưa có đánh giá từ công ty.</Alert>
            ) : null}

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
        </div>
    );
};

export default CandidateReview;