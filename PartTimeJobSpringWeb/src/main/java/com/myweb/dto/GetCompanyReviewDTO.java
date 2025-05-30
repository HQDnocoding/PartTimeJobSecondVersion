/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.dto;

import com.myweb.pojo.CompanyReview;

import java.util.Date;

public class GetCompanyReviewDTO {

    private Integer id;
    private Integer candidateId;
    private Integer jobId;
    private Integer rating;
    private String review;
    private Date reviewDate;

    public GetCompanyReviewDTO(CompanyReview review) {
        this.id = review.getId();
        this.candidateId = review.getCandidateId().getId();
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

    public Integer getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Integer candidateId) {
        this.candidateId = candidateId;
    }

    public Integer getJobId() {
        return jobId;
    }

    public void setJobId(Integer jobId) {
        this.jobId = jobId;
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
