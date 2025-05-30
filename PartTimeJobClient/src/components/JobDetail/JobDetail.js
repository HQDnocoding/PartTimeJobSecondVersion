import { useEffect, useState, useMemo } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useParams, useLocation, Link } from "react-router-dom";
import { authApis, endpoints } from "../../configs/APIs";
import { toast } from "react-hot-toast";
import MySpinner from "../layout/MySpinner";
import "./JobDetail.scss";

const JobDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [job, setJob] = useState(state?.job || null);
  const [loading, setLoading] = useState(!state?.job);
  const [hasImageError, setHasImageError] = useState(false); // Trạng thái để theo dõi lỗi tải ảnh

  useEffect(() => {
    if (!job) {
      const fetchJob = async () => {
        try {
          setLoading(true);
          const res = await authApis().get(endpoints.jobDetail(id));
          const jobData = res.data.data;
          const majorJob = jobData.majorJobCollection?.[0];
          const dayJobs = jobData.dayJobCollection || [];
          setJob({
            ...jobData,
            companyName: jobData.companyId?.name || "N/A",
            majorName: majorJob?.majorId?.name || "Chưa xác định",
            dayNames: dayJobs.map((dj) => dj.dayId?.name).filter((name) => name) || [],
            fullAddress: jobData.fullAddress || "Không có địa chỉ",
            district: jobData.district || "Không xác định",
            city: jobData.city || "Không xác định",
          });
        } catch (ex) {
          console.error("Lỗi khi tải chi tiết công việc:", ex);
          toast.error("Không thể tải chi tiết công việc!");
          setHasImageError(true); // Đặt lỗi nếu API thất bại
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id]); // Chỉ phụ thuộc vào id

  // Sử dụng useMemo để tránh tính toán lại job khi không cần thiết
  const processedJob = useMemo(() => {
    if (!job) return null;
    const majorJob = job.majorJobCollection?.[0];
    const dayJobs = job.dayJobCollection || [];
    return {
      ...job,
      companyName: job.companyId?.name || "N/A",
      majorName: majorJob?.majorId?.name || "Chưa xác định",
      dayNames: dayJobs.map((dj) => dj.dayId?.name).filter((name) => name) || [],
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
              <Card.Text className="mb-2">
                <strong>Công ty:</strong> {processedJob.companyName}
              </Card.Text>
              <Card.Text className="mb-2">
                <strong>Ngày đăng:</strong> {new Date(processedJob.postedDate).toLocaleDateString("vi-VN")}
              </Card.Text>
              <Card.Text className="mb-2">
                <strong>Mô tả:</strong> {processedJob.description}
              </Card.Text>
              <Card.Text className="mb-2">
                <strong>Yêu cầu:</strong> {processedJob.jobRequired}
              </Card.Text>
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
              <Card.Text className="mb-2">
                <strong>Kinh nghiệm:</strong> {processedJob.experienceRequired ? `${processedJob.experienceRequired} năm` : "Không yêu cầu"}
              </Card.Text>
              <Card.Text className="mb-2">
                <strong>Độ tuổi:</strong>{" "}
                {processedJob.ageFrom && processedJob.ageTo
                  ? `${processedJob.ageFrom} - ${processedJob.ageTo} tuổi`
                  : "Không yêu cầu"}
              </Card.Text>
              <Card.Text className="mb-2">
                <strong>Ngành nghề:</strong> {processedJob.majorName}
              </Card.Text>
              <Card.Text className="mb-2">
                <strong>Thời gian làm việc:</strong> {(processedJob.dayNames || []).length > 0 ? processedJob.dayNames.join(", ") : "Chưa xác định"}
              </Card.Text>
            </Col>
          </Row>
          <div className="d-grid gap-2 mt-3">
            <Button as={Link} to={`/jobs/apply/${processedJob.id}`} variant="success">
              Ứng tuyển ngay
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JobDetail;