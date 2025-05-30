/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.dto;

import com.myweb.pojo.Candidate;
import com.myweb.pojo.User;
import java.util.Date;

/**
 *
 * @author huaquangdat
 */
public class GetCandidateDTO {

    private Integer id;
    private String fullName;
    private Date dateOfBirth;
    private String city;
    private String avatar;
    private String selfDescription;
    private String phone;
    private String curriculumVitae;

    public GetCandidateDTO(Candidate candidate) {
        this.avatar = candidate.getAvatar();
        this.city = candidate.getCity();
        this.curriculumVitae = candidate.getCurriculumVitae();
        this.dateOfBirth = candidate.getDateOfBirth();
        this.fullName = candidate.getFullName();
        this.phone = candidate.getPhone();
        this.selfDescription = candidate.getSelfDescription();
        this.id = candidate.getId();
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

    /**
     * @return the fullName
     */
    public String getFullName() {
        return fullName;
    }

    /**
     * @param fullName the fullName to set
     */
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    /**
     * @return the dateOfBirth
     */
    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    /**
     * @param dateOfBirth the dateOfBirth to set
     */
    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
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
     * @return the phone
     */
    public String getPhone() {
        return phone;
    }

    /**
     * @param phone the phone to set
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * @return the curriculumVitae
     */
    public String getCurriculumVitae() {
        return curriculumVitae;
    }

    /**
     * @param curriculumVitae the curriculumVitae to set
     */
    public void setCurriculumVitae(String curriculumVitae) {
        this.curriculumVitae = curriculumVitae;
    }
}
