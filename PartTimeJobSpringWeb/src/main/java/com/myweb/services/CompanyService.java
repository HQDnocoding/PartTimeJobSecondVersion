/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services;

import com.myweb.dto.CreateCompanyDTO;
import com.myweb.dto.GetJobDTO;
import com.myweb.pojo.Company;
import com.myweb.pojo.Job;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 *
 * @author dat
 */
public interface CompanyService {

    // Lấy danh sách công ty với tiêu chí lọc và phân trang
    Map<String, Object> getListCompany(Map<String, String> params);

    // Lấy chi tiết công ty theo ID
    Company getCompany(int companyId);

    Collection<Job> getCompanyWithJobs(int companyId);

    // Thêm mới hoặc cập nhật công ty
    Company addOrUpdate(Company p);

    // Xóa công ty theo ID
    void deleteCompany(int id);

    // Tạo công ty từ DTO
    Company createCompanyDTO(CreateCompanyDTO c);

    public Object getAllCompany();

    List<Company> getAllCompaniesForDropdown();

    Company getCompanyApproved(int id);

    Map<String, Object> getUserIdAndRole(int id);
    
    Company getCompanyByUserId(int userId);
}
