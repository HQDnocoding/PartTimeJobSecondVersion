/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.dto;

import com.myweb.pojo.CandidateReview;

import java.util.Date;

public class GetCandidateReviewDTO {

    private Integer id;
    private Integer companyId;
    private Integer jobId;
    private Integer candidateId;
    private Integer rating;
    private String review;
    private Date reviewDate;

    public GetCandidateReviewDTO(CandidateReview review) {
        this.id = review.getId();
        this.companyId = review.getCompanyId().getId();
        this.jobId = review.getJobId().getId();
        this.rating = review.getRating();
        this.review = review.getReview();
        this.reviewDate = review.getReviewDate();
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Integer companyId) {
        this.companyId = companyId;
    }

    public Integer getJobId() {
        return jobId;
    }

    public void setJobId(Integer jobId) {
        this.jobId = jobId;
    }

    public Integer getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Integer candidateId) {
        this.candidateId = candidateId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public Date getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(Date reviewDate) {
        this.reviewDate = reviewDate;
    }
}
