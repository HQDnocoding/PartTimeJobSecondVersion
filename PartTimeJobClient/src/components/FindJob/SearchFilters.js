import { Button, Col, Dropdown, Form, InputGroup, Row } from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import AddressSelector from "./AddressSelector";

const SearchFilters = ({
  loading,
  keyword,
  setKeyword,
  address,
  handleAddressSelect,
  distance,
  setDistance,
  salaryRange,
  setSalaryRange,
  experience,
  setExperience,
  postedDays,
  setPostedDays,
  majorId,
  setMajorId,
  majors,
  dayId,
  setDayId,
  days,
  handleSearch,
  handleResetFilters,
}) => {
  return (
    <Row className="justify-content-start g-4 custom-row mt-5 search-bar">
      <Col xs={12} className="text-start">
        <h2 className="search-title">
          <i className="bi bi-briefcase-fill me-2 search-icon"></i> Tìm kiếm công việc
        </h2>
        <p className="search-subtitle">Nhập từ khóa hoặc sử dụng bộ lọc để tìm kiếm</p>
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
            <Dropdown.Toggle variant="outline-secondary" className="rounded-pill shadow-sm" style={{ width: "200px" }}>
              {address ? `Vị trí: ${address.substring(0, 20)}${address.length > 20 ? '...' : ''}` : "Chọn vị trí"}
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-3" style={{ width: "400px" }}>
              <AddressSelector onAddressSelect={handleAddressSelect} disabled={loading} isInvalid={false} />
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
            <Dropdown.Toggle variant="outline-secondary" className="rounded-pill shadow-sm" style={{ width: "200px" }}>
              {salaryRange[0] > 0 || salaryRange[1] < 100 ? `Lương: ${salaryRange[0]} - ${salaryRange[1]} triệu` : "Chọn mức lương"}
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
            <Dropdown.Toggle variant="outline-secondary" className="rounded-pill shadow-sm" style={{ width: "200px" }}>
              {experience >= 0 ? `Kinh nghiệm: ${experience} năm` : "Chọn kinh nghiệm"}
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
            <Dropdown.Toggle variant="outline-secondary" className="rounded-pill shadow-sm" style={{ width: "200px" }}>
              {majorId ? `Ngành nghề: ${majors.find((m) => m.id === parseInt(majorId))?.name || "Chọn ngành nghề"}` : "Chọn ngành nghề"}
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-3" style={{ width: "300px" }}>
              <Form.Group>
                <Form.Label>Ngành nghề</Form.Label>
                <Form.Select value={majorId} onChange={(e) => setMajorId(e.target.value)}>
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
            <Dropdown.Toggle variant="outline-secondary" className="rounded-pill shadow-sm" style={{ width: "200px" }}>
              {dayId ? `Thời gian: ${days.find((d) => d.id === parseInt(dayId))?.name || "Chọn thời gian"}` : "Chọn thời gian làm việc"}
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-3" style={{ width: "300px" }}>
              <Form.Group>
                <Form.Label>Thời gian làm việc</Form.Label>
                <Form.Select value={dayId} onChange={(e) => setDayId(e.target.value)}>
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
  );
};

export default SearchFilters;