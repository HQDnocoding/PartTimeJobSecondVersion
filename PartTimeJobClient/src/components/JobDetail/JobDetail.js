import { useEffect, useState, useMemo } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/APIs";
import { toast } from "react-hot-toast";
import MySpinner from "../layout/MySpinner";
import CompanyReview from "../Review/CompanyReview";

const JobDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [job, setJob] = useState(state?.job || null);
  const [loading, setLoading] = useState(!state?.job);
  const [hasImageError, setHasImageError] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const navigate = useNavigate();
  const savedReviewData = JSON.parse(localStorage.getItem("reviewData")) || {};
  const reviewData = state || savedReviewData;

  useEffect(() => {
    if (!job) {
      const fetchJob = async () => {
        try {
          setLoading(true);
          const res = await authApis().get(endpoints.jobDetail(id));
          const jobData = res.data.data;
          setJob({
            ...jobData,
            companyName: jobData.companyId?.name || "N/A",
            majorName: jobData.majorJobCollection?.[0]?.majorId?.name || "Chưa xác định",
            dayNames: jobData.dayJobCollection?.map((dj) => dj.dayId?.name).filter((name) => name) || [],
            fullAddress: jobData.fullAddress || "Không có địa chỉ",
            district: jobData.district || "Không xác định",
            city: jobData.city || "Không xác định",
          });
        } catch (ex) {
          console.error("Lỗi khi tải chi tiết công việc:", ex);
          if (ex.response?.status === 401) {
            toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            navigate('/login');
          } else {
            toast.error("Không thể tải chi tiết công việc!");
            setHasImageError(true);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, navigate]);

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (reviewData?.applicationId) {
        try {
          console.log("Token in localStorage:", localStorage.getItem("token"));
          const response = await authApis().get(`/secure/applications/${reviewData.applicationId}`);
          if (response.data.status === "approved") {
            const reviewResponse = await authApis().get(`/company-reviews/application/${reviewData.applicationId}`);
            if (!reviewResponse.data) {
              setCanReview(true);
            } else {
              toast.info("Bạn đã gửi đánh giá cho công việc này.");
            }
          } else {
            toast.error("Ứng tuyển chưa được phê duyệt, không thể đánh giá.");
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra đánh giá:", error);
          if (error.response?.status === 401) {
            toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            navigate('/login');
          } else {
            toast.error("Không thể xác minh quyền đánh giá.");
          }
        }
      }
    };
    checkReviewEligibility();
  }, [reviewData, navigate]);

  const processedJob = useMemo(() => {
    if (!job) return null;
    return {
      ...job,
      companyName: job.companyId?.name || "N/A",
      majorName: job.majorJobCollection?.[0]?.majorId?.name || "Chưa xác định",
      dayNames: job.dayJobCollection?.map((dj) => dj.dayId?.name).filter((name) => name) || [],
      fullAddress: job.fullAddress || "Không có địa chỉ",
      district: job.district || "Không xác định",
      city: job.city || "Không xác định",
    };
  }, [job]);

  if (loading) {
    return <div className="text-start mt-4"><MySpinner /></div>;
  }

  if (!processedJob) {
    return <div className="text-start mt-4">Không tìm thấy công việc!</div>;
  }

  return (
    <Container className="mt-5">
      <Card className="job-detail-card shadow-sm">
        <div className="image-container">
          {processedJob.companyId?.avatar && !hasImageError ? (
            <Card.Img variant="top" src={processedJob.companyId.avatar} alt="Company Logo" onError={() => setHasImageError(true)} />
          ) : (
            <div className="image-placeholder">
              <span className="company-name-on-image">{processedJob.companyName}</span>
            </div>
          )}
        </div>
        <Card.Body className="text-start">
          <Card.Title className="job-title">{processedJob.jobName}</Card.Title>
          <Row className="align-items-start">
            <Col md={6} className="ps-0">
              <Card.Text className="mb-2"><strong>Công ty:</strong> {processedJob.companyName}</Card.Text>
              <Card.Text className="mb-2"><strong>Ngày đăng:</strong> {new Date(processedJob.postedDate).toLocaleDateString("vi-VN")}</Card.Text>
              <Card.Text className="mb-2"><strong>Mô tả:</strong> {processedJob.description}</Card.Text>
              <Card.Text className="mb-2"><strong>Yêu cầu:</strong> {processedJob.jobRequired}</Card.Text>
              <Card.Text className="mb-2">
                <strong>Mức lương:</strong>{" "}
                {processedJob.salaryMin && processedJob.salaryMax
                  ? `${processedJob.salaryMin.toLocaleString("vi-VN")} - ${processedJob.salaryMax.toLocaleString("vi-VN")} VNĐ`
                  : "Thỏa thuận"}
              </Card.Text>
            </Col>
            <Col md={6} className="ps-0">
              <Card.Text className="mb-2">
                <strong>Địa điểm:</strong> {processedJob.fullAddress !== "Không có địa chỉ" ? processedJob.fullAddress : ""}{processedJob.district !== "Không xác định" ? `, ${processedJob.district}` : ""}{processedJob.city !== "Không xác định" ? `, ${processedJob.city}` : ""}
              </Card.Text>
              <Card.Text className="mb-2"><strong>Kinh nghiệm:</strong> {processedJob.experienceRequired ? `${processedJob.experienceRequired} năm` : "Không yêu cầu"}</Card.Text>
              <Card.Text className="mb-2">
                <strong>Độ tuổi:</strong>{" "}
                {processedJob.ageFrom && processedJob.ageTo
                  ? `${processedJob.ageFrom} - ${processedJob.ageTo} tuổi`
                  : "Không yêu cầu"}
              </Card.Text>
              <Card.Text className="mb-2"><strong>Ngành nghề:</strong> {processedJob.majorName}</Card.Text>
              <Card.Text className="mb-2">
                <strong>Thời gian làm việc:</strong> {(processedJob.dayNames || []).length > 0 ? processedJob.dayNames.join(", ") : "Chưa xác định"}
              </Card.Text>
            </Col>
          </Row>
          <div className="d-grid gap-2 mt-3">
            <Button as={Link} to={`/detail-job/apply/${processedJob.id}`} variant="success">
              Ứng tuyển ngay
            </Button>
          </div>
        </Card.Body>
      </Card>

      {canReview && reviewData?.applicationId && (
        <CompanyReview
          applicationId={reviewData.applicationId}
          jobId={reviewData.jobId || processedJob.id}
          candidateId={reviewData.candidateId}
          companyId={reviewData.companyId}
          onReviewSubmitted={() => {
            localStorage.removeItem("reviewData");
            setCanReview(false);
          }}
        />
      )}
    </Container>
  );
};

export default JobDetail;