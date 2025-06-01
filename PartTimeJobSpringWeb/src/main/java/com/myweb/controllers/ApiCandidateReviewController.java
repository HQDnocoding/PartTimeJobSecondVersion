/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.dto.CreateCandidateReviewDTO;
import com.myweb.dto.GetCandidateReviewDTO;
import com.myweb.services.CandidateReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiCandidateReviewController {

    @Autowired
    private CandidateReviewService reviewService;

    @PostMapping("/secure/candidate-reviews")
    public ResponseEntity<GetCandidateReviewDTO> createReview(@RequestBody CreateCandidateReviewDTO dto, Principal principal) {
        System.out.println("Received request for creating review: " + dto.toString());
        GetCandidateReviewDTO review = reviewService.createReview(dto, principal);
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }

    @GetMapping("/candidate-reviews/candidate/{candidateId}")
    public ResponseEntity<Map<String, Object>> getListReview(
            @PathVariable("candidateId") Integer candidateId,
            @RequestParam(required = false) Map<String, String> params) {
        Map<String, Object> result = reviewService.getListReview(params, candidateId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/candidate-reviews/{id}")
    public ResponseEntity<GetCandidateReviewDTO> getReviewById(@PathVariable("id") Integer id) {
        GetCandidateReviewDTO review = reviewService.getReviewById(id);
        return new ResponseEntity<>(review, HttpStatus.OK);
    }

    @PutMapping("/secure/candidate-reviews/{id}")
    public ResponseEntity<GetCandidateReviewDTO> updateReview(
            @PathVariable("id") Integer id,
            @RequestBody CreateCandidateReviewDTO dto,
            Principal principal) {
        GetCandidateReviewDTO review = reviewService.updateReview(id, dto, principal);
        return new ResponseEntity<>(review, HttpStatus.OK);
    }

    @DeleteMapping("/secure/candidate-reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable("id") Integer id, Principal principal) {
        reviewService.deleteReview(id, principal);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/candidate-reviews/candidate/{candidateId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable("candidateId") Integer candidateId) {
        Double avgRating = reviewService.getAverageRating(candidateId);
        return new ResponseEntity<>(avgRating, HttpStatus.OK);
    }

    @GetMapping("/candidate-reviews/company/{companyId}")
    public ResponseEntity<Map<String, Object>> getReviewsByCompany(
            @PathVariable("companyId") Integer companyId,
            @RequestParam(required = false) Map<String, String> params) {
        Map<String, Object> result = reviewService.getReviewsByCompany(params, companyId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
