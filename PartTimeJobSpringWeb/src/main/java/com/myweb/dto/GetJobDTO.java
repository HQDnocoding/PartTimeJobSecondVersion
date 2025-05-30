package com.myweb.dto;

import com.myweb.pojo.Job;

import java.math.BigInteger;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class GetJobDTO {
    private Integer id;
    private String jobName;
    private String description;
    private String jobRequired;
    private BigInteger salaryMin;
    private BigInteger salaryMax;
    private String fullAddress;
    private String city;
    private String district;
    private String status;
    private boolean isActive;
    private Date postedDate;
    private Integer companyId;
    private String companyName;
    private Integer majorId;
    private String majorName;
    private List<Integer> dayIds;
    private List<String> dayNames;

    public GetJobDTO() {
    }

    public GetJobDTO(Job job) {
        this.id = job.getId();
        this.jobName = job.getJobName();
        this.description = job.getDescription();
        this.jobRequired = job.getJobRequired();
        this.salaryMin = job.getSalaryMin();
        this.salaryMax = job.getSalaryMax();
        this.fullAddress = job.getFullAddress();
        this.city = job.getCity();
        this.district = job.getDistrict();
        this.status = job.getStatus();
        this.isActive = job.getIsActive();
        this.postedDate = job.getPostedDate();
        if (job.getCompanyId() != null) {
            this.companyId = job.getCompanyId().getId();
            this.companyName = job.getCompanyId().getName();
        }
        if (job.getMajorJobCollection() != null && !job.getMajorJobCollection().isEmpty()) {
            var majorJob = job.getMajorJobCollection().iterator().next();
            if (majorJob.getMajorId() != null) {
                this.majorId = majorJob.getMajorId().getId();
                this.majorName = majorJob.getMajorId().getName();
            }
        }
        if (job.getDayJobCollection() != null) {
            this.dayIds = job.getDayJobCollection().stream()
                    .filter(dayJob -> dayJob.getDayId() != null)
                    .map(dayJob -> dayJob.getDayId().getId())
                    .collect(Collectors.toList());
            this.dayNames = job.getDayJobCollection().stream()
                    .filter(dayJob -> dayJob.getDayId() != null)
                    .map(dayJob -> dayJob.getDayId().getName())
                    .collect(Collectors.toList());
        }
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getJobRequired() {
        return jobRequired;
    }

    public void setJobRequired(String jobRequired) {
        this.jobRequired = jobRequired;
    }

    public BigInteger getSalaryMin() {
        return salaryMin;
    }

    public void setSalaryMin(BigInteger salaryMin) {
        this.salaryMin = salaryMin;
    }

    public BigInteger getSalaryMax() {
        return salaryMax;
    }

    public void setSalaryMax(BigInteger salaryMax) {
        this.salaryMax = salaryMax;
    }

    public String getFullAddress() {
        return fullAddress;
    }

    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public Date getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(Date postedDate) {
        this.postedDate = postedDate;
    }

    public Integer getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Integer companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Integer getMajorId() {
        return majorId;
    }

    public void setMajorId(Integer majorId) {
        this.majorId = majorId;
    }

    public String getMajorName() {
        return majorName;
    }

    public void setMajorName(String majorName) {
        this.majorName = majorName;
    }

    public List<Integer> getDayIds() {
        return dayIds;
    }

    public void setDayIds(List<Integer> dayIds) {
        this.dayIds = dayIds;
    }

    public List<String> getDayNames() {
        return dayNames;
    }

    public void setDayNames(List<String> dayNames) {
        this.dayNames = dayNames;
    }
}