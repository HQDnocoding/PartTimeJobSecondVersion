/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.dto.CreateApplicationDTO;
import com.myweb.pojo.Application;
import com.myweb.services.ApplicationService;
import com.myweb.services.EmailService;
import com.myweb.services.UserService;
import com.myweb.utils.GeneralUtils;
import jakarta.ws.rs.ForbiddenException;
import java.security.Principal;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author huaquangdat
 */
@RestController
@Controller
@RequestMapping("/api")
public class ApiApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private EmailService emailService;

    @DeleteMapping("/admin/applications/{applicationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCompany(@PathVariable(value = "applicationId") int applicationId) {
        this.applicationService.deleteApplication(applicationId);
    }

    @PostMapping(path = "/secure/applications", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createApplication(CreateApplicationDTO dto) {
        System.out.println(String.format("%s, %s, %s, %s", dto.getCandidateId(), dto.getJobId(), dto.getCurriculumVitae(), dto.getMessage()));
        try {
            Object result = this.applicationService.addApplicationDto(dto);
            return new ResponseEntity<>(Map.of("message", "Đăng ký thành công", "data", result), HttpStatus.CREATED);
        } catch (IllegalArgumentException | NullPointerException e) {
            e.printStackTrace();
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(Map.of("message", "Tạo thất thất bại: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/secure/applications", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAppicationListForCompany(@RequestParam Map<String, String> params, Principal principal) {
        Map<String, Object> result = this.applicationService.getListApplication(params, principal);
        try {
            return new ResponseEntity<>(Map.of("message", "Lấy thông tin thành công", "data", result), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Lấy thông tin thất bại " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping(path = "/secure/applications/update-status", consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateStatusApplication(@RequestBody Application application, Principal p) {
        try {
            Application a = this.applicationService.updateStatus(application, p.getName());
            if (a != null) {
                try {
                    String subject = "Chào mừng bạn đến với hệ thống tìm kiếm việc làm bán thời gian!";
                    String body = String.format(
                            "Chào bạn"
                            + "Hồ sơ ứng tuyển cho công việc %s tại công ty %s đã được cập nhật. Hãy truy cập hồ sơ để xem.\n",
                            a.getJobId().getJobName(), a.getJobId().getCompanyId().getName()
                    );
                    emailService.sendEmail(a.getCandidateId().getUserId().getUsername(), subject, body);
                } catch (DataIntegrityViolationException e) {
                    throw new IllegalArgumentException("Dữ liệu không hợp lệ, vui lòng kiểm tra lại thông tin.");
                }
            }
            if (a != null) {
                return new ResponseEntity<>(Map.of("message", "Cập nhật trạng thái đơn ứng tuyển thành công", "data", a), HttpStatus.OK);
            }
            return new ResponseEntity<>(Map.of("message", "Cập nhật trạng thái đơn ứng không thành công", "data", a), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException i) {
            return new ResponseEntity<>(Map.of("message", "Đã được cập nhật không thể thay đổi"), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Cập nhật trạng thái đơn ứng tuyển thất bại" + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/secure/applications/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAppication(@PathVariable("id") int id, Principal principal) {
        Application application = this.applicationService.getApplicationDetailById(id, principal.getName());
        try {
            if (application != null) {
                return new ResponseEntity<>(Map.of("message", "Lấy thông tin thành công", "data", application), HttpStatus.OK);
            }
            return new ResponseEntity<>(Map.of("message", "Lấy thông tin thành công không thành công", "data", application), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Lấy thông tin thất bại " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
