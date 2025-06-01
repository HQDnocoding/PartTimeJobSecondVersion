/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author dat
 */
@Entity
@Table(name = "candidate_review")
@NamedQueries({
    @NamedQuery(name = "CandidateReview.findAll", query = "SELECT c FROM CandidateReview c"),
    @NamedQuery(name = "CandidateReview.findById", query = "SELECT c FROM CandidateReview c WHERE c.id = :id"),
    @NamedQuery(name = "CandidateReview.findByReview", query = "SELECT c FROM CandidateReview c WHERE c.review = :review"),
    @NamedQuery(name = "CandidateReview.findByReviewDate", query = "SELECT c FROM CandidateReview c WHERE c.reviewDate = :reviewDate"),
    @NamedQuery(name = "CandidateReview.findByRating", query = "SELECT c FROM CandidateReview c WHERE c.rating = :rating")})
    @NamedQuery(name = "CandidateReview.findByCandidateIdAndJobId", query = "SELECT c FROM CandidateReview c WHERE c.candidateId.id = :candidateId AND c.jobId.id = :jobId")
public class CandidateReview implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 200)
    @Column(name = "review")
    private String review;

    @Basic(optional = false)
    @NotNull
    @Column(name = "review_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date reviewDate;

    @Column(name = "rating")
    private Integer rating;

    @JoinColumn(name = "company_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Company companyId;

    @JoinColumn(name = "job_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Job jobId;

    @JoinColumn(name = "candidate_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Candidate candidateId;

    public CandidateReview() {
    }

    public CandidateReview(Integer id) {
        this.id = id;
    }

    public CandidateReview(Integer id, String review, Date reviewDate) {
        this.id = id;
        this.review = review;
        this.reviewDate = reviewDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Company getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Company companyId) {
        this.companyId = companyId;
    }

    public Job getJobId() {
        return jobId;
    }

    public void setJobId(Job jobId) {
        this.jobId = jobId;
    }

    public Candidate getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Candidate candidateId) {
        this.candidateId = candidateId;
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
        if (!(object instanceof CandidateReview)) {
            return false;
        }
        CandidateReview other = (CandidateReview) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.myweb.pojo.CandidateReview[ id=" + id + " ]";
    }

}
