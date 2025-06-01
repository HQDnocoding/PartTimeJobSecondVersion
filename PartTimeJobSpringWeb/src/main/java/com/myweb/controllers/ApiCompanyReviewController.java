 /*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.dto.CreateCompanyReviewDTO;
import com.myweb.dto.GetCompanyReviewDTO;
import com.myweb.services.CompanyReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiCompanyReviewController {

    @Autowired
    private CompanyReviewService reviewService;

    @PostMapping("/secure/company-reviews")
    public ResponseEntity<GetCompanyReviewDTO> createReview(@RequestBody CreateCompanyReviewDTO dto, Principal principal) {
        GetCompanyReviewDTO review = reviewService.createReview(dto, principal);
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }

    @GetMapping("/company-reviews/company/{companyId}")
    public ResponseEntity<Map<String, Object>> getListReview(
            @PathVariable("companyId") Integer companyId,
            @RequestParam(required = false) Map<String, String> params) {
        Map<String, Object> result = reviewService.getListReview(params, companyId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/company-reviews/{id}")
    public ResponseEntity<GetCompanyReviewDTO> getReviewById(@PathVariable("id") Integer id) {
        GetCompanyReviewDTO review = reviewService.getReviewById(id);
        return new ResponseEntity<>(review, HttpStatus.OK);
    }

    @PutMapping("/secure/company-reviews/{id}")
    public ResponseEntity<GetCompanyReviewDTO> updateReview(
            @PathVariable("id") Integer id,
            @RequestBody CreateCompanyReviewDTO dto,
            Principal principal) {
        GetCompanyReviewDTO review = reviewService.updateReview(id, dto, principal);
        return new ResponseEntity<>(review, HttpStatus.OK);
    }

    @DeleteMapping("/secure/company-reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable("id") Integer id, Principal principal) {
        reviewService.deleteReview(id, principal);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/company-reviews/company/{companyId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable("companyId") Integer companyId) {
        Double avgRating = reviewService.getAverageRating(companyId);
        return new ResponseEntity<>(avgRating, HttpStatus.OK);
    }
    
    @GetMapping("/company-reviews/candidate/{candidateId}")
    public ResponseEntity<Map<String, Object>> getReviewsByCandidate(
            @PathVariable("candidateId") Integer candidateId,
            @RequestParam(required = false) Map<String, String> params) {
        Map<String, Object> result = reviewService.getReviewsByCandidate(params, candidateId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}