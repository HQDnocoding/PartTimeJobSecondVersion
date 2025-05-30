import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Dropdown,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MySpinner from "../layout/MySpinner";
import { toast } from "react-hot-toast";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./FindJob.scss";
import { MyUserContext } from "../../configs/Contexts";
import { useContext } from "react";
import rolesAndStatus from "../../utils/rolesAndStatus";
import APIs, { endpoints } from "../../configs/APIs";
import AddressSelector from "./AddressSelector";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const FindJob = () => {
  const user = useContext(MyUserContext);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [majors, setMajors] = useState([]);
  const [days, setDays] = useState([]);
  const [page, setPage] = useState(1);
  const [q, setQ] = useSearchParams();
  const [hasMore, setHasMore] = useState(true);
  const [keyword, setKeyword] = useState(q.get("keyword") || "");
  const [address, setAddress] = useState(q.get("address") || "");
  const [coordinates, setCoordinates] = useState(
    q.get("coordinates") ? q.get("coordinates").split(",").map(parseFloat) : []
  );
  const [distance, setDistance] = useState(parseFloat(q.get("distance")) || "");
  const [salaryRange, setSalaryRange] = useState([
    parseFloat(q.get("minSalary")) || 0,
    parseFloat(q.get("maxSalary")) || 100,
  ]);
  const [experience, setExperience] = useState(parseInt(q.get("experience")) || -1);
  const [postedDays, setPostedDays] = useState(parseInt(q.get("postedDays")) || "");
  const [majorId, setMajorId] = useState(q.get("majorId") || "");
  const [dayId, setDayId] = useState(q.get("dayId") || "");
  const [isFiltered, setIsFiltered] = useState(false);
  const nav = useNavigate();

  // Load danh sách ngành nghề và thời gian làm việc từ backend
  const loadFilters = async () => {
    try {
      const [majorsRes, daysRes] = await Promise.all([
        APIs.get(endpoints.majors),
        APIs.get(endpoints.days),
      ]);
      setMajors(majorsRes.data || []);
      setDays(daysRes.data || []);
    } catch (ex) {
      console.error("Lỗi khi tải bộ lọc:", ex);
      toast.error("Không thể tải bộ lọc!");
    }
  };

  // Handle address selection
  const handleAddressSelect = (addressData) => {
    setAddress(addressData.address);
    setCoordinates(addressData.coordinates);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = {};
    if (keyword.trim()) queryParams.keyword = keyword.trim();
    if (address.trim()) queryParams.address = address.trim();
    if (coordinates.length === 2) queryParams.coordinates = coordinates.join(",");
    if (distance) queryParams.distance = distance;
    if (salaryRange[0] > 0) queryParams.minSalary = salaryRange[0];
    if (salaryRange[1] < 100) queryParams.maxSalary = salaryRange[1];
    if (experience >= 0) queryParams.experience = experience;
    if (postedDays) queryParams.postedDays = postedDays;
    if (majorId) queryParams.majorId = majorId;
    if (dayId) queryParams.dayId = dayId;

    setQ(queryParams);
    setPage(1);
    setJobs([]);
    setHasMore(true);
    setIsFiltered(true);
  };

  const handleResetFilters = () => {
    setKeyword("");
    setAddress("");
    setCoordinates([]);
    setDistance("");
    setSalaryRange([0, 100]);
    setExperience(-1);
    setPostedDays("");
    setMajorId("");
    setDayId("");
    setQ({});
    setPage(1);
    setJobs([]);
    setHasMore(true);
    setIsFiltered(false);
    loadJobs();
  };

  const handleViewJob = async (jobId) => {
    try {
      setLoading(true);
      const res = await APIs.get(endpoints.jobDetail(jobId));
      nav(`/detail-job/${jobId}`, { state: { job: res.data.data } });
      toast.success("Lấy thông tin công việc thành công!");
    } catch (ex) {
      console.error("Lỗi khi xem chi tiết công việc:", ex);
      toast.error("Không thể lấy thông tin công việc!");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (jobId) => {
    if (!user) {
      nav("/login", { state: { from: `/jobs/apply/${jobId}` } });
      toast.error("Vui lòng đăng nhập để ứng tuyển!");
    } else if (user.role !== rolesAndStatus.candidate) {
      toast.error("Chỉ ứng viên mới có thể ứng tuyển!");
    } else {
      nav(`/jobs/apply/${jobId}`);
    }
  };

  const loadJobs = useCallback(async () => {
    if (!hasMore) return;

    try {
      setLoading(true);
      const keyword = q.get("keyword") || "";
      const addr = q.get("address") || "";
      const coords = q.get("coordinates") ? q.get("coordinates").split(",").map(parseFloat) : [];
      const dist = parseFloat(q.get("distance")) || Infinity;
      const minSal = parseFloat(q.get("minSalary")) || 0;
      const maxSal = parseFloat(q.get("maxSalary")) || Infinity;
      const exp = parseInt(q.get("experience")) || -1;
      const days = parseInt(q.get("postedDays")) || Infinity;
      const major = q.get("majorId") || "";
      const day = q.get("dayId") || "";

      const url = `${endpoints.jobs}?page=${page}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ""}${major ? `&majorId=${major}` : ""}${day ? `&dayId=${day}` : ""}&status=approved`;
      const res = await APIs.get(url);

      let newJobs = res.data.data.jobs || [];
      newJobs = newJobs.map((job) => {
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
      });

      const isFiltering = addr || coords.length === 2 || dist !== Infinity || minSal > 0 || maxSal < 100 || exp !== -1 || days !== Infinity || major || day;
      if (isFiltering) {
        newJobs = newJobs.filter((job) => {
          const jobLat = parseFloat(job.latitude) || 0;
          const jobLng = parseFloat(job.longitude) || 0;
          const salaryMin = job.salaryMin || 0;
          const salaryMax = job.salaryMax || 0;

          const currentDate = new Date("2025-05-29");
          let jobPostedDate;
          if (typeof job.postedDate === "string" && job.postedDate.includes("/")) {
            jobPostedDate = new Date(job.postedDate.split("/").reverse().join("-"));
          } else {
            jobPostedDate = new Date(job.postedDate);
          }
          const daysDiff = Math.floor((currentDate - jobPostedDate) / (1000 * 60 * 60 * 24));

          const jobExp = job.experienceRequired || 0;

          let isWithinDistance = true;
          if (coords.length === 2 && dist !== Infinity) {
            if (!isNaN(coords[0]) && !isNaN(coords[1]) && jobLat && jobLng) {
              const distToJob = calculateDistance(coords[1], coords[0], jobLat, jobLng);
              isWithinDistance = distToJob <= dist;
            } else {
              isWithinDistance = false;
            }
          }

          const matchesSalary =
            (!minSal && maxSal === Infinity) ||
            (salaryMin >= minSal * 1000000 && (maxSal === Infinity || salaryMax <= maxSal * 1000000));

          const matchesExperience = exp === -1 || jobExp >= exp;
          const matchesPostedDays = days === Infinity || daysDiff <= days;
          const matchesMajor = !major || (job.majorJobCollection?.[0]?.majorId?.id === parseInt(major));
          const matchesDay = !day || job.dayJobCollection?.some((dj) => dj.dayId?.id === parseInt(day));

          return isWithinDistance && matchesSalary && matchesExperience && matchesPostedDays && matchesMajor && matchesDay;
        });
      }

      setJobs((prev) => {
        const updatedJobs = page === 1 ? newJobs : [...prev, ...newJobs];
        const uniqueJobs = Array.from(
          new Map(updatedJobs.map((j) => [j.id, j])).values()
        );
        return uniqueJobs;
      });

      setHasMore(page < res.data.data.totalPages);
    } catch (ex) {
      console.error("Lỗi khi tải danh sách công việc:", ex);
      toast.error("Không thể tải danh sách công việc!");
    } finally {
      setLoading(false);
    }
  }, [page, q, hasMore, nav]);

  useEffect(() => {
    loadFilters();
    loadJobs();
  }, [page, loadJobs]);

  useEffect(() => {
    setPage(1);
    setJobs([]);
    setHasMore(true);
    setIsFiltered(!!q.toString());
  }, [q]);

  return (
    <Container fluid className="p-0">
      <Row className="justify-content-start g-4 custom-row mt-5 search-bar">
        <Col xs={12} className="text-start">
          <h2 className="search-title">
            <i className="bi bi-briefcase-fill me-2 search-icon"></i> Tìm kiếm công việc
          </h2>
          <p className="search-subtitle">
            Nhập từ khóa hoặc sử dụng bộ lọc để tìm kiếm
          </p>
        </Col>
        <Col md={12} lg={12} xs={12} className="text-start">
          <Form onSubmit={handleSearch} className="d-flex flex-wrap align-items-center">
            <InputGroup className="me-2 mb-2" style={{ width: "300px" }}>
              <Form.Control
                type="text"
                placeholder="Từ khóa (việc làm, công ty...)"
                value={keyword}
                className="search-input rounded-pill shadow-sm"
                onChange={(e) => setKeyword(e.target.value)}
              />
            </InputGroup>

            <Dropdown className="me-2 mb-2">
              <Dropdown.Toggle
                variant="outline-secondary"
                className="rounded-pill shadow-sm"
                style={{ width: "200px" }}
              >
                {address ? `Vị trí: ${address.substring(0, 20)}${address.length > 20 ? '...' : ''}` : "Chọn vị trí"}
              </Dropdown.Toggle>
              <Dropdown.Menu className="p-3" style={{ width: "400px" }}>
                <AddressSelector
                  onAddressSelect={handleAddressSelect}
                  disabled={loading}
                  isInvalid={false}
                />
                <Form.Group>
                  <Form.Label>Khoảng cách (km)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập khoảng cách"
                    value={distance}
                    min="1"
                    onChange={(e) => setDistance(parseFloat(e.target.value))}
                  />
                </Form.Group>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="me-2 mb-2">
              <Dropdown.Toggle
                variant="outline-secondary"
                className="rounded-pill shadow-sm"
                style={{ width: "200px" }}
              >
                {salaryRange[0] > 0 || salaryRange[1] < 100
                  ? `Lương: ${salaryRange[0]} - ${salaryRange[1]} triệu`
                  : "Chọn mức lương"}
              </Dropdown.Toggle>
              <Dropdown.Menu className="p-3" style={{ width: "300px" }}>
                <Form.Group>
                  <Form.Label>Lương (triệu VNĐ): {salaryRange[0]} - {salaryRange[1]}</Form.Label>
                  <Slider
                    range
                    min={0}
                    max={100}
                    value={salaryRange}
                    onChange={(value) => setSalaryRange(value)}
                    trackStyle={[{ backgroundColor: "#007BFF" }]}
                    handleStyle={[{ borderColor: "#007BFF" }, { borderColor: "#007BFF" }]}
                  />
                </Form.Group>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="me-2 mb-2">
              <Dropdown.Toggle
                variant="outline-secondary"
                className="rounded-pill shadow-sm"
                style={{ width: "200px" }}
              >
                {experience >= 0
                  ? `Kinh nghiệm: ${experience} năm`
                  : "Chọn kinh nghiệm"}
              </Dropdown.Toggle>
              <Dropdown.Menu className="p-3" style={{ width: "300px" }}>
                <Form.Group>
                  <Form.Label>Kinh nghiệm (năm): {experience >= 0 ? experience : "Không chọn"}</Form.Label>
                  <Slider
                    min={0}
                    max={100}
                    value={experience >= 0 ? experience : 0}
                    onChange={(value) => setExperience(value)}
                    trackStyle={{ backgroundColor: "#007BFF" }}
                    handleStyle={{ borderColor: "#007BFF" }}
                  />
                </Form.Group>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="me-2 mb-2">
              <Dropdown.Toggle
                variant="outline-secondary"
                className="rounded-pill shadow-sm"
                style={{ width: "200px" }}
              >
                {postedDays
                  ? `Ngày đăng: ${postedDays} ngày qua`
                  : "Chọn ngày đăng"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setPostedDays("")}>Tất cả</Dropdown.Item>
                <Dropdown.Item onClick={() => setPostedDays(7)}>7 ngày qua</Dropdown.Item>
                <Dropdown.Item onClick={() => setPostedDays(14)}>14 ngày qua</Dropdown.Item>
                <Dropdown.Item onClick={() => setPostedDays(30)}>30 ngày qua</Dropdown.Item>
                <Dropdown.Item onClick={() => setPostedDays(60)}>60 ngày qua</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="me-2 mb-2">
              <Dropdown.Toggle
                variant="outline-secondary"
                className="rounded-pill shadow-sm"
                style={{ width: "200px" }}
              >
                {majorId ? `Ngành nghề: ${majors.find((m) => m.id === parseInt(majorId))?.name || "Chọn ngành nghề"}` : "Chọn ngành nghề"}
              </Dropdown.Toggle>
              <Dropdown.Menu className="p-3" style={{ width: "300px" }}>
                <Form.Group>
                  <Form.Label>Ngành nghề</Form.Label>
                  <Form.Select
                    value={majorId}
                    onChange={(e) => setMajorId(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {majors.map((major) => (
                      <option key={major.id} value={major.id}>
                        {major.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="me-2 mb-2">
              <Dropdown.Toggle
                variant="outline-secondary"
                className="rounded-pill shadow-sm"
                style={{ width: "200px" }}
              >
                {dayId ? `Thời gian: ${days.find((d) => d.id === parseInt(dayId))?.name || "Chọn thời gian"}` : "Chọn thời gian làm việc"}
              </Dropdown.Toggle>
              <Dropdown.Menu className="p-3" style={{ width: "300px" }}>
                <Form.Group>
                  <Form.Label>Thời gian làm việc</Form.Label>
                  <Form.Select
                    value={dayId}
                    onChange={(e) => setDayId(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {days.map((day) => (
                      <option key={day.id} value={day.id}>
                        {day.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Dropdown.Menu>
            </Dropdown>

            <Button variant="primary" type="submit" className="me-2 mb-2 rounded-pill shadow-sm">
              Tìm kiếm
            </Button>
            <Button variant="secondary" onClick={handleResetFilters} className="mb-2 rounded-pill shadow-sm">
              Xóa bộ lọc
            </Button>
          </Form>
        </Col>
      </Row>

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
                  <strong>Mức lương:</strong> {job.salaryMin && job.salaryMax
                    ? `${job.salaryMin.toLocaleString("vi-VN")} - ${job.salaryMax.toLocaleString("vi-VN")} VNĐ`
                    : "Thỏa thuận"}
                </Card.Text>
                {(job.fullAddress !== "Không có địa chỉ" || job.district !== "Không xác định" || job.city !== "Không xác định") && (
                  <Card.Text className="card-text">
                    <strong>Địa điểm:</strong> {job.fullAddress !== "Không có địa chỉ" ? job.fullAddress : ""}{job.district !== "Không xác định" ? `, ${job.district}` : ""}{job.city !== "Không xác định" ? `, ${job.city}` : ""}
                  </Card.Text>
                )}
                <Card.Text className="card-text">
                  <strong>Kinh nghiệm:</strong> {job.experienceRequired
                    ? `${job.experienceRequired} năm`
                    : "Không yêu cầu"}
                </Card.Text>
                <Card.Text className="card-text card-text-highlight">
                  <strong>Độ tuổi:</strong>{" "}
                  {job.ageFrom && job.ageTo
                    ? `${job.ageFrom} - ${job.ageTo} tuổi`
                    : "Không yêu cầu"}
                </Card.Text>
                <Card.Text className="card-text">
                  <strong>Ngành nghề:</strong> {job.majorName}
                </Card.Text>
                <Card.Text className="card-text">
                  <strong>Thời gian làm việc:</strong> {(job.dayNames || []).length > 0 ? job.dayNames.join(", ") : "Chưa xác định"}
                </Card.Text>
                <Card.Text className="card-text">
                  <strong>Ngày đăng:</strong> {new Date(job.postedDate).toLocaleDateString("vi-VN")}
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

      <Row className="justify-content-start align-items-center g-4 mb-4 mt-4">
        {hasMore && jobs.length > 0 && !loading && (
          <Col md={6} lg={4} xs={10}>
            <Button
              variant="info"
              onClick={() => setPage((prev) => prev + 1)}
              className="w-100 rounded-pill shadow-sm"
            >
              Xem thêm
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default FindJob;