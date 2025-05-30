/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services;

import com.myweb.pojo.Follow;

import java.util.List;

public interface FollowService {
    Follow followCompany(int candidateId, int companyId);
    void unfollowCompany(int candidateId, int companyId);
    boolean isFollowing(int candidateId, int companyId);
    List<Follow> getFollowedCompanies(int candidateId);
    List<Follow> getFollowers(int companyId);
}