import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Dropdown,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import MySpinner from "../layout/MySpinner";
import { toast } from "react-hot-toast";
import "./FindCompany.scss";
import APIs, { endpoints } from "../../configs/APIs";
import axios from "axios";

// Hàm kiểm tra URL hợp lệ
const isValidUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const FindCompany = () => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [page, setPage] = useState(1);
  const [q, setQ] = useSearchParams();
  const [hasMore, setHasMore] = useState(true);
  const [keyword, setKeyword] = useState(q.get("keyword") || "");
  const [city, setCity] = useState(q.get("city") || "");
  const [district, setDistrict] = useState(q.get("district") || "");
  const [industryId, setIndustryId] = useState(q.get("industryId") || "");
  const [isFiltered, setIsFiltered] = useState(false);
  const nav = useNavigate();

  // Tải danh sách ngành nghề và thành phố
  const loadFilters = async () => {
    try {
      const [industriesRes, citiesRes] = await Promise.all([
        APIs.get(endpoints.majors),
        axios.get("https://provinces.open-api.vn/api/p/"),
      ]);
      setIndustries(industriesRes.data || []);
      setCities(citiesRes.data || []);
    } catch (ex) {
      console.error("Lỗi khi tải bộ lọc:", ex);
      toast.error("Không thể tải bộ lọc!");
    }
  };

  // Tải danh sách quận/huyện khi chọn thành phố
  const loadDistricts = async (cityCode) => {
    if (!cityCode) {
      setDistricts([]);
      return;
    }
    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
      setDistricts(res.data.districts || []);
    } catch (ex) {
      console.error("Lỗi khi tải quận/huyện:", ex);
      toast.error("Không thể tải danh sách quận/huyện!");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = { status: "approved" };
    if (keyword.trim()) queryParams.keyword = keyword.trim();
    if (city.trim()) queryParams.city = city.trim();
    if (district.trim()) queryParams.district = district.trim();
    if (industryId) queryParams.industryId = industryId;

    setQ(queryParams);
    setPage(1);
    setCompanies([]);
    setHasMore(true);
    setIsFiltered(true);
  };

  const handleResetFilters = () => {
    setKeyword("");
    setCity("");
    setDistrict("");
    setIndustryId("");
    setQ({ status: "approved" });
    setDistricts([]);
    setPage(1);
    setCompanies([]);
    setHasMore(true);
    setIsFiltered(false);
    loadCompanies();
  };

  const handleReload = () => {
    setPage(1);
    setCompanies([]);
    setHasMore(true);
    loadCompanies();
  };

  const handleViewCompany = async (companyId) => {
    try {
      setLoading(true);
      const res = await APIs.get(endpoints.companyDetail(companyId));
      nav(`/detail-company/${companyId}`, { state: { company: res.data } });
      toast.success("Lấy thông tin công ty thành công!");
    } catch (ex) {
      console.error("Lỗi khi xem chi tiết công ty:", ex);
      toast.error("Không thể lấy thông tin công ty!");
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = useCallback(async () => {
    if (!hasMore) return;

    try {
      setLoading(true);
      const keyword = q.get("keyword") || "";
      const city = q.get("city") || "";
      const district = q.get("district") || "";
      const industry = q.get("industryId") || "";

      const url = `${endpoints.companies}?page=${page}&status=approved${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ""}${city ? `&city=${encodeURIComponent(city)}` : ""}${district ? `&district=${encodeURIComponent(district)}` : ""}${industry ? `&industryId=${industry}` : ""}`;
      const res = await APIs.get(url);

      let newCompanies = res.data.data.companies || [];
      newCompanies = newCompanies.map((company) => ({
        ...company,
        industryName: company.industryId?.name || "Chưa xác định",
        avatar: isValidUrl(company.avatar) ? company.avatar : "/assets/img/default-company.jpg",
        fullAddress: company.fullAddress || "Không có địa chỉ",
        district: company.district || "Chưa xác định",
        city: company.city || "Chưa xác định",
        taxCode: company.taxCode || "N/A",
        selfDescription: company.selfDescription || "Chưa có mô tả",
      }));

      setCompanies((prev) => {
        const updatedCompanies = page === 1 ? newCompanies : [...prev, ...newCompanies];
        const uniqueCompanies = Array.from(
          new Map(updatedCompanies.map((c) => [c.id, c])).values()
        );
        return uniqueCompanies;
      });

      setHasMore(page < res.data.data.totalPages);
    } catch (ex) {
      console.error("Lỗi khi tải danh sách công ty:", ex);
      toast.error("Không thể tải danh sách công ty!");
    } finally {
      setLoading(false);
    }
  }, [page, q, hasMore, nav]);

  useEffect(() => {
    loadFilters();
    loadCompanies();
  }, [page, loadCompanies]);

  // Tải quận/huyện khi thành phố thay đổi
  useEffect(() => {
    const selectedCity = cities.find((c) => c.name === city);
    loadDistricts(selectedCity?.code);
  }, [city, cities]);

  useEffect(() => {
    setPage(1);
    setCompanies([]);
    setHasMore(true);
    setIsFiltered(!!q.toString());
  }, [q]);

  return (
    <Container fluid className="p-0">
      <Row className="justify-content-start g-4 custom-row mt-5 search-bar">
        <Col xs={12} className="text-start">
          <h2 className="search-title">
            <i className="bi bi-building-fill me-2 search-icon"></i> Tìm kiếm công ty
          </h2>
          <p className="search-subtitle">
            Nhập từ khóa hoặc sử dụng bộ lọc để tìm kiếm
          </p>
        </Col>
        <Col md={12} lg={12} xs={12} className="text-center">
          <Form onSubmit={handleSearch} className="d-flex flex-wrap align-items-center justify-content-center">
            <InputGroup className="me-2 mb-2" style={{ width: "300px" }}>
              <Form.Control
                type="text"
                placeholder="Tên công ty..."
                value={keyword}
                className="search-input rounded-pill shadow-sm"
                onChange={(e) => setKeyword(e.target.value)}
              />
            </InputGroup>

            <Dropdown className="me-2 mb-2" style={{ width: "200px" }}>
              <Dropdown.Toggle
                variant="outline-primary"
                className="rounded-pill shadow-sm w-100"
              >
                {city || "Chọn thành phố"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "500px", overflowY: "auto" }}>
                <Dropdown.Item onClick={() => setCity("")}>Tất cả</Dropdown.Item>
                {cities.map((c) => (
                  <Dropdown.Item key={c.code} onClick={() => setCity(c.name)}>
                    {c.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="me-2 mb-2" style={{ width: "200px" }}>
              <Dropdown.Toggle
                variant="outline-primary"
                className="rounded-pill shadow-sm w-100"
                disabled={!city}
              >
                {district || "Chọn quận/huyện"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "500px", overflowY: "auto" }}>
                <Dropdown.Item onClick={() => setDistrict("")}>Tất cả</Dropdown.Item>
                {districts.map((d) => (
                  <Dropdown.Item key={d.code} onClick={() => setDistrict(d.name)}>
                    {d.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button
              variant="primary"
              type="submit"
              className="me-2 mb-2 rounded-pill shadow-sm"
            >
              Tìm kiếm
            </Button>
            <Button
              variant="secondary"
              onClick={handleResetFilters}
              className="me-2 mb-2 rounded-pill shadow-sm"
            >
              Xóa bộ lọc
            </Button>
          </Form>
        </Col>
      </Row>

      <Row className="justify-content-start g-4 mt-4">
        {loading && (
          <div className="text-center mt-4">
            <MySpinner />
          </div>
        )}
        {!loading && companies.length === 0 && (
          <Alert variant="info" className="m-2 text-center">
            Không tìm thấy công ty nào! Vui lòng kiểm tra lại bộ lọc.
          </Alert>
        )}
        {companies.map((company) => (
          <Col key={company.id} xs={12} sm={6} md={4} lg={3}>
            <Card className="card-company shadow-sm">
              <Card.Img
                variant="top"
                src={company.avatar}
                className="card-img-top"
                alt={company.name}
              />
              <Card.Body className="card-body-custom text-start">
                <Card.Title className="card-title">{company.name}</Card.Title>
                <Card.Text className="card-text card-text-highlight">
                  <strong>Mã số thuế:</strong> {company.taxCode}
                </Card.Text>
                {(company.fullAddress !== "Không có địa chỉ" ||
                  company.district !== "Chưa xác định" ||
                  company.city !== "Chưa xác định") && (
                  <Card.Text className="card-text">
                    <strong>Địa chỉ:</strong>{" "}
                    {company.fullAddress !== "Không có địa chỉ" ? company.fullAddress : ""}
                    {company.district !== "Chưa xác định" ? `, ${company.district}` : ""}
                    {company.city !== "Chưa xác định" ? `, ${company.city}` : ""}
                  </Card.Text>
                )}
                {company.selfDescription !== "Chưa có mô tả" && (
                  <Card.Text className="card-text">
                    <strong>Mô tả:</strong>{" "}
                    {company.selfDescription.length > 100
                      ? `${company.selfDescription.substring(0, 100)}...`
                      : company.selfDescription}
                  </Card.Text>
                )}
                <div className="d-grid gap-1 mt-2">
                  <Button
                    variant="primary"
                    onClick={() => handleViewCompany(company.id)}
                    size="sm"
                    className="rounded-pill"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
        {hasMore && companies.length > 0 && !loading && (
          <Col md={6} lg={4} xs={10}>
            <Button
              variant="info"
              onClick={() => setPage((prev) => prev + 1)}
              className="w-100 rounded-pill shadow-sm load-more-button"
            >
              Xem thêm
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default FindCompany;