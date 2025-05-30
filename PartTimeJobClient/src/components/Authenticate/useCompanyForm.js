import { useState } from 'react';
import { toast } from 'react-toastify';
import useValidatePassword from '../../utils/useValidatePassword';
import useValidateUsername from '../../utils/useValidateUsername';
import APIs, { endpoints } from '../../configs/APIs';

const useCompanyForm = (navigate, setCooldown) => {
  const [inputValues, setInputValues] = useState({
    name: '',
    taxCode: '',
    fullAddress: '',
    city: '',
    district: '',
    selfDescription: '',
    username: '',
    password: '',
    confirmPassword: '',
    files: [],
    avatarFile: '',
    otp: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errors, setErrors] = useState([]);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const maxOtpAttempts = 3;
  const { validate: validatePassword, error: passwordError } = useValidatePassword();
  const { validate: validateUsername, error: usernameError } = useValidateUsername();

  const validateTaxCode = (taxCode) => {
    const taxCodeRegex = /^\d{10}(\d{3})?$/; // Mã số thuế 10 hoặc 13 chữ số
    return taxCodeRegex.test(taxCode);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const validTypes = ['image/jpeg', 'image/png'];
      for (let file of files) {
        if (file.size > maxSize) {
          setErrors([`Hình ${file.name} vượt quá kích thước tối đa (5MB).`]);
          return;
        }
        if (!validTypes.includes(file.type)) {
          setErrors([`Hình ${file.name} không đúng định dạng (chỉ chấp nhận JPG, PNG).`]);
          return;
        }
      }
      setInputValues((prev) => ({
        ...prev,
        [name]: name === 'files' ? Array.from(files) : files[0],
        ...(name === 'username' && isOtpSent ? { otp: '' } : {}),
        ...(name === 'city' ? { district: '' } : {}),
      }));
    } else {
      setInputValues((prev) => ({
        ...prev,
        [name]: value,
        ...(name === 'username' && isOtpSent ? { otp: '' } : {}),
        ...(name === 'city' ? { district: '' } : {}),
      }));
    }
    if (name === 'username' && isOtpSent) {
      setIsOtpSent(false);
      setOtpAttempts(0);
    }
    setErrors([]);
  };

  const handleRemoveFile = (index) => {
    setInputValues((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
    setErrors([]);
  };

  const handleSendOtp = async () => {
    if (otpAttempts >= maxOtpAttempts) {
      setErrors(['Đã vượt quá số lần thử gửi OTP. Vui lòng thử lại sau vài phút.']);
      return;
    }
    if (!inputValues.username) {
      setErrors(['Vui lòng nhập email']);
      return;
    }
    setIsLoading(true);
    try {
      console.log('Sending OTP request to:', endpoints['requestOTP'], 'with email:', inputValues.username);
      await APIs.post(endpoints['requestOTP'], { email: inputValues.username }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setIsOtpSent(true);
      setOtpAttempts((prev) => prev + 1);
      setInputValues((prev) => ({ ...prev, otp: '' }));
      setCooldown(60); 
      toast.success(isOtpSent ? 'Đã gửi lại OTP thành công!' : 'Mã OTP đã được gửi đến email của bạn!');
    } catch (err) {
      console.error('OTP request failed:', err);
      const errorMsg = err.response?.data?.message || 'Không thể gửi OTP. Vui lòng thử lại.';
      setErrors([errorMsg]);
      setOtpAttempts((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const isUsernameValid = validateUsername(inputValues.username);
    const isPasswordValid = validatePassword(inputValues.password);
    const isTaxCodeValid = validateTaxCode(inputValues.taxCode);

    let validationErrors = [];
    if (!isUsernameValid && usernameError) {
      validationErrors.push(usernameError);
    }
    if (!isPasswordValid && passwordError) {
      validationErrors.push(passwordError);
    }
    if (!isTaxCodeValid) {
      validationErrors.push('Mã số thuế không hợp lệ (phải có 10 hoặc 13 chữ số).');
    }
    if (inputValues.password !== inputValues.confirmPassword) {
      validationErrors.push('Mật khẩu và xác nhận mật khẩu không khớp.');
    }
    if (!inputValues.avatarFile) {
      validationErrors.push('Bạn phải tải lên logo công ty.');
    }
    if (isOtpSent && !inputValues.otp.trim()) {
      validationErrors.push('Vui lòng nhập mã OTP.');
    }
    if (!inputValues.city) {
      validationErrors.push('Vui lòng chọn tỉnh/thành phố.');
    }
    if (!inputValues.district) {
      validationErrors.push('Vui lòng chọn quận/huyện.');
    }
    if (!inputValues.name) {
      validationErrors.push('Vui lòng nhập tên công ty.');
    }
    if (!inputValues.taxCode) {
      validationErrors.push('Vui lòng nhập mã số thuế.');
    }
    if (!inputValues.fullAddress) {
      validationErrors.push('Vui lòng nhập địa chỉ.');
    }
    if (inputValues.files.length < 3) {
      validationErrors.push('Vui lòng chọn ít nhất 3 hình ảnh công ty.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('name', inputValues.name);
    formData.append('taxCode', inputValues.taxCode);
    formData.append('fullAddress', inputValues.fullAddress);
    formData.append('city', inputValues.city);
    formData.append('district', inputValues.district);
    formData.append('selfDescription', inputValues.selfDescription || '');
    formData.append('username', inputValues.username);
    formData.append('password', inputValues.password);
    formData.append('otp', inputValues.otp);
    if (inputValues.avatarFile) {
      formData.append('avatarFile', inputValues.avatarFile);
    }
    if (inputValues.files && inputValues.files.length > 0) {
      inputValues.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    setIsLoading(true);
    try {
      const response = await APIs.post(endpoints['registerCompany'], formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message || 'Đăng ký thành công!');
      navigate('/login', { replace: true });
    } catch (err) {
      let errorMessages = ['Đăng ký thất bại!'];
      if (err.response?.data?.message) {
        errorMessages = [err.response.data.message];
      } else if (err.response?.data?.errors) {
        errorMessages = Object.entries(err.response.data.errors).map(([field, msg]) => `${field}: ${msg}`);
      } else {
        errorMessages = ['Lỗi không xác định. Vui lòng thử lại sau.'];
      }
      setErrors(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return { inputValues, errors, isLoading, isOtpSent, handleChange, handleSendOtp, handleSubmit, handleRemoveFile };
};

export default useCompanyForm;