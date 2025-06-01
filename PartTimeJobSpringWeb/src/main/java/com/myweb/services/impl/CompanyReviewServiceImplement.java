/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services.impl;

import com.myweb.dto.CreateCompanyReviewDTO;
import com.myweb.dto.GetCompanyReviewDTO;
import com.myweb.pojo.Application;
import com.myweb.pojo.Candidate;
import com.myweb.pojo.CompanyReview;
import com.myweb.pojo.Job;
import com.myweb.pojo.User;
import com.myweb.repositories.ApplicationRepository;
import com.myweb.repositories.CandidateRepository;
import com.myweb.repositories.CompanyReviewRepository;
import com.myweb.repositories.JobRepository;
import com.myweb.repositories.UserRepository;
import com.myweb.services.CompanyReviewService;
import com.myweb.utils.GeneralUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CompanyReviewServiceImplement implements CompanyReviewService {

    @Autowired
    private CompanyReviewRepository reviewRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public GetCompanyReviewDTO createReview(CreateCompanyReviewDTO dto, Principal principal) {
        if (dto == null) {
            throw new IllegalArgumentException("Review data is required.");
        }

        User user = userRepository.getUserByUsername(principal.getName());
        if (!user.getRole().equals(GeneralUtils.Role.ROLE_CANDIDATE.toString())) {
            throw new SecurityException("Only candidates can create company reviews.");
        }

        CompanyReview existingReview = reviewRepository.findByApplicationId(dto.getApplicationId());
        if (existingReview != null) {
            throw new IllegalArgumentException("A review for this application already exists.");
        }

        Candidate candidate = candidateRepository.getCandidateById(dto.getCandidateId());
        Job job = jobRepository.getJobById(dto.getJobId());

        if (candidate == null || job == null) {
            throw new IllegalArgumentException("Invalid candidate or job.");
        }

        if (!candidate.getUserId().getId().equals(user.getId())) {
            throw new SecurityException("You are not authorized to create this review.");
        }

        List<Application> applications = applicationRepository.findByJobIdAndStatus(dto.getJobId(), GeneralUtils.Status.approved.toString());
        boolean validApplication = applications.stream().anyMatch(app -> app.getCandidateId().getId().equals(dto.getCandidateId()));
        if (!validApplication) {
            throw new IllegalArgumentException("No approved application found for this job and candidate.");
        }

        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        CompanyReview review = new CompanyReview();
        review.setCandidateId(candidate);
        review.setJobId(job);
        review.setRating(dto.getRating());
        review.setReview(dto.getReview());
        review.setReviewDate(new Date());

        review = reviewRepository.addOrUpdateReview(review);
        return new GetCompanyReviewDTO(review);
    }

    @Override
    public Map<String, Object> getListReview(Map<String, String> params, Integer companyId) {
        return reviewRepository.getListReview(params, companyId);
    }

    @Override
    public GetCompanyReviewDTO getReviewById(Integer id) {
        CompanyReview review = reviewRepository.getReviewById(id);
        if (review == null) {
            throw new IllegalArgumentException("Review not found.");
        }
        return new GetCompanyReviewDTO(review);
    }

    @Override
    public GetCompanyReviewDTO updateReview(Integer id, CreateCompanyReviewDTO dto, Principal principal) {
        if (dto == null) {
            throw new IllegalArgumentException("Review data is required.");
        }

        User user = userRepository.getUserByUsername(principal.getName());
        CompanyReview review = reviewRepository.getReviewById(id);

        if (review == null) {
            throw new IllegalArgumentException("Review not found.");
        }

        if (!user.getRole().equals(GeneralUtils.Role.ROLE_CANDIDATE.toString())
                || !review.getCandidateId().getUserId().getId().equals(user.getId())) {
            throw new SecurityException("You are not authorized to update this review.");
        }

        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        review.setRating(dto.getRating());
        review.setReview(dto.getReview());
        review = reviewRepository.addOrUpdateReview(review);
        return new GetCompanyReviewDTO(review);
    }

    @Override
    public void deleteReview(Integer id, Principal principal) {
        User user = userRepository.getUserByUsername(principal.getName());
        CompanyReview review = reviewRepository.getReviewById(id);

        if (review == null) {
            throw new IllegalArgumentException("Review not found.");
        }

        if (!user.getRole().equals(GeneralUtils.Role.ROLE_CANDIDATE.toString())
                && !user.getRole().equals(GeneralUtils.Role.ROLE_ADMIN.toString())
                || (!user.getRole().equals(GeneralUtils.Role.ROLE_ADMIN.toString())
                && !review.getCandidateId().getUserId().getId().equals(user.getId()))) {
            throw new SecurityException("You are not authorized to delete this review.");
        }

        reviewRepository.deleteReview(id);
    }

    @Override
    public Double getAverageRating(Integer companyId) {
        return reviewRepository.getAverageRating(companyId);
    }

    @Override
    public CompanyReview getReviewByApplicationId(Integer applicationId) {
        return reviewRepository.findByApplicationId(applicationId);
    }
}
