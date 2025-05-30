import React, { useState, useEffect, useRef, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, InputGroup, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './JobApplicationForm.scss';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import { useNavigate, useParams } from 'react-router-dom';
import { MyUserContext } from '../../configs/Contexts';
import { formatDate, formatSalary } from '../../utils/CommonUtils';

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const user = useContext(MyUserContext);
  const [formData, setFormData] = useState({
    message: '',
    curriculumVitae: '',
  });
  const [file, setFile] = useState(null); 
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(false);
  const errorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isChecked, setCheck] = useState(false);
  const nav = useNavigate();
  // Load job details
  useEffect(() => {
    const loadJob = async () => {
      if (!jobId) {
        setErrors(['ID công việc không hợp lệ.']);
        return;
      }

      setJobLoading(true);
      try {
        const res = await APIs.get(endpoints['jobDetail'](jobId));
        if (res.status === 200 && res.data?.data) {
          setJob(res.data.data);
        } else {
          setErrors(['Không thể tải thông tin công việc: Phản hồi không hợp lệ.']);
        }
      } catch (error) {
        console.error('Lỗi khi tải công việc:', error);
        setErrors([error.response?.data?.message || 'Không thể tải thông tin công việc.']);
      } finally {
        setJobLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors([]);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors(['File CV không được vượt quá 5MB.']);
        setFile(null);
      } else if (
        !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(
          selectedFile.type
        )
      ) {
        setErrors(['File CV phải có định dạng PDF, DOC, hoặc DOCX.']);
        setFile(null);
      } else {
        setFile(selectedFile);
        setFormData((prev) => ({ ...prev, curriculumVitae: '' })); // Bỏ chọn CV mặc định
        setErrors([]);
      }
    }
  };

  // Handle default CV checkbox
  const handleDefaultCVChange = (e) => {
    setCheck(e.target.checked);
    setFormData((prev) => ({
      ...prev,
      curriculumVitae: e.target.checked ? user?.candidate?.curriculumVitae : '',
    }));
    if (e.target.checked) {
      setFile(null); // Xóa file upload
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
    setErrors([]);
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setErrors([]);
  };

  // Validate form
  const validateForm = () => {
    const validationErrors = [];
    if (!file && !formData.curriculumVitae) {
      validationErrors.push('Vui lòng tải lên CV hoặc chọn CV mặc định.');
    }
    if (formData.message && formData.message.length > 400) {
      validationErrors.push('Thư giới thiệu không được vượt quá 400 ký tự.');
    }
    return validationErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      if (file) {
        formDataToSend.append('curriculumVitae', file);
      } else {
        // formDataToSend.append('curriculumVitae', formData.curriculumVitae);
      }
      // formDataToSend.append('appliedDate', new Date().toISOString());
      formDataToSend.append('message', formData.message || '');
      formDataToSend.append('candidateId', user?.candidate?.id || 1);
      formDataToSend.append('jobId', parseInt(jobId));

      console.log("fomr",formDataToSend.get('jobId'));
      

      // console.log(formDataToSend.get('curriculumVitae'));
      formDataToSend.forEach(k => console.log(k));


      const response = await authApis().post(endpoints['sendApplication'], formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        toast.success(response.data.message || 'Gởi đơn ứng tuyển thành công!');
        setFormData({ message: '', curriculumVitae: '' });
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        nav(`/detail-job/${jobId}`);
      } else {
        throw new Error('Phản hồi không hợp lệ từ server');
      }
    } catch (error) {
      console.error('Lỗi khi gửi đơn ứng tuyển:', error);
      const errorMessage = error.response?.data?.message || 'Gởi đơn ứng tuyển thất bại. Vui lòng thử lại.';
      setErrors([errorMessage]);
      toast.error(errorMessage);
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const hasDefaultCV = !!user?.candidate?.curriculumVitae;

  return (
    <Container className="job-application-container py-5">
      <Row>
        <Col md={8}>
          <h2 className="mb-4 text-center">
            Nộp hồ sơ ứng tuyển:{' '}
            <span style={{ color: '#007bff' }}>
              {jobLoading ? 'Đang tải...' : job?.jobName || 'Không tìm thấy công việc'}
            </span>
          </h2>
          {errors.length > 0 && (
            <Card className="mb-4 border-danger">
              <Card.Body ref={errorRef}>
                {errors.map((error, index) => (
                  <div key={index} className="text-danger">
                    {error}
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
          <Form onSubmit={handleSubmit} className="application-form p-4 rounded shadow-sm bg-white">
            {hasDefaultCV && (
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Chọn CV mặc định *</Form.Label>
                <Form.Group>
                  <iframe src={user.candidate.curriculumVitae} />
                </Form.Group>
                <Form.Check
                  type="checkbox"
                  label={`Sử dụng CV mặc định`}
                  checked={isChecked}
                  disabled={loading}
                  onChange={handleDefaultCVChange}
                />
              </Form.Group>

            )}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Tải lên CV *</Form.Label>
              <InputGroup>
                <Form.Control
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={loading || !!formData.curriculumVitae}
                  ref={fileInputRef}

                  isInvalid={errors.some((err) => err.includes('File CV'))}
                />
                {file && (
                  <Button
                    variant="outline-danger"
                    onClick={handleRemoveFile}
                    disabled={loading}
                    className="ms-2"
                  >
                    Gỡ CV
                  </Button>
                )}
              </InputGroup>
              {file && (
                <Form.Text className="text-muted mt-1">
                  File đã chọn: {file.name}
                </Form.Text>
              )}
              <Form.Text className="text-muted">
                Định dạng hỗ trợ: PDF, DOC, DOCX (tối đa 5MB).
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Thư giới thiệu (Tùy chọn, tối đa 400 ký tự)</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Viết thư giới thiệu của bạn..."
                disabled={loading}
                maxLength={400}
              />
              <Form.Text className="text-muted">
                {formData.message.length}/400 ký tự
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                label="Tôi xác nhận đã đọc và hiểu thông tin công việc"
                required
                disabled={loading}
              />
            </Form.Group>

            <div className="text-center">
              <Button
                type="submit"
                variant="primary"
                disabled={loading || jobLoading}
                className="px-5 py-2 rounded-pill"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Đang gửi...
                  </>
                ) : (
                  'NỘP ỨNG TUYỂN'
                )}
              </Button>
            </div>
          </Form>
        </Col>
        <Col md={4}>
          <Card className="job-details-card p-3 mb-4 bg-light">
            <Card.Title className="fw-bold mb-3">THÔNG TIN VIỆC LÀM</Card.Title>
            <Card.Text>
              {jobLoading ? (
                <div className="text-center">
                  <Spinner animation="border" size="sm" /> Đang tải thông tin công việc...
                </div>
              ) : job ? (
                <Table borderless hover className="job-details-table">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Công việc:</strong>
                      </td>
                      <td>{job.jobName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Công ty:</strong>
                      </td>
                      <td>{job.companyId?.name || job.company?.name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Địa chỉ:</strong>
                      </td>
                      <td>{job.fullAddress || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Mức lương:</strong>
                      </td>
                      <td>{formatSalary(job.salaryMin, job.salaryMax)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Ngày đăng:</strong>
                      </td>
                      <td>{formatDate(job.postedDate)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Mô tả:</strong>
                      </td>
                      <td>{job.description || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Yêu cầu:</strong>
                      </td>
                      <td>{job.jobRequired || 'N/A'}</td>
                    </tr>
                  </tbody>
                </Table>
              ) : (
                <div className="text-danger">Không thể tải thông tin công việc.</div>
              )}
            </Card.Text>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default JobApplicationForm;