package com.myweb.controllers;

import com.myweb.pojo.Company;
import com.myweb.pojo.Job;
import com.myweb.pojo.Major;
import com.myweb.pojo.MajorJob;
import com.myweb.pojo.Day;
import com.myweb.pojo.DayJob;
import com.myweb.services.CompanyService;
import com.myweb.services.DayService;
import com.myweb.services.JobService;
import com.myweb.services.MajorService;
import com.myweb.utils.StringUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class JobController {

    @Autowired
    private JobService jobService;
    @Autowired
    private MajorService majorService;
    @Autowired
    private DayService dayService;
    @Autowired
    private CompanyService companyService;
    
    @Value("${heremap.api.key}")
    private String hereMapApiKey;

    // Lấy danh sách công việc với bộ lọc và phân trang
    @GetMapping("/jobs")
    public String listJobs(Model model, @RequestParam Map<String, String> params) {
        Map<String, Object> result = jobService.searchJobs(params);
        model.addAttribute("jobs", result.get("jobs"));
        model.addAttribute("currentPage", result.get("currentPage"));
        model.addAttribute("pageSize", result.get("pageSize"));
        model.addAttribute("totalPages", result.get("totalPages"));
        model.addAttribute("totalItems", result.get("totalItems"));
        model.addAttribute("headCols", List.of("", "Tên công việc", "Công ty", "Lương", "Thành phố", "Ngành nghề", "Thời gian làm việc", "Ngày đăng", "Hành động"));
        model.addAttribute("majors", majorService.getMajors());
        model.addAttribute("days", dayService.getDays());

        // Thêm các tham số bộ lọc vào model để sử dụng trong template
        model.addAttribute("keyword", params.get("keyword"));
        model.addAttribute("selectedMajorId", params.get("majorId"));
        model.addAttribute("salaryMin", params.get("salaryMin"));
        model.addAttribute("salaryMax", params.get("salaryMax"));
        model.addAttribute("city", params.get("city"));
        model.addAttribute("district", params.get("district"));
        model.addAttribute("fullAddress", params.get("fullAddress"));
        model.addAttribute("selectedDayId", params.get("dayId"));
        model.addAttribute("status", params.get("status"));
        return "job";
    }

    // Hiển thị chi tiết công việc theo ID
    @GetMapping("/jobs/{id}")
    public String jobDetail(@PathVariable("id") int id, Model model) {
        Job job = jobService.getOnlyJobById(id); // Sử dụng getOnlyJobById để lấy cả job ở trạng thái pending
        if (job == null) {
            model.addAttribute("errorMessage", "Công việc không tồn tại.");
        }
        model.addAttribute("job", job);
        model.addAttribute("majors", majorService.getMajors());
        model.addAttribute("days", dayService.getDays());
        model.addAttribute("companies", companyService.getAllCompaniesForDropdown());
        model.addAttribute("selectedCity", job != null ? job.getCity() : "");
        model.addAttribute("selectedDistrict", job != null ? job.getDistrict() : "");
        model.addAttribute("hereMapApiKey", hereMapApiKey);
        return "job-detail";
    }

    // Hiển thị form tạo công việc mới
    @GetMapping("/jobs/create-job")
    public String createJobView(Model model) {
        model.addAttribute("jobDTO", new com.myweb.dto.CreateJobDTO());
        model.addAttribute("majors", majorService.getMajors());
        model.addAttribute("days", dayService.getDays());
        model.addAttribute("companies", companyService.getAllCompaniesForDropdown());
        model.addAttribute("hereMapApiKey", hereMapApiKey);
        return "create-job";
    }

    // Xử lý tạo công việc mới
    @PostMapping("/jobs")
    public String createJob(@Valid @ModelAttribute("jobDTO") com.myweb.dto.CreateJobDTO jobDTO, BindingResult result, Model model, RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("majors", majorService.getMajors());
            model.addAttribute("days", dayService.getDays());
            model.addAttribute("companies", companyService.getAllCompaniesForDropdown());
            return "create-job";
        }
        jobService.addJob(jobDTO);
        redirectAttributes.addFlashAttribute("successMessage", "Tạo công việc thành công!");
        return "redirect:/jobs";
    }

    // Xử lý xóa nhiều công việc
    @PostMapping("/jobs/delete")
    public String deleteJobs(@RequestParam("jobIds") List<Integer> jobIds, Model model) {
        for (Integer jobId : jobIds) {
            jobService.deleteJob(jobId);
        }
        return "redirect:/jobs";
    }

    // Xử lý cập nhật công việc
    @PostMapping("/jobs/{jobId}/update")
    public String updateJob(
            @PathVariable("jobId") int jobId,
            @ModelAttribute("job") @Valid Job job,
            BindingResult result,
            @RequestParam(value = "majorId", required = false) Integer majorId,
            @RequestParam(value = "dayIds", required = false) List<Integer> dayIds,
            @RequestParam(value = "city", required = true) String city,
            @RequestParam(value = "district", required = true) String district,
            @RequestParam(value = "fullAddress", required = true) String fullAddress,
            @RequestParam(value = "longitude", required = false) Double longitude,
            @RequestParam(value = "latitude", required = false) Double latitude,
            RedirectAttributes redirectAttributes) {

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Vui lòng kiểm tra lại các trường dữ liệu.");
            return "redirect:/jobs/" + jobId;
        }

        Job existingJob = jobService.getOnlyJobById(jobId);
        if (existingJob == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Công việc không tồn tại.");
            return "redirect:/jobs/" + jobId;
        }

        // Cập nhật các trường từ đối tượng job
        existingJob.setJobName(job.getJobName());
        Company company = companyService.getCompany(job.getCompanyId().getId());
        if (company == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Công ty không tồn tại.");
            return "redirect:/jobs/" + jobId;
        }
        existingJob.setCompanyId(company);
        existingJob.setFullAddress(fullAddress); 
        existingJob.setCity(StringUtils.normalizeLocation(city)); 
        existingJob.setDistrict(StringUtils.normalizeLocation(district));
        existingJob.setLongitude(longitude);
        existingJob.setLatitude(latitude);
        existingJob.setSalaryMin(job.getSalaryMin());
        existingJob.setSalaryMax(job.getSalaryMax());
        existingJob.setDescription(job.getDescription());
        existingJob.setJobRequired(job.getJobRequired());
        existingJob.setAgeFrom(job.getAgeFrom());
        existingJob.setAgeTo(job.getAgeTo());
        existingJob.setExperienceRequired(job.getExperienceRequired());
        existingJob.setStatus(job.getStatus());
        existingJob.setIsActive(job.getIsActive());
        existingJob.setPostedDate(new Date());

        // Xử lý MajorJob
        jobService.deleteMajorJobsByJobId(jobId);
        Collection<MajorJob> majorJobs = new ArrayList<>();
        if (majorId != null) {
            Major major = majorService.getMajorById(majorId);
            if (major != null) {
                MajorJob majorJob = new MajorJob();
                majorJob.setJobId(existingJob);
                majorJob.setMajorId(major);
                majorJobs.add(majorJob);
            }
        }
        existingJob.setMajorJobCollection(majorJobs);

        // Xử lý DayJob
        jobService.deleteDayJobsByJobId(jobId);
        Collection<DayJob> dayJobs = new ArrayList<>();
        if (dayIds != null) {
            for (Integer dayId : dayIds) {
                Day day = dayService.getDayById(dayId);
                if (day != null) {
                    DayJob dayJob = new DayJob();
                    dayJob.setJobId(existingJob);
                    dayJob.setDayId(day);
                    dayJobs.add(dayJob);
                }
            }
        }
        existingJob.setDayJobCollection(dayJobs);

        jobService.addOrUpdateJob(existingJob);
        redirectAttributes.addFlashAttribute("successMessage", "Cập nhật công việc thành công!");
        return "redirect:/jobs/" + jobId;
    }
}