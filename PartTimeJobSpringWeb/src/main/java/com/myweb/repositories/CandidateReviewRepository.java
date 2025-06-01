/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories;

import com.myweb.pojo.CandidateReview;
import java.util.Map;

public interface CandidateReviewRepository {

    CandidateReview addOrUpdateReview(CandidateReview review);

    Map<String, Object> getListReview(Map<String, String> params, Integer candidateId);

    CandidateReview getReviewById(Integer id);

    void deleteReview(Integer id);

    Double getAverageRating(Integer candidateId);
    
    CandidateReview findByCandidateIdAndJobId(Integer candidateId, Integer jobId);
    
    Map<String, Object> getReviewsByCompany(Map<String, String> params, Integer companyId);
}
