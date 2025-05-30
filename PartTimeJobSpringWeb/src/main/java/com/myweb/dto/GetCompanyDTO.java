/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.dto;

import com.myweb.pojo.Company;
import com.myweb.pojo.ImageWorkplace;
import java.util.Collection;

/**
 *
 * @author huaquangdat
 */
public class GetCompanyDTO {

    private Integer id;
    private String name;
    private String taxCode;
    private String fullAddress;
    private String city;
    private String district;
    private String selfDescription;
    private String status;
    private String avatar;
    private Collection<ImageWorkplace> imageWorkplaceCollection;
    private String email;

    public GetCompanyDTO(Company c) {
        this.id = c.getId();
        this.name = c.getName();
        this.taxCode = c.getTaxCode();
        this.avatar = c.getAvatar();
        this.fullAddress = c.getFullAddress();
        this.email = c.getUserId().getUsername();
        this.city = c.getCity();
        this.district = c.getDistrict();
        this.status = c.getStatus();
        this.imageWorkplaceCollection = c.getImageWorkplaceCollection();
        this.selfDescription = c.getSelfDescription();
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the taxCode
     */
    public String getTaxCode() {
        return taxCode;
    }

    /**
     * @param taxCode the taxCode to set
     */
    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    /**
     * @return the fullAddress
     */
    public String getFullAddress() {
        return fullAddress;
    }

    /**
     * @param fullAddress the fullAddress to set
     */
    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }

    /**
     * @return the city
     */
    public String getCity() {
        return city;
    }

    /**
     * @param city the city to set
     */
    public void setCity(String city) {
        this.city = city;
    }

    /**
     * @return the district
     */
    public String getDistrict() {
        return district;
    }

    /**
     * @param district the district to set
     */
    public void setDistrict(String district) {
        this.district = district;
    }

    /**
     * @return the selfDescription
     */
    public String getSelfDescription() {
        return selfDescription;
    }

    /**
     * @param selfDescription the selfDescription to set
     */
    public void setSelfDescription(String selfDescription) {
        this.selfDescription = selfDescription;
    }

    /**
     * @return the status
     */
    public String getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * @return the avatar
     */
    public String getAvatar() {
        return avatar;
    }

    /**
     * @param avatar the avatar to set
     */
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    /**
     * @return the imageWorkplaceCollection
     */
    public Collection<ImageWorkplace> getImageWorkplaceCollection() {
        return imageWorkplaceCollection;
    }

    /**
     * @param imageWorkplaceCollection the imageWorkplaceCollection to set
     */
    public void setImageWorkplaceCollection(Collection<ImageWorkplace> imageWorkplaceCollection) {
        this.imageWorkplaceCollection = imageWorkplaceCollection;
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
     * @return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Integer id) {
        this.id = id;
    }
}
