/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories;

import com.myweb.pojo.CompanyReview;
import java.util.Map;

public interface CompanyReviewRepository {

    CompanyReview addOrUpdateReview(CompanyReview review);

    Map<String, Object> getListReview(Map<String, String> params, Integer companyId);

    CompanyReview getReviewById(Integer id);

    void deleteReview(Integer id);

    Double getAverageRating(Integer companyId);
    
    CompanyReview findByApplicationId(Integer applicationId);
}
