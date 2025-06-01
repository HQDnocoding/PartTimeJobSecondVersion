import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Alert, Form, Modal, Spinner, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { authApis, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/Contexts';
import { formatDate } from '../../utils/CommonUtils';
import roles from '../../utils/rolesAndStatus';
import './companyReview.scss';

const CompanyReview = ({ companyId, jobId }) => {
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [averageRating, setAverageRating] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 1,
        review: '',
    });
    const [canReview, setCanReview] = useState(false);
    const [applicationId, setApplicationId] = useState(null);
    const user = useContext(MyUserContext);

    useEffect(() => {
        const loadReviewsAndAverage = async () => {
            setLoading(true);
            try {
                const reviewRes = await authApis().get(endpoints['getCompanyReviews'](companyId));
                if (reviewRes.status === 200) {
                    setReviews(reviewRes.data.reviews || []);
                    const userRev = reviewRes.data.reviews.find(
                        (r) => r.candidateId === user?.candidateId && r.applicationId.jobId === parseInt(jobId)
                    );
                    setUserReview(userRev || null);
                    if (userRev) {
                        setReviewForm({
                            rating: userRev.rating || 1,
                            review: userRev.review || '',
                        });
                    }
                }

                const avgRes = await authApis().get(endpoints['getCompanyAverageRating'](companyId));
                if (avgRes.status === 200) {
                    setAverageRating(avgRes.data || 0);
                }
            } catch (error) {
                console.error('Lỗi khi tải đánh giá hoặc điểm trung bình:', error);
                toast.error(error.response?.data?.message || 'Lỗi khi tải đánh giá');
            } finally {
                setLoading(false);
            }
        };

        const checkCanReview = async () => {
            try {
                const res = await authApis().get(endpoints['getApplications']);
                if (res.status === 200) {
                    const application = res.data.find(
                        (app) => app.candidateId.id === user.candidateId && app.jobId.id === parseInt(jobId)
                    );
                    if (application) {
                        setCanReview(true);
                        setApplicationId(application.id);
                    }
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra đơn ứng tuyển:', error);
                toast.error('Lỗi khi kiểm tra khả năng đánh giá');
            }
        };

        if (user?.role === roles.candidate) {
            checkCanReview();
        }
        loadReviewsAndAverage();
    }, [companyId, jobId, user]);

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
        if (user?.role !== roles.candidate) {
            toast.error('Chỉ ứng viên mới có thể tạo đánh giá!');
            return;
        }
        if (!canReview || !applicationId) {
            toast.error('Bạn cần có đơn ứng tuyển cho công việc này để tạo đánh giá!');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                candidateId: user.candidateId,
                companyId: parseInt(companyId),
                applicationId: parseInt(applicationId),
                rating: parseInt(reviewForm.rating),
                review: reviewForm.review,
            };

            let res;
            if (userReview) {
                res = await authApis().put(endpoints['updateCompanyReview'](userReview.id), payload);
            } else {
                res = await authApis().post(endpoints['createCompanyReview'], payload);
            }

            if (res.status === 200 || res.status === 201) {
                setUserReview(res.data);
                setReviews((prev) =>
                    userReview
                        ? prev.map((r) => (r.id === res.data.id ? res.data : r))
                        : [...prev, res.data]
                );
                setShowReviewModal(false);
                toast.success(userReview ? 'Cập nhật đánh giá thành công' : 'Tạo đánh giá thành công');
                const avgRes = await authApis().get(endpoints['getCompanyAverageRating'](companyId));
                if (avgRes.status === 200) {
                    setAverageRating(avgRes.data || 0);
                }
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
        if (!userReview) return;
        setLoading(true);
        try {
            await authApis().delete(endpoints['deleteCompanyReview'](userReview.id));
            setUserReview(null);
            setReviews((prev) => prev.filter((r) => r.id !== userReview.id));
            setReviewForm({ rating: 1, review: '' });
            toast.success('Xóa đánh giá thành công');
            const avgRes = await authApis().get(endpoints['getCompanyAverageRating'](companyId));
            if (avgRes.status === 200) {
                setAverageRating(avgRes.data || 0);
            }
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
        <div className="company-review">
            <h2 className="section-title">Đánh giá công ty</h2>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" size="sm" /> Đang tải...
                </div>
            ) : (
                <>
                    <Row className="mb-3">
                        <Col>
                            <h5>Điểm đánh giá trung bình: {averageRating ? averageRating.toFixed(1) : 'N/A'} / 5</h5>
                        </Col>
                    </Row>
                    {reviews.length === 0 ? (
                        <Alert variant="info">Chưa có đánh giá nào cho công ty này.</Alert>
                    ) : (
                        <Row>
                            {reviews.map((review) => (
                                <Col key={review.id} md={6} className="mb-4">
                                    <Card>
                                        <Card.Body>
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
                                                        <td><strong>Công việc</strong></td>
                                                        <td>{review.applicationId?.jobId?.jobName || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Ngày đánh giá</strong></td>
                                                        <td>{formatDate(review.reviewDate)}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                    {user?.role === roles.candidate && canReview && (
                        <div className="action-buttons mt-4 text-center">
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setReviewForm({
                                        rating: userReview?.rating || 1,
                                        review: userReview?.review || '',
                                    });
                                    setShowReviewModal(true);
                                }}
                                disabled={loading}
                            >
                                {userReview ? 'Sửa đánh giá' : 'Tạo đánh giá'}
                            </Button>
                            {userReview && (
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
                    )}
                    {user?.role === roles.candidate && !canReview && (
                        <Alert variant="warning">
                            Bạn cần có đơn ứng tuyển cho công việc này để tạo đánh giá.
                        </Alert>
                    )}
                </>
            )}

            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{userReview ? 'Sửa đánh giá' : 'Tạo đánh giá'}</Modal.Title>
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

export default CompanyReview;