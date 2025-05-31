/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services;

import com.myweb.dto.CreateCandidateReviewDTO;
import com.myweb.dto.GetCandidateReviewDTO;
import java.security.Principal;
import java.util.Map;

public interface CandidateReviewService {

    GetCandidateReviewDTO createReview(CreateCandidateReviewDTO dto, Principal principal);

    Map<String, Object> getListReview(Map<String, String> params, Integer candidateId);

    GetCandidateReviewDTO getReviewById(Integer id);

    GetCandidateReviewDTO updateReview(Integer id, CreateCandidateReviewDTO dto, Principal principal);

    void deleteReview(Integer id, Principal principal);

    Double getAverageRating(Integer candidateId);
    
    Map<String, Object> getReviewsByCompany(Map<String, String> params, Integer companyId);
}
