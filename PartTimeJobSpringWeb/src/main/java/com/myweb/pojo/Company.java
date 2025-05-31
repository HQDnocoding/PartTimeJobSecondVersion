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
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Collection;
import org.hibernate.annotations.Where;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author dat
 */
@Entity
@Table(name = "company")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@NamedQueries({
    @NamedQuery(name = "Company.findAll", query = "SELECT c FROM Company c"),
    @NamedQuery(name = "Company.findById", query = "SELECT c FROM Company c WHERE c.id = :id"),
    @NamedQuery(name = "Company.findByName", query = "SELECT c FROM Company c WHERE c.name = :name"),
    @NamedQuery(name = "Company.findByAvatar", query = "SELECT c FROM Company c WHERE c.avatar = :avatar"),
    @NamedQuery(name = "Company.findBySelfDescription", query = "SELECT c FROM Company c WHERE c.selfDescription = :selfDescription"),
    @NamedQuery(name = "Company.findByTaxCode", query = "SELECT c FROM Company c WHERE c.taxCode = :taxCode"),
    @NamedQuery(name = "Company.findByFullAddress", query = "SELECT c FROM Company c WHERE c.fullAddress = :fullAddress"),
    @NamedQuery(name = "Company.findByCity", query = "SELECT c FROM Company c WHERE c.city = :city"),
    @NamedQuery(name = "Company.findByDistrict", query = "SELECT c FROM Company c WHERE c.district = :district"),
    @NamedQuery(name = "Company.findByStatus", query = "SELECT c FROM Company c WHERE c.status = :status")})
public class Company implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "name")
    private String name;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 200)
    @Column(name = "avatar")
    private String avatar;

    @Size(max = 300)
    @Column(name = "self_description")
    private String selfDescription;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "tax_code")
    private String taxCode;

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

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "companyId")
    private CompanyAuthentication companyAuthentication;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "companyId", fetch = FetchType.EAGER)
//    @JsonIgnore
    private Collection<ImageWorkplace> imageWorkplaceCollection;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "companyId", fetch = FetchType.EAGER)
//    @JsonIgnore
    @Where(clause = "is_active = true")
    private Collection<Follow> followCollection;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "companyId")
    @JsonIgnore
    private Collection<CandidateReview> candidateReviewCollection;

    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    @OneToOne(optional = false)
//    @JsonManagedReference
    private User userId;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "companyId")
    @JsonIgnore
    private Collection<Job> jobCollection;

    @Transient
    private MultipartFile avatarFile;

    public Company() {
    }

    public Company(Integer id) {
        this.id = id;
    }

    public Company(Integer id, String name, String avatar, String taxCode, String fullAddress, String city, String district, String status) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.taxCode = taxCode;
        this.fullAddress = fullAddress;
        this.city = city;
        this.district = district;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSelfDescription() {
        return selfDescription;
    }

    public void setSelfDescription(String selfDescription) {
        this.selfDescription = selfDescription;
    }

    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    public String getFullAddress() {
        return fullAddress;
    }

    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }

    public Collection<ImageWorkplace> getImageWorkplaceCollection() {
        return imageWorkplaceCollection;
    }

    public void setImageWorkplaceCollection(Collection<ImageWorkplace> imageWorkplaceCollection) {
        this.imageWorkplaceCollection = imageWorkplaceCollection;
    }

    public Collection<Follow> getFollowCollection() {
        return followCollection;
    }

    public void setFollowCollection(Collection<Follow> followCollection) {
        this.followCollection = followCollection;
    }

    public Collection<CandidateReview> getCandidateReviewCollection() {
        return candidateReviewCollection;
    }

    public void setCandidateReviewCollection(Collection<CandidateReview> candidateReviewCollection) {
        this.candidateReviewCollection = candidateReviewCollection;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    public Collection<Job> getJobCollection() {
        return jobCollection;
    }

    public void setJobCollection(Collection<Job> jobCollection) {
        this.jobCollection = jobCollection;
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
        if (!(object instanceof Company)) {
            return false;
        }
        Company other = (Company) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.myweb.pojo.Company[ id=" + id + " ]";
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
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

    public CompanyAuthentication getCompanyAuthentication() {
        return companyAuthentication;
    }

    public void setCompanyAuthentication(CompanyAuthentication companyAuthentication) {
        this.companyAuthentication = companyAuthentication;
    }

}
