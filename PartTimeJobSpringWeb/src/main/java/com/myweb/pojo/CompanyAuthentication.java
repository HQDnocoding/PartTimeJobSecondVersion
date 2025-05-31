/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.pojo;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author huaquangdat
 */
@Entity
@Table(name = "company_authentication")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@NamedQueries({
    @NamedQuery(name = "CompanyAuthentication.findAll", query = "SELECT c FROM CompanyAuthentication c"),
    @NamedQuery(name = "CompanyAuthentication.findById", query = "SELECT c FROM CompanyAuthentication c WHERE c.id = :id"),
    @NamedQuery(name = "CompanyAuthentication.findByPaper", query = "SELECT c FROM CompanyAuthentication c WHERE c.paper = :paper"),
    @NamedQuery(name = "CompanyAuthentication.findByIdCardFront", query = "SELECT c FROM CompanyAuthentication c WHERE c.idCardFront = :idCardFront"),
    @NamedQuery(name = "CompanyAuthentication.findByIdCardBack", query = "SELECT c FROM CompanyAuthentication c WHERE c.idCardBack = :idCardBack"),
    @NamedQuery(name = "CompanyAuthentication.findByStatus", query = "SELECT c FROM CompanyAuthentication c WHERE c.status = :status")})
public class CompanyAuthentication implements Serializable {

    private static long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "paper")
    private String paper;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "id_card_front")
    private String idCardFront;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "id_card_back")
    private String idCardBack;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 8)
    @Column(name = "status")
    private String status;

    @Lob
    @Size(max = 65535)
    @Column(name = "feedback")
    private String feedback;


    @Column(name = "last_updated")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUpdated;

    @JoinColumn(name = "company_id", referencedColumnName = "id")
    @OneToOne(optional = false)
    private Company companyId;

    @Transient
    private MultipartFile paperFile;

    @Transient
    private MultipartFile idCardFrontFile;

    @Transient
    private MultipartFile idCardBackFile;

    public CompanyAuthentication() {
    }

    public CompanyAuthentication(Integer id) {
        this.id = id;
    }

    public CompanyAuthentication(Integer id, String paper, String idCardFront, String idCardBack, String status) {
        this.id = id;
        this.paper = paper;
        this.idCardFront = idCardFront;
        this.idCardBack = idCardBack;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPaper() {
        return paper;
    }

    public void setPaper(String paper) {
        this.paper = paper;
    }

    public String getIdCardFront() {
        return idCardFront;
    }

    public void setIdCardFront(String idCardFront) {
        this.idCardFront = idCardFront;
    }

    public String getIdCardBack() {
        return idCardBack;
    }

    public void setIdCardBack(String idCardBack) {
        this.idCardBack = idCardBack;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
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
        if (!(object instanceof CompanyAuthentication)) {
            return false;
        }
        CompanyAuthentication other = (CompanyAuthentication) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.myweb.pojo.CompanyAuthentication[ id=" + id + " ]";
    }

    /**
     * @return the paperFile
     */
    public MultipartFile getPaperFile() {
        return paperFile;
    }

    /**
     * @param paperFile the paperFile to set
     */
    public void setPaperFile(MultipartFile paperFile) {
        this.paperFile = paperFile;
    }

    /**
     * @return the idCardFrontFile
     */
    public MultipartFile getIdCardFrontFile() {
        return idCardFrontFile;
    }

    /**
     * @param idCardFrontFile the idCardFrontFile to set
     */
    public void setIdCardFrontFile(MultipartFile idCardFrontFile) {
        this.idCardFrontFile = idCardFrontFile;
    }

    /**
     * @return the idCardBackFile
     */
    public MultipartFile getIdCardBackFile() {
        return idCardBackFile;
    }

    /**
     * @param idCardBackFile the idCardBackFile to set
     */
    public void setIdCardBackFile(MultipartFile idCardBackFile) {
        this.idCardBackFile = idCardBackFile;
    }

    /**
     * @return the serialVersionUID
     */
    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    /**
     * @param aSerialVersionUID the serialVersionUID to set
     */
    public static void setSerialVersionUID(long aSerialVersionUID) {
        serialVersionUID = aSerialVersionUID;
    }

    /**
     * @return the lastUpdated
     */
    public Date getLastUpdated() {
        return lastUpdated;
    }

    /**
     * @param lastUpdated the lastUpdated to set
     */
    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

}
