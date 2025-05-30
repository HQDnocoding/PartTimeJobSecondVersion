/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.dto;

import java.util.Date;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author huaquangdat
 */
public class CreateApplicationDTO {

    private MultipartFile curriculumVitae;
    private Date appliedDate;
    private String message;
    private Integer candidateId;
    private Integer jobId;

    /**
     * @return the curriculumVitae
     */
    public MultipartFile getCurriculumVitae() {
        return curriculumVitae;
    }

    /**
     * @param curriculumVitae the curriculumVitae to set
     */
    public void setCurriculumVitae(MultipartFile curriculumVitae) {
        this.curriculumVitae = curriculumVitae;
    }

    /**
     * @return the appliedDate
     */
    public Date getAppliedDate() {
        return appliedDate;
    }

    /**
     * @param appliedDate the appliedDate to set
     */
    public void setAppliedDate(Date appliedDate) {
        this.appliedDate = appliedDate;
    }

    /**
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * @param message the message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * @return the candidateId
     */
    public Integer getCandidateId() {
        return candidateId;
    }

    /**
     * @param candidateId the candidateId to set
     */
    public void setCandidateId(Integer candidateId) {
        this.candidateId = candidateId;
    }

    /**
     * @return the jobId
     */
    public Integer getJobId() {
        return jobId;
    }

    /**
     * @param jobId the jobId to set
     */
    public void setJobId(Integer jobId) {
        this.jobId = jobId;
    }
}
