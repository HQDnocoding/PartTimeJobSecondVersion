/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories;

import com.myweb.dto.GetJobDTO;
import com.myweb.pojo.Company;
import com.myweb.pojo.ImageWorkplace;
import com.myweb.pojo.Job;
import com.myweb.pojo.User;
import jakarta.data.repository.Param;
import jakarta.data.repository.Query;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 *
 * @author dat
 */
public interface CompanyRepository {

    Map<String, Object> getListCompany(Map<String, String> params);

    Company addOrUpdateCompany(Company c);

    Company getCompanyById(int companyId);

    void deleteCompany(int id);

    Company createCompanyDTO(User u, Company c);

    Company getCompanyByEmail(String email);

    Company getCompanyByTaxCode(String taxCode);

    List<Company> getAllCompaniesForDropdown();

    @Query("SELECT DATE_FORMAT(c.createdDate, '%Y-%m') as time, COUNT(c) as count "
            + "FROM Company c WHERE c.createdDate >= :startDate GROUP BY DATE_FORMAT(c.createdDate, '%Y-%m')")
    List<Object[]> countCompaniesByMonth(@Param("startDate") Date startDate);

    Company getCompanyApproved(int id);

    Collection<Job> getCompanyWithJobs(int id);

    User getUser(int id);
    
    Company getCompanyByUserId(int userId);
}
