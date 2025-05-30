import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Spinner } from 'react-bootstrap';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/Contexts';
import JobInfoForm from './JobFormInfor';
import SalaryInfor from './SalaryInfor';
import DescriptionForm from './DescriptionForm';
import AddressForm from './AddressForm';
import RequirementsForm from './RequirementsForm';
import SubmitButton from './SubmitButton';
import './createJob.scss';

const JobForm = () => {
    const user = useContext(MyUserContext);
    const navigate = useNavigate();
    const errorRef = useRef(null);

    const [inputValues, setInputValues] = useState({
        jobName: '',
        companyId: user?.company?.id || null,
        salaryMin: '',
        salaryMax: '',
        majorId: '',
        dayIds: [],
        description: '',
        jobRequired: '',
        fullAddress: '',
        city: '',
        district: '',
        longitude: '',
        latitude: '',
        ageFrom: '',
        ageTo: '',
        experienceRequired: '',
    });
    const [errors, setErrors] = useState([]);
    const [majors, setMajors] = useState([]);
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(false);

    // Lấy dữ liệu ban đầu
    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const [majorsRes, daysRes] = await Promise.all([
                APIs.get(endpoints['majors']),
                APIs.get(endpoints['days']),
            ]);
            setMajors(majorsRes.data);
            setDays(daysRes.data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // Kiểm tra dữ liệu
    const validateForm = useMemo(
        () => () => {
            const validationErrors = [];
            if (!inputValues.jobName) validationErrors.push('Tên công việc là bắt buộc.');
            if (!inputValues.companyId) validationErrors.push('Công ty là bắt buộc.');
            if (!inputValues.salaryMin) {
                validationErrors.push('Lương tối thiểu là bắt buộc.');
            } else if (isNaN(inputValues.salaryMin) || parseInt(inputValues.salaryMin) <= 0) {
                validationErrors.push('Lương tối thiểu phải là số dương.');
            }
            if (!inputValues.salaryMax) {
                validationErrors.push('Lương tối đa là bắt buộc.');
            } else if (isNaN(inputValues.salaryMax) || parseInt(inputValues.salaryMax) <= 0) {
                validationErrors.push('Lương tối đa phải là số dương.');
            } else if (parseInt(inputValues.salaryMax) < parseInt(inputValues.salaryMin)) {
                validationErrors.push('Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu.');
            }
            if (!inputValues.majorId) validationErrors.push('Ngành nghề là bắt buộc.');
            if (inputValues.dayIds.length === 0) validationErrors.push('Phải chọn ít nhất một thời gian làm việc.');
            if (!inputValues.description) validationErrors.push('Mô tả công việc là bắt buộc.');
            if (!inputValues.jobRequired) validationErrors.push('Yêu cầu công việc là bắt buộc.');
            if (!inputValues.fullAddress) validationErrors.push('Địa chỉ làm việc là bắt buộc.');
            if (!inputValues.city) validationErrors.push('Tỉnh/Thành phố là bắt buộc.');
            if (!inputValues.district) validationErrors.push('Quận/Huyện là bắt buộc.');
            if (!inputValues.longitude) validationErrors.push('Kinh độ là bắt buộc.');
            if (!inputValues.latitude) validationErrors.push('Vĩ độ là bắt buộc.');
            if (!inputValues.ageFrom) {
                validationErrors.push('Độ tuổi tối thiểu là bắt buộc.');
            } else if (isNaN(inputValues.ageFrom) || parseInt(inputValues.ageFrom) < 16) {
                validationErrors.push('Độ tuổi tối thiểu phải từ 16 trở lên.');
            }
            if (!inputValues.ageTo) {
                validationErrors.push('Độ tuổi tối đa là bắt buộc.');
            } else if (isNaN(inputValues.ageTo) || parseInt(inputValues.ageTo) < parseInt(inputValues.ageFrom)) {
                validationErrors.push('Độ tuổi tối đa phải lớn hơn hoặc bằng độ tuổi tối thiểu.');
            } else if (parseInt(inputValues.ageTo) > 100) {
                validationErrors.push('Độ tuổi tối đa không được vượt quá 100.');
            }
            if (!inputValues.experienceRequired) {
                validationErrors.push('Số năm kinh nghiệm là bắt buộc.');
            } else if (isNaN(inputValues.experienceRequired) || parseInt(inputValues.experienceRequired) < 0) {
                validationErrors.push('Số năm kinh nghiệm phải là số không âm.');
            }
            return validationErrors;
        },
        [inputValues]
    );

    // Xử lý thay đổi input
    const handleChange = useCallback((name, value) => {
        setInputValues((prev) => ({ ...prev, [name]: value }));
        setErrors([]);
    }, []);

    // Xử lý chọn ngày làm việc
    const handleDayChange = useCallback((dayId) => {
        setInputValues((prev) => {
            const dayIds = prev.dayIds.includes(dayId)
                ? prev.dayIds.filter((id) => id !== dayId)
                : [...prev.dayIds, dayId];
            return { ...prev, dayIds };
        });
        setErrors([]);
    }, []);

    // Xử lý chọn địa chỉ
    const handleAddressSelect = useCallback((addressData) => {
        console.log('Dữ liệu địa chỉ:', addressData);
        setInputValues((prev) => ({
            ...prev,
            fullAddress: addressData.address || '',
            longitude: addressData.coordinates[0] || '',
            latitude: addressData.coordinates[1] || '',
            district: addressData.district || '',
            city: addressData.city || '',
        }));
        setErrors([]);
    }, []);

    // Xử lý gửi form
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setErrors([]);

            const validationErrors = validateForm();
            if (validationErrors.length > 0) {
                setErrors(validationErrors);
                errorRef.current?.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            if (!window.confirm('Bạn có chắc muốn tạo tin tuyển dụng này?')) {
                return;
            }

            setLoading(true);
            try {
                const jobData = {
                    ...inputValues,
                    salaryMin: parseInt(inputValues.salaryMin),
                    salaryMax: parseInt(inputValues.salaryMax),
                    ageFrom: parseInt(inputValues.ageFrom),
                    ageTo: parseInt(inputValues.ageTo),
                    experienceRequired: parseInt(inputValues.experienceRequired),
                };

                console.log('Dữ liệu gửi:', jobData);

                const formData = new FormData();
                Object.entries(jobData).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach((item) => formData.append(`${key}[]`, item));
                    } else if (value) {
                        formData.append(key, value);
                    }
                });

                await authApis().post(endpoints['createJob'], formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                toast.success('Tạo tin tuyển dụng thành công!');
                navigate('/jobs');
            } catch (err) {
                const errorMessages = ['Tạo tin tuyển dụng thất bại. Vui lòng thử lại.'];
                if (err.response?.data?.message) {
                    errorMessages.push(err.response.data.message);
                }
                setErrors(errorMessages);
                errorRef.current?.scrollIntoView({ behavior: 'smooth' });
                console.error('Lỗi khi tạo tin:', err);
            } finally {
                setLoading(false);
            }
        },
        [inputValues, validateForm, navigate]
    );

    return (
        <Container fluid className="create-job-container py-4">
            <h2 className="mb-4">Tạo Tin Tuyển Dụng</h2>
            {loading && (
                <div className="text-center mb-3">
                    <Spinner animation="border" />
                </div>
            )}
            {errors.length > 0 && (
                <Card className="mb-3 border-danger">
                    <Card.Body ref={errorRef}>
                        {errors.map((error, index) => (
                            <div key={index} className="text-danger">
                                {error}
                            </div>
                        ))}
                    </Card.Body>
                </Card>
            )}
            <JobInfoForm
                inputValues={inputValues}
                majors={majors}
                days={days}
                errors={errors}
                loading={loading}
                onChange={handleChange}
                onDayChange={handleDayChange}
            />
            <SalaryInfor
                inputValues={inputValues}
                errors={errors}
                loading={loading}
                onChange={handleChange}
            />
            <DescriptionForm
                inputValues={inputValues}
                errors={errors}
                loading={loading}
                onChange={handleChange}
            />
            <AddressForm
                errors={errors}
                loading={loading}
                onAddressSelect={handleAddressSelect}
            />
            <RequirementsForm
                inputValues={inputValues}
                errors={errors}
                loading={loading}
                onChange={handleChange}
            />
            <SubmitButton loading={loading} onSubmit={handleSubmit} />
        </Container>
    );
};

export default JobForm;