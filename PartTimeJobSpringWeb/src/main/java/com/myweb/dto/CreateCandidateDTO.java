/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.dto;

import java.util.Date;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author huaquangdat
 */
public class CreateCandidateDTO {
    private String fullName;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date dateOfBirth;
    private String city;
    private MultipartFile avatarFile;
    private String selfDescription;
    private String phone;
    private MultipartFile curriculumVitaeFile;
    private String username;
    private String password;
    private String confirmPassword;
    private String otp;

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
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return the otp
     */
    public String getOtp() {
        return otp;
    }

    /**
     * @param otp the otp to set
     */
    public void setOtp(String otp) {
        this.otp = otp;
    }

    /**
     * @return the confirmPassword
     */
    public String getConfirmPassword() {
        return confirmPassword;
    }

    /**
     * @param confirmPassword the confirmPassword to set
     */
    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }


}
