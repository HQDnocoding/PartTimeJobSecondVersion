package com.myweb.pojo;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
import java.io.Serializable;

/**
 * Entity đại diện cho mối quan hệ giữa Job và Major trong bảng major_job.
 */
@Entity
@Table(name = "major_job")
@NamedQueries({
    @NamedQuery(name = "MajorJob.findAll", query = "SELECT m FROM MajorJob m"),
    @NamedQuery(name = "MajorJob.findById", query = "SELECT m FROM MajorJob m WHERE m.id = :id")
})
public class MajorJob implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @JoinColumn(name = "job_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    @JsonIgnore
    private Job jobId;

    @JoinColumn(name = "major_id", referencedColumnName = "id")
    @ManyToOne
    private Major majorId;

    public MajorJob() {
    }

    public MajorJob(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Job getJobId() {
        return jobId;
    }

    public void setJobId(Job jobId) {
        this.jobId = jobId;
    }

    public Major getMajorId() {
        return majorId;
    }

    public void setMajorId(Major majorId) {
        this.majorId = majorId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        if (!(object instanceof MajorJob)) {
            return false;
        }
        MajorJob other = (MajorJob) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.myweb.pojo.MajorJob[ id=" + id + " ]";
    }
}
