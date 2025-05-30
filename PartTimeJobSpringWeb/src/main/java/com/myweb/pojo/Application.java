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
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author dat
 */
@Entity
@Table(name = "application")
@NamedQueries({
    @NamedQuery(name = "Application.findAll", query = "SELECT a FROM Application a"),
    @NamedQuery(name = "Application.findById", query = "SELECT a FROM Application a WHERE a.id = :id"),
    @NamedQuery(name = "Application.findByCurriculumVitae", query = "SELECT a FROM Application a WHERE a.curriculumVitae = :curriculumVitae"),
    @NamedQuery(name = "Application.findByAppliedDate", query = "SELECT a FROM Application a WHERE a.appliedDate = :appliedDate"),
    @NamedQuery(name = "Application.findByMessage", query = "SELECT a FROM Application a WHERE a.message = :message"),
    @NamedQuery(name = "Application.findByStatus", query = "SELECT a FROM Application a WHERE a.status = :status")})
public class Application implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 200)
    @Column(name = "curriculum_vitae")
    private String curriculumVitae;

    @Basic(optional = false)
    @NotNull
    @Column(name = "applied_date")
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date appliedDate;

    @Size(max = 400)
    @Column(name = "message")
    private String message;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 8)
    @Column(name = "status")
    private String status;

    @JoinColumn(name = "candidate_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Candidate candidateId;

    @JoinColumn(name = "job_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Job jobId;

    @Transient
    private MultipartFile curriculumVitaeFile;

    public Application() {
    }

    public Application(Integer id) {
        this.id = id;
    }

    public Application(Integer id, String curriculumVitae, Date appliedDate, String status) {
        this.id = id;
        this.curriculumVitae = curriculumVitae;
        this.appliedDate = appliedDate;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCurriculumVitae() {
        return curriculumVitae;
    }

    public void setCurriculumVitae(String curriculumVitae) {
        this.curriculumVitae = curriculumVitae;
    }

    public Date getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(Date appliedDate) {
        this.appliedDate = appliedDate;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Candidate getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Candidate candidateId) {
        this.candidateId = candidateId;
    }

    public Job getJobId() {
        return jobId;
    }

    public void setJobId(Job jobId) {
        this.jobId = jobId;
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
        if (!(object instanceof Application)) {
            return false;
        }
        Application other = (Application) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.myweb.pojo.Application[ id=" + id + " ]";
    }

    /**
     * @return the curriculumVitaeFile
     */
    public MultipartFile getCurriculumVitaeFile() {
        return curriculumVitaeFile;
    }

    /**
     * @param curriculumVitaeFile the curriculumVitaeFile to set
     */
    public void setCurriculumVitaeFile(MultipartFile curriculumVitaeFile) {
        this.curriculumVitaeFile = curriculumVitaeFile;
    }

}
