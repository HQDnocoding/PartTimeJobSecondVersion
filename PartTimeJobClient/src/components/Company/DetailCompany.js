import React, { useContext, useEffect, useRef, useState } from 'react';
import './DetailCompany.scss';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import { useNavigate, useParams } from 'react-router';
import { Card, Spinner, Button, Carousel, Col, Row } from 'react-bootstrap';
import { MyChatBoxContext, MyReceiverContext } from '../../configs/Contexts';
import { toast } from 'react-hot-toast';
import cookie from 'react-cookies';
import CompanyReview from '../Review/CompanyReview'; // Import CompanyReview

// Hàm kiểm tra URL hình ảnh hợp lệ
const isValidImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.includes('image');
  } catch {
    return false;
  }
};

const DetailCompany = () => {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobLoading, setJobLoading] = useState(true);
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [validImages, setValidImages] = useState([]);
  const errorRef = useRef(null);
  const { id } = useParams();
  const { isOpen, setIsOpen } = useContext(MyChatBoxContext);
  const { receiver, setReceiver } = useContext(MyReceiverContext);
  const nav = useNavigate();

  // Hàm tải thông tin công ty
  const loadCompany = async () => {
    setLoading(true);
    try {
      const res = await APIs.get(endpoints.getDetailCompany(id));
      if (res.status === 200) {
        setCompany(res.data);
        if (res.data.followCollection) {
          setFollowerCount(res.data.followCollection.length || 0);
        } else {
          await loadFollowerCount();
        }
        const images = res.data.imageWorkplaceCollection || [];
        const validImageUrls = await Promise.all(
          images.map(async (img) => ({
            ...img,
            isValid: await isValidImageUrl(img.imageUrl),
          }))
        );
        setValidImages(validImageUrls.filter((img) => img.isValid));
      } else {
        setErrors(['Không thể tải thông tin công ty']);
        errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (e) {
      console.error('Lỗi khi tải thông tin công ty:', e);
      setErrors(['Lỗi hệ thống xảy ra']);
      toast.error('Lỗi khi tải thông tin công ty!');
      await loadFollowerCount();
    } finally {
      setLoading(false);
    }
  };

  // Hàm tải số lượng người theo dõi
  const loadFollowerCount = async () => {
    try {
      const res = await APIs.get(endpoints.followers(id));
      if (res.status === 200) {
        setFollowerCount(res.data.data?.length || 0);
      }
    } catch (e) {
      console.error('Lỗi khi tải số lượng người theo dõi:', e);
      setFollowerCount(0);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const res = await authApis().get(endpoints.isFollowing(id));
      setFollowed(res.data.data);
    } catch (e) {
      console.error('Lỗi khi kiểm tra trạng thái theo dõi:', e);
      toast.error('Không thể kiểm tra trạng thái theo dõi!');
    }
  };

  // Hàm tải công việc
  const loadJobs = async () => {
    setJobLoading(true);
    try {
      const res = await APIs.get(endpoints.getJobsForCompany(id));
      if (res.status === 200) {
        const jobList = res.data || [];
        const mappedJobs = jobList.map((job) => {
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
        setJobs(Array.isArray(mappedJobs) ? mappedJobs : []);
        if (mappedJobs.length === 0) {
          console.warn('Công ty chưa có công việc nào');
        }
      } else {
        setErrors(['Không thể tải danh sách công việc']);
        toast.error('Không thể tải công việc!');
        errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (e) {
      console.error('Lỗi khi tải công việc:', e);
      toast.error('Lỗi khi tải công việc!');
    } finally {
      setJobLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([loadCompany(), loadJobs()]);
      if (cookie.load('token')) {
        await checkFollowStatus();
      }
    };
    fetchData();
  }, [id]);

  const handleFollow = async () => {
    if (followLoading || !cookie.load('token')) {
        if (!cookie.load('token')) {
            toast.error('Vui lòng đăng nhập để theo dõi công ty!');
            nav('/login');
            return;
        }
        return;
    }
    setFollowLoading(true);
    try {
        if (!followed) {
            const res = await authApis().post(endpoints.followCompany(id));
            if (res.status === 200 || res.status === 201) {
                setFollowed(res.data.isFollowing); // Lấy từ response
                setFollowerCount(res.data.followerCount); // Lấy từ response
                toast.success('Theo dõi công ty thành công!');
            }
        } else {
            const res = await authApis().delete(endpoints.unfollowCompany(id));
            if (res.status === 200) {
                setFollowed(res.data.isFollowing); // Lấy từ response
                setFollowerCount(res.data.followerCount); // Lấy từ response
                toast.success('Bỏ theo dõi công ty thành công!');
            }
        }
    } catch (e) {
        console.error('Lỗi khi theo dõi/bỏ theo dõi:', e);
        if (e.response?.status === 401) {
            toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
            cookie.remove('token');
            nav('/login');
        } else {
            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
            // Fallback: Gọi lại loadFollowerCount nếu API thất bại
            await loadFollowerCount();
        }
    } finally {
        setFollowLoading(false);
    }
};

  const handleMessage = async () => {
    try {
      const res = await APIs.get(endpoints.getUserIdFromCompanyId(id));
      if (res.status === 200) {
        setReceiver(res.data);
        setIsOpen(true);
        toast.success('Mở khung chat thành công!');
      }
    } catch (e) {
      console.error('Lỗi khi mở chat:', e);
      toast.error('Không thể mở khung chat!');
    }
  };

  const handleViewJobDetail = (jobId) => {
    nav(`/detail-job/${jobId}`);
  };

  return (
    <div className="company-info container my-4">
      {errors.length > 0 && (
        <Card className="mb-4 border-danger">
          <Card.Body ref={errorRef}>
            {errors.map((error, index) => (
              <div key={index} className="text-danger">{error}</div>
            ))}
          </Card.Body>
        </Card>
      )}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" size="sm" /> Đang tải thông tin công ty...
        </div>
      ) : company ? (
        <>
          <div className="company-card p-4 shadow-sm">
            <div className="row align-items-center">
              <div className="col-md-3 text-center">
                <img
                  src={company.avatar && isValidImageUrl(company.avatar) ? company.avatar : "/assets/img/default-company.jpg"}
                  alt={`Logo ${company.name}`}
                  className="company-logo img-fluid rounded-circle"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  loading="lazy"
                />
                <div className="button-group d-flex gap-2 mt-3">
                  <Button
                    variant={followed ? 'secondary' : 'primary'}
                    className="rounded-pill shadow-sm"
                    onClick={handleFollow}
                    disabled={followLoading}
                  >
                    {followLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : followed ? (
                      'Đã theo dõi'
                    ) : (
                      'Theo dõi'
                    )}
                  </Button>
                  <Button
                    variant="outline-info"
                    className="rounded-pill shadow-sm"
                    onClick={handleMessage}
                  >
                    <i className="bi bi-chat me-1"></i> Nhắn tin
                  </Button>
                </div>
                <p className="card-text-highlight mt-3 text-center">
                  <strong>Người theo dõi:</strong> {followerCount} người
                </p>
              </div>
              <div className="col-md-9">
                <h1 className="company-name">{company.name || 'Tên công ty'}</h1>
                <p className="company-email mb-2 card-text-highlight">
                  <i className="bi bi-envelope me-2"></i>
                  <strong>Email:</strong> {company.userId?.username || 'Chưa có email'}
                </p>
                <p className="company-address mb-2">
                  <i className="bi bi-geo-alt me-2"></i>
                  <strong>Địa chỉ:</strong> {`${company.fullAddress || ''}, ${company.district || ''}, ${company.city || 'Chưa có địa chỉ'}`}
                </p>
                <p className="company-status mb-3 card-text-highlight">
                  <i className="bi bi-check-circle me-2"></i>
                  <strong>Trạng thái:</strong>{" "}
                  {company.status === "approved" ? "Đã phê duyệt" : "Đang chờ duyệt"}
                </p>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-12 text-start">
                <h2 className="section-title">Giới thiệu công ty</h2>
                <p className="company-description">
                  {company.selfDescription || 'Công ty chưa cung cấp thông tin mô tả.'}
                </p>
              </div>
            </div>

            {validImages.length > 0 && (
              <div className="row mt-4">
                <div className="col-12 text-start">
                  <h2 className="section-title">Hình ảnh nơi làm việc</h2>
                  <Carousel>
                    {validImages.map((img, index) => (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100"
                          src={img.imageUrl}
                          alt={`Nơi làm việc ${index + 1}`}
                          style={{ height: "300px", objectFit: "cover" }}
                          loading="lazy"
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
              </div>
            )}

            <div className="jobs-section mt-5">
              <div className="col-12 text-start">
                <h2 className="section-title">Danh sách công việc</h2>
                {jobLoading ? (
                  <div className="text-center">
                    <Spinner animation="border" size="sm" /> Đang tải danh sách công việc...
                  </div>
                ) : jobs.length === 0 ? (
                  <p className="text-muted">Hiện tại công ty chưa có công việc nào.</p>
                ) : (
                  <Row>
                    {jobs.map((job) => (
                      <Col key={job.id} md={6} className="mb-4">
                        <Card className="card-job shadow-sm">
                          <Card.Body className="card-body-custom text-start">
                            <Card.Title className="card-title">{job.jobName || 'Tên công việc không xác định'}</Card.Title>
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
                              <strong>Thời gian làm việc:</strong> {(job.dayNames || []).length > 0 ? job.dayNames.join(", ") : "Chưa xác định"}
                            </Card.Text>
                            <Card.Text className="card-text">
                              <strong>Ngày đăng:</strong> {new Date(job.postedDate).toLocaleDateString("vi-VN")}
                            </Card.Text>
                            <div className="d-grid gap-1 mt-2">
                              <Button
                                variant="primary"
                                onClick={() => handleViewJobDetail(job.id)}
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
                )}
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12 text-start">
                <CompanyReview companyId={id} /> {/* Gọi CompanyReview */}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-muted">Không có thông tin công ty.</p>
      )}
    </div>
  );
};

export default DetailCompany;