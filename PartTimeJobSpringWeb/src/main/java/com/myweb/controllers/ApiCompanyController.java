/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.myweb.dto.CreateCompanyDTO;
import com.myweb.dto.GetJobDTO;
import com.myweb.pojo.Company;
import com.myweb.pojo.Job;
import com.myweb.services.CompanyService;
import com.myweb.services.OTPService;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author huaquangdat
 */
@RestController
@RequestMapping("/api")
public class ApiCompanyController {

    @Autowired
    private CompanyService cpnyService;
    @Autowired
    private OTPService otpService;

    @GetMapping(path = "/companies", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllCompanies(@RequestParam Map<String, String> params) {
        try {
            Map<String, Object> result = cpnyService.getListCompany(params);
            return new ResponseEntity<>(Map.of("message", "Lấy danh sách công ty thành công", "data", result), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Lấy danh sách công ty thất bại: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/admin/companies/{companyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCompany(@PathVariable(value = "companyId") int companyId) {
        try {
            this.cpnyService.deleteCompany(companyId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping(path = "/register-company", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createCompany(CreateCompanyDTO dto) {
        try {
            boolean isValid = this.otpService.verifyOtp(dto.getUsername(), dto.getOtp());
            if (isValid) {
                Object result = this.cpnyService.createCompanyDTO(dto);
                this.otpService.removeOTP(dto.getUsername());
                return new ResponseEntity<>(Map.of("message", "Đăng ký thành công", "data", result), HttpStatus.CREATED);
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired OTP");
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Đăng ký thất bại: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/companies/{companyId}")
    public ResponseEntity<?> getCompanyWithFilter(@PathVariable(value = "companyId") int companyId) {
        try {
            Company company = this.cpnyService.getCompanyApproved(companyId);
            System.out.println("Company fetched (with filter): " + company);
            if (company == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Company not found");
            }
            return ResponseEntity.ok(company);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching company: " + e.getMessage());
        }
    }

    @GetMapping("/companies/{companyId}/jobs")
    public ResponseEntity<?> getJobs(@PathVariable(value = "companyId") int companyId) {
        try {
            Collection<Job> jobs = this.cpnyService.getCompanyWithJobs(companyId);
            if (jobs.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Company not found");
            }
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching company: " + e.getMessage());
        }
    }

    @GetMapping("/companies/{companyId}/id-role")
    public ResponseEntity<?> getUserIdAndRole(@PathVariable(value = "companyId") int companyId) {
        try {
            Map<String, Object> map = this.cpnyService.getUserIdAndRole(companyId);
            if (map.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching company: " + e.getMessage());
        }
    }

    @GetMapping("/secure/companies/{userId}/infor-by-userId")
    public ResponseEntity<?> getCompanyByUserId(@PathVariable(value = "userId") int userId) {
        try {
            Company company = this.cpnyService.getCompanyByUserId(userId);
            company.setUserId(null);
            if (company == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            return ResponseEntity.ok(company);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching company: " + e.getMessage());
        }
    }
}
