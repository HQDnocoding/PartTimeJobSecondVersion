import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import cookie from 'react-cookies';
import { MyDispatchContext, MyUserContext } from '../../configs/Contexts';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import { GoogleLogin } from '@react-oauth/google';
import './login.scss';

const Login = () => {
    const u = useContext(MyUserContext);
    const [user, setUser] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useContext(MyDispatchContext);
    const [q] = useSearchParams();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
        setError(null);
    };

    const login = async (e) => {
        e.preventDefault();

        if (!user.username || !user.password) {
            setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
            toast.error('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log("username", user.username);
            console.log("pw", user.password);



            const res = await APIs.post(endpoints['login'], {
                username: user.username,
                clientPassword: user.password,
            });

            cookie.save('token', res.data.token);

            const userData = await authApis().get(endpoints['infor']);
            cookie.save('user', userData.data);

            console.log("User Info:", userData.data);

            dispatch({
                type: 'login',
                payload: userData.data,
            });

            const role = userData.data.role;
            let next = q.get('next');
            if (role === 'ROLE_COMPANY' || role === 'ROLE_CANDIDATE') {
                navigate(next ? next : '/');
            } else {
                navigate(next ? next : '/');
            }
        } catch (ex) {
            if (ex.response) {
                console.log(ex.response);
                
                const status = ex.response.status;
                const errorMessage = ex.response.data?.error || 'Đăng nhập thất bại. Vui lòng thử lại.';
                if (status !== 200) {
                    toast.error(errorMessage);
                    setError(errorMessage)
                } else {
                    setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
                    toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
                }
            } else {
                setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
                toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            }
            console.error('Login error:', ex);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            setLoading(true);
            setError(null);

            const res = await APIs.post(endpoints['googleLogin'], {
                idToken: credentialResponse.credential,
            });

            cookie.save('token', res.data.token);
            const userData = await authApis().get(endpoints['infor']);
            cookie.save('user', userData.data);

            console.log("Google User Info:", userData.data);

            dispatch({
                type: 'login',
                payload: userData.data,
            });

            const role = userData.data.role;
            let next = q.get('next');
            if (role === 'ROLE_COMPANY' || role === 'ROLE_CANDIDATE') {
                navigate(next ? next : '/');
            } else {
                navigate(next ? next : '/');
            }
        } catch (ex) {
            if (ex.response) {
                const status = ex.response.status;
                const errorMessage = ex.response.data?.error || 'Đăng nhập Google thất bại. Vui lòng thử lại.';
                toast.error(errorMessage);
            } else {
                setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
                toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            }
            console.error('Google login error:', ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (u) {
            navigate("/");
        }
    }, [u, navigate]);

    return (
        <div className="container-fluid page-body-wrapper full-page-wrapper">
            <div className="content-wrapper d-flex align-items-center auth px-0">
                <div className="row w-100 mx-0">
                    <div className="col-lg-4 mx-auto">
                        <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                            <div className="brand-logo">
                                <img src="/assets/img/logo/logo.png" alt="logo" />
                            </div>
                            <h4>Chào bạn! Tham gia ứng tuyển ngay</h4>
                            <h6 className="font-weight-light">Đăng nhập để tiếp tục.</h6>
                            <form className="pt-3" onSubmit={login}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="username"
                                        value={user.username}
                                        onChange={handleChange}
                                        className="form-control form-control-lg"
                                        placeholder="Tên đăng nhập"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="password"
                                        value={user.password}
                                        onChange={handleChange}
                                        className="form-control form-control-lg"
                                        placeholder="Mật khẩu"
                                        disabled={loading}
                                    />
                                </div>
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                <div className="mt-3">
                                    <button
                                        type="submit"
                                        className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Đang đăng nhập...
                                            </>
                                        ) : (
                                            'Đăng nhập'
                                        )}
                                    </button>
                                </div>
                                <div className="my-2 d-flex justify-content-between align-items-center">
                                    <div className="form-check">
                                        <label className="form-check-label text-muted">
                                            <input type="checkbox" className="form-check-input" />
                                            Nhớ tài khoản
                                        </label>
                                    </div>
                                    <Link to="/forget-password" className="auth-link" style={{ color: 'blue' }}>
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </form>
                            <div className="text-center mt-4">
                                <GoogleLogin
                                    clien
                                    onSuccess={handleGoogleLogin}
                                    onError={() => {
                                        setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
                                        toast.error('Đăng nhập Google thất bại. Vui lòng thử lại.');
                                    }}
                                    text="signin_with"
                                    width="100%"
                                />
                            </div>
                            <div className="text-center mt-4 font-weight-light">
                                Không có tài khoản?{' '}
                                <Link to="/register" className="text-primary">
                                    Tạo ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;