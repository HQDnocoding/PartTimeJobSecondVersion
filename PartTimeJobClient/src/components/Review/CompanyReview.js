import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { authApis } from "../../configs/APIs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CompanyReview = ({ applicationId, jobId, candidateId, companyId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!applicationId || !jobId || !candidateId || !companyId) {
      setError("Thiếu thông tin cần thiết để đánh giá.");
    }
  }, [applicationId, jobId, candidateId, companyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!applicationId || !jobId || !candidateId || !companyId) {
      setError("Vui lòng cung cấp đầy đủ thông tin.");
      setLoading(false);
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Đánh giá phải từ 1 đến 5 sao.");
      setLoading(false);
      return;
    }
    if (!comment || comment.length > 200) {
      setError("Bình luận không được để trống và tối đa 200 ký tự.");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending payload:", { applicationId, jobId, candidateId, companyId, rating, comment });
      console.log("Token in localStorage:", localStorage.getItem("token"));
      // Sửa endpoint
      const response = await authApis().post("/secure/company-reviews", {
        applicationId,
        jobId,
        candidateId,
        companyId,
        rating,
        comment,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Đánh giá đã được gửi thành công!");
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
        setRating(0);
        setComment("");
      } else {
        throw new Error("Yêu cầu không thành công, vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || "Dữ liệu gửi đi không hợp lệ. Vui lòng kiểm tra lại.");
            break;
          case 401:
            setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            navigate('/login');
            break;
          case 403:
            setError("Bạn không có quyền gửi đánh giá.");
            break;
          case 404:
            setError("Endpoint không tồn tại hoặc không tìm thấy tài nguyên.");
            break;
          case 500:
            setError("Lỗi server. Vui lòng thử lại sau.");
            break;
          default:
            setError(`Lỗi không xác định: ${err.response.status}`);
        }
      } else if (err.request) {
        setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.");
      } else {
        setError(`Lỗi: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-review mt-4">
      <h3>Đánh giá công ty</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Đánh giá (1-5 sao)</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Math.min(5, Math.max(1, Number(e.target.value))))}
            required
            disabled={!!error}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Bình luận</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            disabled={!!error}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading || !!error}>
          {loading ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </Form>
    </div>
  );
};

export default CompanyReview;