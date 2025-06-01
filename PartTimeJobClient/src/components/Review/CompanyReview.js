import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/APIs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";

const CompanyReview = ({ applicationId, jobId, candidateId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!applicationId || !jobId || !candidateId) {
      setError("Thiếu thông tin cần thiết để đánh giá.");
    }
  }, [applicationId, jobId, candidateId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = cookie.load("token") || localStorage.getItem("token");
      if (!token) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }

      // Kiểm tra trạng thái ứng tuyển
      const appResponse = await authApis().get(endpoints.getApplicationDetail(applicationId));
      if (appResponse.data.data.status !== "application was approved") {
        throw new Error("Ứng tuyển chưa được phê duyệt, không thể đánh giá.");
      }

      if (!applicationId || !jobId || !candidateId) {
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

      console.log("Sending payload:", { applicationId, jobId, candidateId, rating, review: comment });
      const response = await authApis().post(endpoints.createCompanyReview, {
        applicationId,
        jobId,
        candidateId,
        rating,
        review: comment,
      });

      if (response.status === 201) {
        toast.success("Đánh giá đã được gửi thành công!");
        onReviewSubmitted();
        setRating(0);
        setComment("");
      } else {
        throw new Error("Yêu cầu không thành công, vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      if (err.message === "No authentication token found. Please log in." || err.response?.status === 401) {
        setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        cookie.remove("token", { path: "/" });
        localStorage.removeItem("token");
        navigate("/login");
      } else if (err.message === "Ứng tuyển chưa được phê duyệt, không thể đánh giá.") {
        setError(err.message);
      } else if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || "Dữ liệu gửi đi không hợp lệ. Vui lòng kiểm tra lại.");
            break;
          case 403:
            setError("Bạn không có quyền gửi đánh giá.");
            break;
          case 404:
            setError("Không tìm thấy tài nguyên.");
            break;
          case 500:
            setError("Lỗi server. Vui lòng thử lại sau.");
            break;
          default:
            setError(`Lỗi không xác định: ${err.response.status}`);
        }
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
            disabled={loading || !!error}
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
            disabled={loading || !!error}
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