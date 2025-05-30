/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.pojo;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigInteger;
import java.util.Collection;
import java.util.Date;

/**
 *
 * @author dat
 */
@Entity
@Table(name = "job")
@NamedQueries({
    @NamedQuery(name = "Job.findAll", query = "SELECT j FROM Job j"),
    @NamedQuery(name = "Job.findById", query = "SELECT j FROM Job j WHERE j.id = :id"),
    @NamedQuery(name = "Job.findByJobName", query = "SELECT j FROM Job j WHERE j.jobName = :jobName"),
    @NamedQuery(name = "Job.findByDescription", query = "SELECT j FROM Job j WHERE j.description = :description"),
    @NamedQuery(name = "Job.findByJobRequired", query = "SELECT j FROM Job j WHERE j.jobRequired = :jobRequired"),
    @NamedQuery(name = "Job.findBySalaryMin", query = "SELECT j FROM Job j WHERE j.salaryMin = :salaryMin"),
    @NamedQuery(name = "Job.findBySalaryMax", query = "SELECT j FROM Job j WHERE j.salaryMax = :salaryMax"),
    @NamedQuery(name = "Job.findByAgeFrom", query = "SELECT j FROM Job j WHERE j.ageFrom = :ageFrom"),
    @NamedQuery(name = "Job.findByAgeTo", query = "SELECT j FROM Job j WHERE j.ageTo = :ageTo"),
    @NamedQuery(name = "Job.findByExperienceRequired", query = "SELECT j FROM Job j WHERE j.experienceRequired = :experienceRequired"),
    @NamedQuery(name = "Job.findByFullAddress", query = "SELECT j FROM Job j WHERE j.fullAddress = :fullAddress"),
    @NamedQuery(name = "Job.findByCity", query = "SELECT j FROM Job j WHERE j.city = :city"),
    @NamedQuery(name = "Job.findByDistrict", query = "SELECT j FROM Job j WHERE j.district = :district"),
    @NamedQuery(name = "Job.findByStatus", query = "SELECT j FROM Job j WHERE j.status = :status"),
    @NamedQuery(name = "Job.findByIsActive", query = "SELECT j FROM Job j WHERE j.isActive = :isActive"),
    @NamedQuery(name = "Job.findByPostedDate", query = "SELECT j FROM Job j WHERE j.postedDate = :postedDate")})
public class Job implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "job_name")
    private String jobName;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1000)
    @Column(name = "description")
    private String description;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1000)
    @Column(name = "job_required")
    private String jobRequired;
    @Column(name = "salary_min")
    private BigInteger salaryMin;
    @Column(name = "salary_max")
    private BigInteger salaryMax;
    @Column(name = "age_from")
    private Integer ageFrom;
    @Column(name = "age_to")
    private Integer ageTo;
    @Column(name = "experience_required")
    private Integer experienceRequired;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 300)
    @Column(name = "full_address")
    private String fullAddress;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "city")
    private String city;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "district")
    private String district;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 8)
    @Column(name = "status")
    private String status;
    @Basic(optional = false)
    @NotNull
    @Column(name = "is_active")
    private boolean isActive;
    @Column(name = "posted_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date postedDate;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "latitude")
    private Double latitude;
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "jobId",fetch = FetchType.EAGER)
    private Collection<MajorJob> majorJobCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "jobId")
    @JsonIgnore
    private Collection<CandidateReview> candidateReviewCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "jobId", fetch = FetchType.EAGER)
    private Collection<DayJob> dayJobCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "jobId")
    @JsonIgnore
    private Collection<Application> applicationCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "jobId")
    @JsonIgnore
    private Collection<CompanyReview> companyReviewCollection;
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Company companyId;

    public Job() {
    }

    public Job(Integer id) {
        this.id = id;
    }

    public Job(Integer id, String jobName, String description, String jobRequired, String fullAddress, String city, String district, String status, boolean isActive) {
        this.id = id;
        this.jobName = jobName;
        this.description = description;
        this.jobRequired = jobRequired;
        this.fullAddress = fullAddress;
        this.city = city;
        this.district = district;
        this.status = status;
        this.isActive = isActive;
    }

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

    public Integer getAgeFrom() {
        return ageFrom;
    }

    public void setAgeFrom(Integer ageFrom) {
        this.ageFrom = ageFrom;
    }

    public Integer getAgeTo() {
        return ageTo;
    }

    public void setAgeTo(Integer ageTo) {
        this.ageTo = ageTo;
    }

    public Integer getExperienceRequired() {
        return experienceRequired;
    }

    public void setExperienceRequired(Integer experienceRequired) {
        this.experienceRequired = experienceRequired;
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

    public boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public Date getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(Date postedDate) {
        this.postedDate = postedDate;
    }

    public Collection<MajorJob> getMajorJobCollection() {
        return majorJobCollection;
    }

    public void setMajorJobCollection(Collection<MajorJob> majorJobCollection) {
        this.majorJobCollection = majorJobCollection;
    }

    public Collection<CandidateReview> getCandidateReviewCollection() {
        return candidateReviewCollection;
    }

    public void setCandidateReviewCollection(Collection<CandidateReview> candidateReviewCollection) {
        this.candidateReviewCollection = candidateReviewCollection;
    }

    public Collection<DayJob> getDayJobCollection() {
        return dayJobCollection;
    }

    public void setDayJobCollection(Collection<DayJob> dayJobCollection) {
        this.dayJobCollection = dayJobCollection;
    }

    public Collection<Application> getApplicationCollection() {
        return applicationCollection;
    }

    public void setApplicationCollection(Collection<Application> applicationCollection) {
        this.applicationCollection = applicationCollection;
    }

    public Collection<CompanyReview> getCompanyReviewCollection() {
        return companyReviewCollection;
    }

    public void setCompanyReviewCollection(Collection<CompanyReview> companyReviewCollection) {
        this.companyReviewCollection = companyReviewCollection;
    }

    public Company getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Company companyId) {
        this.companyId = companyId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Job)) {
            return false;
        }
        Job other = (Job) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.myweb.pojo.Job[ id=" + id + " ]";
    }

    public void setCreatedDate(Date date) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    public void setRequirements(String requirements) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    /**
     * @return the longitude
     */
    public Double getLongitude() {
        return longitude;
    }

    /**
     * @param longtitude the longitude to set
     */
    public void setLongitude(Double longtitude) {
        this.longitude = longtitude;
    }

    /**
     * @return the latitude
     */
    public Double getLatitude() {
        return latitude;
    }

    /**
     * @param latitude the latitude to set
     */
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

}
