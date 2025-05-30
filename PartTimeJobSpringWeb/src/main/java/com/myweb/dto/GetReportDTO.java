package com.myweb.dto;

import java.util.Date;

public class GetReportDTO {
    private Date date;
    private Long jobCount;
    private Long candidateCount;
    private Long companyCount;

    public GetReportDTO() {}

    public GetReportDTO(Date date, Long jobCount, Long candidateCount, Long companyCount) {
        this.date = date;
        this.jobCount = jobCount;
        this.candidateCount = candidateCount;
        this.companyCount = companyCount;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getJobCount() {
        return jobCount;
    }

    public void setJobCount(Long jobCount) {
        this.jobCount = jobCount;
    }

    public Long getCandidateCount() {
        return candidateCount;
    }

    public void setCandidateCount(Long candidateCount) {
        this.candidateCount = candidateCount;
    }

    public Long getCompanyCount() {
        return companyCount;
    }

    public void setCompanyCount(Long companyCount) {
        this.companyCount = companyCount;
    }
}