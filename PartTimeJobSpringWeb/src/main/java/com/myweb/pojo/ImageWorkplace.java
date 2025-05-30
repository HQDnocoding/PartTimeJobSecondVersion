/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

/**
 *
 * @author dat
 */
@Entity
@Table(name = "image_workplace")
@NamedQueries({
    @NamedQuery(name = "ImageWorkplace.findAll", query = "SELECT i FROM ImageWorkplace i"),
    @NamedQuery(name = "ImageWorkplace.findById", query = "SELECT i FROM ImageWorkplace i WHERE i.id = :id"),
    @NamedQuery(name = "ImageWorkplace.findByImageUrl", query = "SELECT i FROM ImageWorkplace i WHERE i.imageUrl = :imageUrl")})
public class ImageWorkplace implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "image_url")
    private String imageUrl;

    @JoinColumn(name = "company_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    @JsonIgnore
    private Company companyId;

    @Transient
    private MultipartFile file;

    public ImageWorkplace() {
    }

    public ImageWorkplace(Integer id) {
        this.id = id;
    }

    public ImageWorkplace(String imageUrl, Company company) {
        this.imageUrl = imageUrl;
        this.companyId = company;
    }

    public ImageWorkplace(Integer id, String imageUrl) {
        this.id = id;
        this.imageUrl = imageUrl;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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
        if (!(object instanceof ImageWorkplace)) {
            return false;
        }
        ImageWorkplace other = (ImageWorkplace) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return imageUrl;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
