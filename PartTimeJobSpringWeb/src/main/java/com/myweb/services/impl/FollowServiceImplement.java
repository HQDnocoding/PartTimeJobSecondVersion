/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services.impl;

import com.myweb.pojo.Candidate;
import com.myweb.pojo.Company;
import com.myweb.pojo.Follow;
import com.myweb.repositories.CandidateRepository;
import com.myweb.repositories.CompanyRepository;
import com.myweb.repositories.FollowRepository;
import com.myweb.services.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FollowServiceImplement implements FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    @Transactional
    public Follow followCompany(int candidateId, int companyId) {
        Candidate candidate = candidateRepository.getCandidateById(candidateId);
        Company company = companyRepository.getCompanyById(companyId);

        if (candidate == null || company == null) {
            throw new IllegalArgumentException("Ứng viên hoặc công ty không tồn tại.");
        }

        if (followRepository.isFollowing(candidateId, companyId)) {
            throw new IllegalArgumentException("Bạn đã theo dõi công ty này.");
        }

        Follow follow = new Follow();
        follow.setCandidateId(candidate);
        follow.setCompanyId(company);
        return followRepository.addFollow(follow);
    }

    @Override
    @Transactional
    public void unfollowCompany(int candidateId, int companyId) {
        if (!followRepository.isFollowing(candidateId, companyId)) {
            throw new IllegalArgumentException("Bạn chưa theo dõi công ty này.");
        }
        followRepository.deleteFollow(candidateId, companyId);
    }

    @Override
    public boolean isFollowing(int candidateId, int companyId) {
        return followRepository.isFollowing(candidateId, companyId);
    }

    @Override
    public List<Follow> getFollowedCompanies(int candidateId) {
        return followRepository.getFollowedCompanies(candidateId);
    }

    @Override
    public List<Follow> getFollowers(int companyId) {
        return followRepository.getFollowers(companyId);
    }
}