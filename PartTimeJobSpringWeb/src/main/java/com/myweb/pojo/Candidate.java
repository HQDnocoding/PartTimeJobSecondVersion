/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.pojo;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Collection;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author dat
 */
@Entity
@Table(name = "candidate")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@NamedQueries({
    @NamedQuery(name = "Candidate.findAll", query = "SELECT c FROM Candidate c"),
    @NamedQuery(name = "Candidate.findById", query = "SELECT c FROM Candidate c WHERE c.id = :id"),
    @NamedQuery(name = "Candidate.findByFullName", query = "SELECT c FROM Candidate c WHERE c.fullName = :fullName"),
    @NamedQuery(name = "Candidate.findByDateOfBirth", query = "SELECT c FROM Candidate c WHERE c.dateOfBirth = :dateOfBirth"),
    @NamedQuery(name = "Candidate.findByCity", query = "SELECT c FROM Candidate c WHERE c.city = :city"),
    @NamedQuery(name = "Candidate.findByAvatar", query = "SELECT c FROM Candidate c WHERE c.avatar = :avatar"),
    @NamedQuery(name = "Candidate.findBySelfDescription", query = "SELECT c FROM Candidate c WHERE c.selfDescription = :selfDescription"),
    @NamedQuery(name = "Candidate.findByPhone", query = "SELECT c FROM Candidate c WHERE c.phone = :phone"),
    @NamedQuery(name = "Candidate.findByCurriculumVitae", query = "SELECT c FROM Candidate c WHERE c.curriculumVitae = :curriculumVitae")})
public class Candidate implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Size(min = 1, max = 200)
    @Column(name = "full_name")
    private String fullName;

    @Column(name = "date_of_birth")
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date dateOfBirth;

    @Size(min = 1, max = 50)
    @Column(name = "city")
    private String city;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 200)
    @Column(name = "avatar")
    private String avatar;

    @Size(max = 300)
    @Column(name = "self_description")
    private String selfDescription;

    @Pattern(regexp = "^\\(?(\\d{3})\\)?[- ]?(\\d{3})[- ]?(\\d{4})$", message = "Invalid phone/fax format, should be as xxx-xxx-xxxx")//if the field contains phone or fax number consider using this annotation to enforce field validation
    @Size(min = 1, max = 15)
    @Column(name = "phone")
    private String phone;

    @Size(max = 200)
    @Column(name = "curriculum_vitae")
    private String curriculumVitae;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "candidateId")
    @JsonIgnore
    private Collection<Follow> followCollection;

    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    @OneToOne(optional = false)
//    @JsonManagedReference
    private User userId;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "candidateId")
    @JsonIgnore
    private Collection<Application> applicationCollection;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "candidateId")
    @JsonIgnore
    private Collection<CompanyReview> companyReviewCollection;

    @Transient
    private MultipartFile curriculumVitaeFile;

    @Transient
    private MultipartFile avatarFile;
    
    @Transient
    private String email;
    
    @Transient
    private String otpMail;
    
    @Transient
    private String otpPhone;

    public Candidate() {
    }

    public Candidate(Integer id) {
        this.id = id;
    }

    public Candidate(Integer id, String fullName,  Date dateOfBirth, String city, String avatar, String phone) {
        this.id = id;
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.city = city;
        this.avatar = avatar;
        this.phone = phone;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getSelfDescription() {
        return selfDescription;
    }

    public void setSelfDescription(String selfDescription) {
        this.selfDescription = selfDescription;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCurriculumVitae() {
        return curriculumVitae;
    }

    public void setCurriculumVitae(String curriculumVitae) {
        this.curriculumVitae = curriculumVitae;
    }

    public Collection<Follow> getFollowCollection() {
        return followCollection;
    }

    public void setFollowCollection(Collection<Follow> followCollection) {
        this.followCollection = followCollection;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
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

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Candidate)) {
            return false;
        }
        Candidate other = (Candidate) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.myweb.pojo.Candidate[ id=" + id + " ]";
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

    /**
     * @return the avatarFile
     */
    public MultipartFile getAvatarFile() {
        return avatarFile;
    }

    /**
     * @param avatarFile the avatarFile to set
     */
    public void setAvatarFile(MultipartFile avatarFile) {
        this.avatarFile = avatarFile;
    }

    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return the otpMail
     */
    public String getOtpMail() {
        return otpMail;
    }

    /**
     * @param otpMail the otpMail to set
     */
    public void setOtpMail(String otpMail) {
        this.otpMail = otpMail;
    }

    /**
     * @return the otpPhone
     */
    public String getOtpPhone() {
        return otpPhone;
    }

    /**
     * @param otpPhone the otpPhone to set
     */
    public void setOtpPhone(String otpPhone) {
        this.otpPhone = otpPhone;
    }

}
