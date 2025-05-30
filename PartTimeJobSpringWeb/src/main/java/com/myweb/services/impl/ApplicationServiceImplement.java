/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services.impl;

import com.cloudinary.Cloudinary;
import com.myweb.dto.CreateApplicationDTO;
import com.myweb.pojo.Application;
import com.myweb.pojo.Candidate;
import com.myweb.pojo.Job;
import com.myweb.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;

import com.myweb.repositories.ApplicationRepository;
import com.myweb.repositories.CandidateRepository;
import com.myweb.repositories.JobRepository;
import com.myweb.repositories.UserRepository;
import com.myweb.services.ApplicationService;
import com.myweb.utils.GeneralUtils;
import java.security.Principal;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import org.springframework.stereotype.Service;

/**
 *
 * @author huaquangdat
 */
@Service
public class ApplicationServiceImplement implements ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private UserRepository userRepo;

    // Thêm mới hoặc cập nhật một đơn ứng tuyển
    public Application addOrUpdateApplication(Application a) {
        if (a.getId() != null) {
            if (a.getCurriculumVitaeFile() != null && !a.getCurriculumVitaeFile().isEmpty()) {
                a.setCurriculumVitae(GeneralUtils.uploadFileToCloud(cloudinary, a.getCurriculumVitaeFile()));
            }
        }
        return applicationRepository.addOrUpdateApplication(a);
    }

    // Lấy danh sách đơn ứng tuyển với các tiêu chí lọc và phân trang
    public Map<String, Object> getListApplication(Map<String, String> params, Principal principal) {
        User user = this.userRepo.getUserByUsername(principal.getName());
        return applicationRepository.getListApplication(params, user);
    }

    // Lấy chi tiết một đơn ứng tuyển theo ID
    public Application getApplicationById(int applicationId) {
        return applicationRepository.getApplicationById(applicationId);
    }

    // Xóa một đơn ứng tuyển theo ID
    @Override
    public void deleteApplication(int id) {
        this.applicationRepository.deleteApplication(id);
    }

    // Thêm mới một đơn ứng tuyển, xử lý tải CV lên Cloudinary và thiết lập trạng thái/ngày nộp
    @Override
    public Application addApplication(Application application) {

        if (application.getCurriculumVitaeFile() != null && !application.getCurriculumVitaeFile().isEmpty()) {
            application.setCurriculumVitae(GeneralUtils.uploadFileToCloud(cloudinary, application.getCurriculumVitaeFile()));
        }
        application.setStatus(GeneralUtils.Status.pending.toString());
        application.setAppliedDate(new Date());
        try {
            return this.applicationRepository.addOrUpdateApplication(application);
        } catch (Exception e) {
            throw new IllegalArgumentException("Dữ liệu không hợp lệ, vui lòng kiểm tra lại thông tin.");

        }
    }

    @Override
    public Application addApplicationDto(CreateApplicationDTO dto) {
        Application application = new Application();
        Candidate candidate = this.candidateRepository.getCandidateById(dto.getCandidateId());
        Job job = this.jobRepository.getJobById(dto.getJobId());
        System.out.println(dto.getJobId() + "ferfre");
        application.setCandidateId(candidate);
        application.setJobId(job);

        if (dto.getCurriculumVitae() != null && !dto.getCurriculumVitae().isEmpty()) {
            application.setCurriculumVitae(GeneralUtils.uploadFileToCloud(cloudinary, dto.getCurriculumVitae()));
        } else {
            application.setCurriculumVitae(candidate.getCurriculumVitae());
        }
        application.setStatus(GeneralUtils.Status.pending.toString());
        application.setAppliedDate(new Date());
        try {
            return this.applicationRepository.addOrUpdateApplication(application);
        } catch (Exception e) {
            throw new IllegalArgumentException("Dữ liệu không hợp lệ, vui lòng kiểm tra lại thông tin.");

        }
    }

    @Override
    public Application updateStatus(Application application, String username) {
        System.out.println("ussernam" + username);
        try {
            User user = this.userRepo.getUserByUsername(username);
//            System.out.println(String.format("companyId %s, appcom %s, %s", user.getCompany().getId(), application.getJobId().getCompanyId().getId(), application.getStatus()));
            Application updateApplication = this.applicationRepository.getApplicationById(application.getId());
            if (Objects.equals(user.getCompany().getId(), updateApplication.getJobId().getCompanyId().getId())) {
                updateApplication.setStatus(application.getStatus());
                return this.applicationRepository.addOrUpdateApplication(updateApplication);
            }
            return null;
        } catch (Exception e) {
            return null;
        }

    }

    @Override
    public Application getApplicationDetailById(int id, String username) {
        User user = this.userRepo.getUserByUsername(username);
        Application application = this.applicationRepository.getApplicationById(id);
        if (Objects.equals(user.getCompany().getId(), application.getJobId().getCompanyId().getId())
                || Objects.equals(user.getCandidate().getId(), application.getCandidateId().getId())) {
            return application;
        }
        return null;
    }

}
