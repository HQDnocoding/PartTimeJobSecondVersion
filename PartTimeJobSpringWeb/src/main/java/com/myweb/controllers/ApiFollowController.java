/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.pojo.Candidate;
import com.myweb.pojo.Company;
import com.myweb.pojo.Follow;
import com.myweb.pojo.User;
import com.myweb.repositories.CandidateRepository;
import com.myweb.repositories.CompanyRepository;
import com.myweb.repositories.UserRepository;
import com.myweb.services.FollowService;
import com.myweb.services.EmailService;
import com.myweb.utils.GeneralUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiFollowController {

    @Autowired
    private FollowService followService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @PostMapping("/secure/follow/{companyId}")
    public ResponseEntity<Map<String, Object>> followCompany(@PathVariable("companyId") int companyId, Principal principal) {
        try {
            int candidateId = getCandidateIdFromPrincipal(principal);
            Follow follow = followService.followCompany(candidateId, companyId);

            // Gửi email thông báo
            String candidateEmail = follow.getCandidateId().getUserId().getUsername();
            String companyName = follow.getCompanyId().getName();
            if (!isValidEmail(candidateEmail)) {
                System.err.println("Invalid email address for follow notification: " + candidateEmail);
            } else {
                String subject = "Bạn đã theo dõi " + companyName;
                String body = String.format(
                        "Chào %s,\n\nBạn đã theo dõi công ty %s thành công.\nBạn sẽ nhận được thông báo khi công ty đăng công việc mới.\n\n"
                        + "Trân trọng,\nHệ thống tìm kiếm việc làm bán thời gian",
                        follow.getCandidateId().getFullName(), companyName
                );
                try {
                    emailService.sendEmail(candidateEmail, subject, body);
                    System.out.println("Follow email sent to: " + candidateEmail);
                } catch (Exception e) {
                    System.err.println("Failed to send follow email to " + candidateEmail + ": " + e.getMessage());
                }
            }

            // Lấy số lượng người theo dõi
            List<Follow> followers = followService.getFollowers(companyId);
            int followerCount = followers.size();
            boolean isFollowing = true;

            System.out.println("Follow successful: companyId=" + companyId + ", candidateId=" + candidateId + ", followerCount=" + followerCount);

            return new ResponseEntity<>(Map.of(
                    "message", "Theo dõi công ty thành công",
                    "data", follow,
                    "followerCount", followerCount,
                    "isFollowing", isFollowing
            ), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            System.err.println("Follow error: " + e.getMessage());
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.err.println("Follow error: " + e.getMessage());
            return new ResponseEntity<>(Map.of("message", "Theo dõi công ty thất bại: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/secure/unfollow/{companyId}")
    public ResponseEntity<Map<String, Object>> unfollowCompany(@PathVariable("companyId") int companyId, Principal principal) {
        try {
            int candidateId = getCandidateIdFromPrincipal(principal);
            Candidate candidate = candidateRepository.getCandidateById(candidateId);
            Company company = companyRepository.getCompanyById(companyId);
            followService.unfollowCompany(candidateId, companyId);

            // Gửi email thông báo
            String candidateEmail = candidate.getUserId().getUsername();
            String companyName = company.getName();
            if (!isValidEmail(candidateEmail)) {
                System.err.println("Invalid email address for unfollow notification: " + candidateEmail);
            } else {
                String subject = "Bạn đã hủy theo dõi " + companyName;
                String body = String.format(
                        "Chào %s,\n\nBạn đã hủy theo dõi công ty %s thành công.\nBạn sẽ không nhận được thông báo khi công ty đăng công việc mới nữa.\n\nTrân trọng,\nHệ thống tìm kiếm việc làm bán thời gian",
                        candidate.getFullName(), companyName
                );
                try {
                    emailService.sendEmail(candidateEmail, subject, body);
                    System.out.println("Unfollow email sent to: " + candidateEmail);
                } catch (Exception e) {
                    System.err.println("Failed to send unfollow email to " + candidateEmail + ": " + e.getMessage());
                }
            }

            // Lấy số lượng người theo dõi
            List<Follow> followers = followService.getFollowers(companyId);
            int followerCount = followers.size();
            boolean isFollowing = false;

            System.out.println("Unfollow successful: companyId=" + companyId + ", candidateId=" + candidateId + ", followerCount=" + followerCount);

            return new ResponseEntity<>(Map.of(
                    "message", "Bỏ theo dõi công ty thành công",
                    "followerCount", followerCount,
                    "isFollowing", isFollowing
            ), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            System.err.println("Unfollow error: " + e.getMessage());
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.err.println("Unfollow error: " + e.getMessage());
            return new ResponseEntity<>(Map.of("message", "Bỏ theo dõi công ty thất bại: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Hàm kiểm tra email hợp lệ
    private boolean isValidEmail(String email) {
        if (email == null) {
            return false;
        }
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        return email.matches(emailRegex);
    }

    @GetMapping("/secure/is-following/{companyId}")
    public ResponseEntity<Map<String, Object>> isFollowing(@PathVariable("companyId") int companyId, Principal principal) {
        try {
            int candidateId = getCandidateIdFromPrincipal(principal);
            boolean isFollowing = followService.isFollowing(candidateId, companyId);
            return new ResponseEntity<>(Map.of("message", "Lấy trạng thái theo dõi thành công", "data", isFollowing), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Lấy trạng thái theo dõi thất bại: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/secure/followed-companies")
    public ResponseEntity<Map<String, Object>> getFollowedCompanies(Principal principal) {
        try {
            int candidateId = getCandidateIdFromPrincipal(principal);
            List<Follow> followedCompanies = followService.getFollowedCompanies(candidateId);
            return new ResponseEntity<>(Map.of("message", "Lấy danh sách công ty đã theo dõi thành công", "data", followedCompanies), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Lấy danh sách công ty đã theo dõi thất bại: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/secure/followers/{companyId}")
    public ResponseEntity<Map<String, Object>> getFollowers(@PathVariable("companyId") int companyId, Principal principal) {
        try {
            int userCompanyId = getCompanyIdFromPrincipal(principal);
            if (userCompanyId != companyId) {
                return new ResponseEntity<>(Map.of("message", "Không có quyền truy cập danh sách người theo dõi"), HttpStatus.FORBIDDEN);
            }
            List<Follow> followers = followService.getFollowers(companyId);
            return new ResponseEntity<>(Map.of("message", "Lấy danh sách người theo dõi thành công", "data", followers), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Lấy danh sách người theo dõi thất bại: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private int getCandidateIdFromPrincipal(Principal principal) {
        User user = userRepository.getUserByUsername(principal.getName());
        if (user.getRole() == null || !user.getRole().equals(GeneralUtils.Role.ROLE_CANDIDATE.toString())) {
            throw new SecurityException("Người dùng không phải là ứng viên");
        }
        Candidate candidate = candidateRepository.getCandidateByUserId(user.getId());
        if (candidate == null) {
            throw new IllegalArgumentException("Không tìm thấy ứng viên");
        }
        return candidate.getId();
    }

    private int getCompanyIdFromPrincipal(Principal principal) {
        User user = userRepository.getUserByUsername(principal.getName());
        if (user.getRole() == null || !user.getRole().equals(GeneralUtils.Role.ROLE_COMPANY.toString())) {
            throw new SecurityException("Người dùng không phải là công ty");
        }
        Company company = companyRepository.getCompanyByUserId(user.getId());
        if (company == null) {
            throw new IllegalArgumentException("Không tìm thấy công ty");
        }
        return company.getId();
    }
}
