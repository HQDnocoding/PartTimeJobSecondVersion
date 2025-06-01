/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories;

import com.myweb.pojo.Application;
import com.myweb.pojo.User;
import java.util.List;
import java.util.Map;

/**
 *
 * @author huaquangdat
 */
public interface ApplicationRepository {

    Application addOrUpdateApplication(Application a);

    Map<String, Object> getListApplication(Map<String, String> params, User user);

    Application getApplicationById(int applicationId);

    void deleteApplication(int id);

    List<Application> findByJobIdAndStatus(Integer jobId, String status);
    
    List<Application> findByJobIdAndCandidateIdAndStatus(Integer jobId, Integer candidateId, String status);
    
}
