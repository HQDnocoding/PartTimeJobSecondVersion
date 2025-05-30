/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.pojo.Application;
import com.myweb.pojo.Candidate;
import com.myweb.pojo.Job;
import com.myweb.services.ApplicationService;
import com.myweb.services.CandidateService;
import com.myweb.services.EmailService;
import com.myweb.services.JobService;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author huaquangdat
 */
@Controller
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private CandidateService candidateService;

    @Autowired
    private JobService jobService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/applications")
    public String applicationView(Model model, @RequestParam Map<String, String> params, Principal principal) {
        // Định nghĩa tiêu đề cột cho bảng
        Collection<String> headCols = new ArrayList<>(List.of(
                "STT", "Ứng viên", "Ngày ứng tuyển", "Trạng thái", "Công việc"
        ));

        Map<String, Object> result = applicationService.getListApplication(params, principal);

        model.addAttribute("applications", result.get("applications"));
        model.addAttribute("currentPage", result.get("currentPage"));
        System.out.println("crrent" + result.get("currentPage"));
        model.addAttribute("pageSize", result.get("pageSize"));
        model.addAttribute("totalPages", result.get("totalPages"));
        model.addAttribute("totalItems", result.get("totalItems"));
        model.addAttribute("headCols", headCols);

        // Thêm các tham số bộ lọc vào model để giữ trạng thái
//        model.addAttribute("status", params.get("status"));
//        model.addAttribute("candidateName", params.get("candidateName"));
//        model.addAttribute("jobName", params.get("jobName"));
        model.addAttribute("page", result.get("currentPage"));

        return "application";
    }

    @GetMapping("/applications/{id}")
    public String applicationDetailView(Model model, @PathVariable("id") int id) {
        System.out.println("id" + id);
        Application application = this.applicationService.getApplicationById(id);

        if (application == null) {
            model.addAttribute("error", "Không tìm thấy đơn ứng tuyển với ID: " + id);
            return "application-detail";
        }

        System.out.println(application.getStatus());
        System.out.println("Candidate: " + application.getCandidateId());
        System.out.println("Job: " + application.getJobId());

        model.addAttribute("appli", application);

        List<Candidate> candidateList = this.candidateService.getCandidateList();
        List<Job> jobList = this.jobService.getJobList();

        Map<String, Object> data = new HashMap<>();
        data.put("candidates", candidateList);
        data.put("jobs", jobList);
        model.addAllAttributes(data);
        return "application-detail";
    }

    @GetMapping("/applications/create-application")
    public String createApplicationView(Model model) {
        List<Candidate> candidateList = this.candidateService.getCandidateList();
        List<Job> jobList = this.jobService.getJobList();
        Map<String, Object> data = new HashMap<>();
        data.put("application", new Application());
        data.put("candidates", candidateList);
        data.put("jobs", jobList);
        model.addAllAttributes(data);
        return "create-application";
    }

    @PostMapping("/applications")
    public String createApplication(Model model, @ModelAttribute(value = "application") Application application) {
        try {
            Application app = this.applicationService.addApplication(application);
            return "redirect:/applications/" + app.getId();
        } catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "forward:/applications/create-application";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Đã có lỗi xảy ra, vui lòng thử lại.");
            return "forward:/applications/create-application";
        }
    }

    @PostMapping("/applications/{appliId}/update")
    public String updateCompany(Model model, @PathVariable("appliId") int id, @ModelAttribute(value = "appli") Application app) {
        try {
            Application updatedApp = this.applicationService.addOrUpdateApplication(app);
            System.out.println("jobname " + updatedApp.getCandidateId().getUserId().getUsername() + "congy " + updatedApp.getJobId().getCompanyId().getName());
            if (updatedApp != null) {
                try {
                    String subject = "Chào mừng bạn đến với hệ thống tìm kiếm việc làm bán thời gian!";
                    String body = String.format(
                            "Chào bạn"
                            + "Hồ sơ ứng tuyển cho công việc %s tại công ty %s đã được cập nhật. Hãy truy cập hồ sơ để xem.\n",
                            updatedApp.getJobId().getJobName(), updatedApp.getJobId().getCompanyId().getName()
                    );
                    emailService.sendEmail(updatedApp.getCandidateId().getUserId().getUsername(), subject, body);
                } catch (DataIntegrityViolationException e) {
                    throw new IllegalArgumentException("Dữ liệu không hợp lệ, vui lòng kiểm tra lại thông tin.");
                }
            }
            return "redirect:/applications/" + id;
        } catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "redirect:/applications/" + id;
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Đã có lỗi xảy ra, vui lòng thử lại.");
            return "redirect:/applications/" + id;
        }
    }
}
