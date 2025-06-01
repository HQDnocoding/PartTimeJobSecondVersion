/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services;

import com.myweb.dto.CreateCompanyReviewDTO;
import com.myweb.dto.GetCompanyReviewDTO;
import com.myweb.pojo.CompanyReview;
import java.security.Principal;
import java.util.Map;

public interface CompanyReviewService {

    GetCompanyReviewDTO createReview(CreateCompanyReviewDTO dto, Principal principal);

    Map<String, Object> getListReview(Map<String, String> params, Integer companyId);

    GetCompanyReviewDTO getReviewById(Integer id);

    GetCompanyReviewDTO updateReview(Integer id, CreateCompanyReviewDTO dto, Principal principal);

    void deleteReview(Integer id, Principal principal);

    Double getAverageRating(Integer companyId);
    CompanyReview getReviewByApplicationId(Integer applicationId);
    
}
