/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services;

import com.myweb.dto.CreateApplicationDTO;
import com.myweb.pojo.Application;
import java.security.Principal;
import java.util.Map;

/**
 *
 * @author huaquangdat
 */
public interface ApplicationService {

    // Thêm mới hoặc cập nhật 1 đơn ứng tuyển
    Application addOrUpdateApplication(Application a);

    // Lấy danh sách đơn ứng tuyển
    Map<String, Object> getListApplication(Map<String, String> params, Principal principal);

    // Lấy chi tiết 1 đơn ứng tuyển theo Id
    Application getApplicationById(int applicationId);

    // Xóa 1 đơn ứng tuyển theo Id
    void deleteApplication(int id);

    // Thêm mới 1 đơn ứng tuyển
    Application addApplication(Application application);

    //dat, thêm mới bằng dto
    Application addApplicationDto(CreateApplicationDTO dto);

    Application updateStatus(Application application, String username);

    Application getApplicationDetailById(int id, String username);
}
