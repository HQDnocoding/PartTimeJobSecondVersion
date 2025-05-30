/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.dto.CreateCandidateDTO;
import com.myweb.dto.GetCandidateDTO;
import com.myweb.pojo.Candidate;
import com.myweb.services.CandidateService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.myweb.services.OTPService;
import java.security.Principal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author huaquangdat
 */
@RequestMapping("/api")
@RestController
public class ApiCandidateController {

    @Autowired
    private CandidateService candidateService;
    @Autowired
    private OTPService otpService;

    @GetMapping("/admin/candidates")
    public List<GetCandidateDTO> getCandidateList() {
        List<Candidate> candidates = candidateService.getCandidateList();
        return candidates.stream().map(c -> {
            GetCandidateDTO dto = new GetCandidateDTO(c);
            return dto;
        }).collect(Collectors.toList());
    }

    @DeleteMapping("/admin/candidates/{candidateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCompany(@PathVariable(value = "candidateId") int candidateId) {
        try {
            this.candidateService.deleteCandidate(candidateId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping(path = "/register-candidate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createCandidate(CreateCandidateDTO dto) {
        try {
            boolean isValid = this.otpService.verifyOtp(dto.getUsername(), dto.getOtp());

            if (isValid) {
                Object result = this.candidateService.createCandidateDTO(dto);
                this.otpService.removeOTP(dto.getUsername());
                return new ResponseEntity<>(Map.of("message", "Đăng ký thành công", "data", result), HttpStatus.CREATED);
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired OTP");
            }
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(Map.of("message", "Đăng ký thất bại: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/secure/candidates/{userId}/infor-by-userId")
    public ResponseEntity<?> getCandidateByUserId(@PathVariable(value = "userId") int userId, Principal principal) {
        try {
            Candidate candidate = this.candidateService.getCandidateByUserId(userId);
            GetCandidateDTO dto = new GetCandidateDTO(candidate);
            if (candidate == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Candidate not found");
            }
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching candidate: " + e.getMessage());
        }
    }

    @PutMapping(path = "/secure/candidates/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateCandidate(Candidate candidate, Principal principal, @PathVariable(value = "id") int id) {
        try {
            Candidate updatedCandidate = this.candidateService.updateCadidate(candidate, principal, id);
            System.out.println(candidate.getAvatarFile());
//            System.out.println(updatedCandidate.getAvatar());

            if (updatedCandidate != null) {
                return ResponseEntity.ok(updatedCandidate);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error : " + e.getMessage());
        }
    }

    @GetMapping("/secure/candidates/{candidateId}/id-role")
    public ResponseEntity<?> getUserIdAndRole(@PathVariable(value = "candidateId") int companyId) {
        try {
            Map<String, Object> map = this.candidateService.getUserIdAndRole(companyId);
            if (map.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching company: " + e.getMessage());
        }
    }

}
