import { Row, Alert, Card, Button, Col } from "react-bootstrap";
import MySpinner from "../layout/MySpinner";

const JobList = ({ jobs, loading, handleViewJob, handleApplyClick }) => (
  <Row className="justify-content-start g-4 mt-4">
    {loading && (
      <div className="text-start mt-4">
        <MySpinner />
      </div>
    )}
    {!loading && jobs.length === 0 && (
      <Alert variant="info" className="m-2 text-start">
        Không tìm thấy công việc nào! Vui lòng kiểm tra lại bộ lọc.
      </Alert>
    )}
    {jobs.map((job) => (
      <Col key={job.id} xs={12} sm={6} md={4} lg={3}>
        <Card className="card-job shadow-sm">
          <Card.Body className="card-body-custom text-start">
            <Card.Title className="card-title">{job.jobName || "Tên công việc không xác định"}</Card.Title>
            <Card.Text className="card-text card-text-highlight">
              <strong>Mức lương:</strong>{" "}
              {job.salaryMin && job.salaryMax
                ? `${job.salaryMin.toLocaleString("vi-VN")} - ${job.salaryMax.toLocaleString("vi-VN")} VNĐ`
                : "Thỏa thuận"}
            </Card.Text>
            {(job.fullAddress !== "Không có địa chỉ" || job.district !== "Không xác định" || job.city !== "Không xác định") && (
              <Card.Text className="card-text">
                <strong>Địa điểm:</strong>{" "}
                {job.fullAddress !== "Không có địa chỉ" ? job.fullAddress : ""}{job.district !== "Không xác định" ? `, ${job.district}` : ""}{job.city !== "Không xác định" ? `, ${job.city}` : ""}
              </Card.Text>
            )}
            <Card.Text className="card-text">
              <strong>Kinh nghiệm:</strong>{" "}
              {job.experienceRequired ? `${job.experienceRequired} năm` : "Không yêu cầu"}
            </Card.Text>
            <Card.Text className="card-text card-text-highlight">
              <strong>Độ tuổi:</strong>{" "}
              {job.ageFrom && job.ageTo ? `${job.ageFrom} - ${job.ageTo} tuổi` : "Không yêu cầu"}
            </Card.Text>
            <Card.Text className="card-text">
              <strong>Ngành nghề:</strong> {job.majorName}
            </Card.Text>
            <Card.Text className="card-text">
              <strong>Thời gian làm việc:</strong>{" "}
              {(job.dayNames || []).length > 0 ? job.dayNames.join(", ") : "Chưa xác định"}
            </Card.Text>
            <div className="d-grid gap-1 mt-2">
              <Button
                variant="primary"
                onClick={() => handleViewJob(job.id)}
                size="sm"
                className="rounded-pill"
              >
                Xem chi tiết
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleApplyClick(job.id)}
                className="rounded-pill"
              >
                Ứng tuyển
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

export default JobList;