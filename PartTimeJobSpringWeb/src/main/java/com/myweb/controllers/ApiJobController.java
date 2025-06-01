/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.dto.CreateJobDTO;
import com.myweb.pojo.Job;
import com.myweb.services.JobService;
import java.security.Principal;
import java.util.List;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiJobController {

    @Autowired
    private JobService jobService;

    @GetMapping(path = "/jobs", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllJobs(@RequestParam Map<String, String> params) {
        try {
            Map<String, Object> result = jobService.searchJobs(params);
            return new ResponseEntity<>(Map.of("message", "Lấy danh sách công việc thành công", "data", result), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Lấy danh sách công việc thất bại: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/admin/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable("id") int id) {
        try {
            jobService.deleteJob(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi khi xóa công việc: " + e.getMessage());
        }
    }

    @PostMapping(path = "/secure/jobs", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createJob(CreateJobDTO dto) {
        System.out.println("go" + dto.getLatitude());

        try {
            Object result = this.jobService.addJob(dto);
            System.out.println(dto);
            return new ResponseEntity<>(Map.of("message", "Tạo bài tuyển dụng thành công", "data", result), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", String.format("Tạo thất bại: %s", e.getMessage())), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/jobs/{jobId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getJobDetail(@PathVariable(value = "jobId") int jobId) {
        try {
            return new ResponseEntity<>(Map.of("message", "Lấy thông tin thành công", "data", this.jobService.getOnlyJobById(jobId)), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Lấy thông tin thất bại " + e), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/secure/jobs", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getJobListByAuthenticatedCompany(Principal principal) {
        List<Job> result = this.jobService.getJobByAuthenticateCompany(principal);
        try {
            return new ResponseEntity<>(Map.of("message", "Lấy thông tin thành công", "data", result), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Lấy thông tin thất bại " + e), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/secure/jobs/{id}")
    public ResponseEntity<?> deleteJob(@RequestParam Map<String, String> params, @PathVariable(value = "id") int id, Principal principal) {
        try {
            System.out.println(String.format("%s %s", principal.getName(), params.get("username")));
            if (!params.get("username").equals( principal.getName())) {
                return new ResponseEntity<>(Map.of("message", "Không có quyền xóa"), HttpStatus.FORBIDDEN);
            }
            this.jobService.deleteJob(id);
            return new ResponseEntity<>(Map.of("message", "Xóa thành công"), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(Map.of("message", "Lỗi hệ thống","error",e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/secure/company/jobs", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getCompanyJobs(
            Principal principal,
            @RequestParam Map<String, String> params
    ) {
        System.err.println("pa" + params.get("status"));
        try {
            Map<String, Object> result = jobService.getCompanyJobs(principal, params);
            return new ResponseEntity<>(Map.of("message", "Lấy danh sách công việc thành công", "data", result), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Lấy danh sách công việc thất bại: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
