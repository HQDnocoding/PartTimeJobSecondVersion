package com.myweb.repositories;

import com.myweb.pojo.Candidate;
import com.myweb.pojo.User;
import java.util.List;
import java.util.Map;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author huaquangdat
 */
public interface CandidateRepository {

    Candidate addOrUpdateCandidate(Candidate c);

    Map<String, Object> getListCandidate(Map<String, String> params);

    Candidate getCandidateById(int candidateId);

    Object createCandidate(User u, Candidate c, boolean isGoogleSignIn);

    Candidate getCandidateByEmail(String email);

    Candidate getCandidateByPhone(String phone);

    List<Candidate> getCandidateList();

    void deleteCandidate(int id);

    Candidate getCandidateByUserId(int userId);

    Candidate updateCandidate(Candidate can);

    User getUser(int id);

}
