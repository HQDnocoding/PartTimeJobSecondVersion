/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services.impl;

import com.myweb.dto.CreateJobDTO;
import com.myweb.dto.GetJobDTO;
import com.myweb.pojo.Candidate;
import com.myweb.pojo.Company;
import com.myweb.pojo.DayJob;
import com.myweb.pojo.Follow;
import com.myweb.pojo.Job;
import com.myweb.pojo.Major;
import com.myweb.pojo.MajorJob;
import com.myweb.pojo.User;
import com.myweb.repositories.CompanyRepository;
import com.myweb.repositories.DayRepository;
import com.myweb.repositories.FollowRepository;
import com.myweb.repositories.JobRepository;
import com.myweb.repositories.MajorRepository;
import com.myweb.repositories.UserRepository;
import com.myweb.services.EmailService;
import com.myweb.services.JobService;
import com.myweb.utils.StringUtils;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@Service
public class JobServiceImplement implements JobService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private MajorRepository majorRepository;

    @Autowired
    private DayRepository dayRepository;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private EmailService emailService;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> searchJobs(Map<String, String> params) {
        Map<String, Object> result = jobRepository.searchJobs(params);
        List<Job> jobs = (List<Job>) result.get("jobs");
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getListJobByMajor(int majorId) {
        List<Job> jobs = jobRepository.getListJobByMajor(majorId);
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    @Transactional(readOnly = true)
    public Job getJobById(int jobId) {
        Job job = jobRepository.getJobById(jobId);
        Hibernate.initialize(job.getMajorJobCollection());
        Hibernate.initialize(job.getDayJobCollection());
        return job;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getListJobByRecommend(int majorId, int cityId) {
        List<Job> jobs = jobRepository.getListJobByRecommend(majorId, cityId);
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getListJobByCompanyId(int companyId) {
        List<Job> jobs = jobRepository.getListJobByCompanyId(companyId);
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getListJobByCompanyExceptCurrentJob(int companyId, int jobId) {
        List<Job> jobs = jobRepository.getListJobByCompanyExceptCurrentJob(companyId, jobId);
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    @Transactional(readOnly = true)
    public Job getNameJob(int jobId) {
        Job job = jobRepository.getNameJob(jobId);
        Hibernate.initialize(job.getMajorJobCollection());
        Hibernate.initialize(job.getDayJobCollection());
        return job;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getListJobByCandidate(int candidateId) {
        List<Job> jobs = jobRepository.getListJobByCandidate(candidateId);
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getListJobByCheckAdmin() {
        List<Job> jobs = jobRepository.getListJobByCheckAdmin();
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getListJobByMajorAndCity(int majorId, String city, String kw) {
        List<Job> jobs = jobRepository.getListJobByMajorAndCity(majorId, city, kw);
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getListJobForManageCompany(int companyId) {
        List<Job> jobs = jobRepository.getListJobForManageCompany(companyId);
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    public void updateJob(int jobId) {
        jobRepository.updateJob(jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getListJobByCityKw(String city, String kw) {
        List<Job> jobs = jobRepository.getListJobByCityKw(city, kw);
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getListJobByCityKwPage(String city, String kw, int page) {
        List<Job> jobs = jobRepository.getListJobByCityKwPage(city, kw, page);
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    public Long countJob() {
        return jobRepository.countJob();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getListJobForManage() {
        List<Job> jobs = jobRepository.getListJobForManage();
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getAllJobs() {
        List<Job> jobs = (List<Job>) jobRepository.searchJobs(null).get("jobs");
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Job> getJobList() {
        List<Job> jobs = jobRepository.getListJobForManage();
        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }
        return jobs;
    }

    @Override
    @Transactional
    public GetJobDTO addJob(CreateJobDTO jobDTO) {
        Company company = companyRepository.getCompanyById(jobDTO.getCompanyId());
        Major major = majorRepository.getMajorById(jobDTO.getMajorId());

        Job job = new Job();
        job.setJobName(jobDTO.getJobName());
        job.setCompanyId(company);
        job.setSalaryMin(jobDTO.getSalaryMin());
        job.setSalaryMax(jobDTO.getSalaryMax());
        job.setAgeFrom(jobDTO.getAgeFrom());
        job.setAgeTo(jobDTO.getAgeTo());
        job.setExperienceRequired(jobDTO.getExperienceRequired());
        job.setFullAddress(jobDTO.getFullAddress());
        job.setCity(StringUtils.normalizeLocation(jobDTO.getCity()));
        job.setDistrict(StringUtils.normalizeLocation(jobDTO.getDistrict()));
        job.setLongitude(jobDTO.getLongitude());
        job.setLatitude(jobDTO.getLatitude());
        job.setDescription(jobDTO.getDescription());
        job.setJobRequired(jobDTO.getJobRequired());
        job.setStatus("pending");
        job.setIsActive(true);
        job.setPostedDate(new Date());

        MajorJob majorJob = new MajorJob();
        majorJob.setJobId(job);
        majorJob.setMajorId(major);
        job.setMajorJobCollection(new HashSet<>(List.of(majorJob)));

        job = jobRepository.addJob(job);
        jobRepository.addDaysToJob(job, jobDTO.getDayIds());
       // Gửi email thông báo đến các ứng viên đã follow công ty
        List<Follow> followers = followRepository.getFollowers(company.getId());
        for (Follow follow : followers) {
            Candidate candidate = follow.getCandidateId();
            String subject = "Công việc mới từ " + company.getName();
            String body = String.format(
                    "Chào %s,\n\n"
                    + "Công ty %s vừa đăng một công việc mới: %s\n"
                    + "Mô tả: %s\n"
                    + "Lương: %s - %s\n"
                    + "Địa điểm: %s, %s\n\n"
                    + "Xem chi tiết công việc tại: [Link đến công việc]\n"
                    + "Trân trọng,\nHệ thống tìm kiếm việc làm bán thời gian",
                    candidate.getFullName(),
                    company.getName(),
                    job.getJobName(),
                    job.getDescription().length() > 100 ? job.getDescription().substring(0, 100) + "..." : job.getDescription(),
                    job.getSalaryMin(),
                    job.getSalaryMax(),
                    job.getDistrict(),
                    job.getCity()
            );
            emailService.sendEmail(candidate.getUserId().getUsername(), subject, body);
        }

        return new GetJobDTO(job);
    }

    @Override
    public void deleteJob(int jobId) {
        jobRepository.deleteJob(jobId);
    }

    @Override
    public Job getOnlyJobById(int id) {
        return jobRepository.getOnlyJobById(id);
    }

    @Override
    public List<Job> getJobByAuthenticateCompany(Principal principal) {
        User user = userRepo.getUserByUsername(principal.getName());
        return jobRepository.getJobByAuthenticateCompany(user.getCompany().getId());
    }

    @Override
    @Transactional
    public Job addOrUpdateJob(Job job) {
        for (MajorJob majorJob : job.getMajorJobCollection()) {
            majorJob.setJobId(job);
        }
        for (DayJob dayJob : job.getDayJobCollection()) {
            dayJob.setJobId(job);
        }
        return jobRepository.addOrUpdateJob(job);
    }

    @Override
    @Transactional
    public void deleteMajorJobsByJobId(int jobId) {
        jobRepository.deleteMajorJobsByJobId(jobId);
    }

    @Override
    @Transactional
    public void deleteDayJobsByJobId(int jobId) {
        jobRepository.deleteDayJobsByJobId(jobId);
    }

    @Override
    public Map<String, Object> getCompanyJobs(Principal principal, Map<String, String> params) {
        User user = userRepo.getUserByUsername(principal.getName());
        if (user.getCompany() == null) {
            throw new IllegalStateException("Người dùng không phải là công ty");
        }
        int companyId = user.getCompany().getId();
        Map<String, String> effectiveParams = new HashMap<>(params != null ? params : new HashMap<>());
        effectiveParams.putIfAbsent("page", "1");
        effectiveParams.putIfAbsent("sort", "desc");
        Map<String, Object> result = jobRepository.getCompanyJobs(companyId, effectiveParams);
        List<Job> jobs = (List<Job>) result.get("jobs");
        return result;
    }
}
