import axios from "axios";
import cookie from "react-cookies";

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8080/JobHome/api/';
const AI_URL = "http://localhost:3001/proxy/openrouter";
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY || "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";
const REFERER_URL = process.env.REACT_APP_REFERER_URL || 'http://localhost:3000/';

export const endpoints = {
    'login': "/login",
    'googleLogin': "/google-login",
    'requestOTP': "/request-otp",
    'requestPhoneOTP': "/secure/request-otp-phone",
    'infor': '/secure/profile',
    'companyJobs': '/secure/company/jobs',
    'updateCandidate': (id) => `/secure/candidates/${id}`,
    'registerCandidate': '/register-candidate',
    'registerCompany': '/register-company',
    'majors': '/majors',
    'days': '/days',
    'createJob': '/secure/jobs',
    'jobDetail': (id) => `/jobs/${id}`,
    'sendApplication': `/secure/applications`,
    'getApplications': '/secure/applications',
    'companyGetJob': '/secure/jobs',
    'updateStatusApplication': '/secure/applications/update-status',
    'getApplicationDetail': (id) => `/secure/applications/${id}`,
    'getDetailCompany': (id) => `/companies/${id}`,
    'getJobsForCompany': (id) => `/companies/${id}/jobs`,
    'getUserIdFromCompanyId': (id) => `/companies/${id}/id-role`,
    'getCompanyByUserId': (id) => `/secure/companies/${id}/infor-by-userId`,
    'getCandidateByUserId': (id) => `/secure/candidates/${id}/infor-by-userId`,
    'jobs': '/jobs',
    'jobDetail': (id) => `/jobs/${id}`,
    'followCompany': (id) => `/secure/follow/${id}`,
    'unfollowCompany': (id) => `/secure/unfollow/${id}`,
    'isFollowing': (id) => `/secure/is-following/${id}`,
    'companies': '/companies',
    'companyDetail': (id) => `/companies/${id}`,
    'deleteJob': (id) => `/secure/jobs/${id}`,
    'followCompany': (id) => `/secure/follow/${id}`,
    'unfollowCompany': (id) => `/secure/unfollow/${id}`,
    'isFollowing': (id) => `/secure/is-following/${id}`,
    'followedCompanies': '/secure/followed-companies', 
    'followers': (id) => `/followers/${id}`,
};

export const authApis = () => {
    const token = cookie.load('token');
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            "Authorization": token ? `Bearer ${token}` : ""
        }
    });
};

export const authApisData = () => {
    const token = cookie.load('token');
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const apisAI = () => {
    return axios.create({
        baseURL: AI_URL,
        timeout: 50000,
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "X-Title": "JobHome",
            "HTTP-Referer": REFERER_URL,
        }
    });
};

export default axios.create({
    baseURL: BASE_URL
});
