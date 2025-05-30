/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services;

import com.myweb.dto.CreateCandidateDTO;
import com.myweb.pojo.Candidate;
import com.myweb.pojo.User;
import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 *
 * @author huaquangdat
 */
public interface CandidateService {

    // Thêm mới hoặc cập nhật ứng viên
    Candidate addOrUpdateCandidate(Candidate c);

    // Lấy danh sách ứng viên với tiêu chí lọc và phân trang
    Map<String, Object> getListCandidate(Map<String, String> params);

    // Lấy chi tiết ứng viên theo ID
    Candidate getCandidateById(int candidateId);

    // Tạo ứng viên từ DTO
    Candidate createCandidateDTO(CreateCandidateDTO c);

    // Lấy danh sách tất cả ứng viên
    List<Candidate> getCandidateList();

    // Xóa ứng viên theo ID
    void deleteCandidate(int id);

    Candidate getCandidateByUserId(int userId);

    User createCandidateByGoogleAccount(Map<String, String> params);

    Candidate updateCadidate(Candidate candidate, Principal principal, int id);

    Map<String, Object> getUserIdAndRole(int id);

}
