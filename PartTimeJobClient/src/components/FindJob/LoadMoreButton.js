import { Row, Col, Button } from "react-bootstrap";

const LoadMoreButton = ({ hasMore, loading, onLoadMore }) => (
  <Row className="justify-content-start align-items-center g-4 mb-4 mt-4">
    {hasMore && !loading && (
      <Col md={6} lg={4} xs={10}>
        <Button
          variant="info"
          onClick={onLoadMore}
          className="w-100 rounded-pill shadow-sm"
        >
          Xem thêm
        </Button>
      </Col>
    )}
  </Row>
);

export default LoadMoreButton;