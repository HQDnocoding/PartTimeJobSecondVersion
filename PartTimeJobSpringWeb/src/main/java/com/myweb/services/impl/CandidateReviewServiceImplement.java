package com.myweb.services.impl;

import com.myweb.dto.CreateCandidateReviewDTO;
import com.myweb.dto.GetCandidateReviewDTO;
import com.myweb.pojo.*;
import com.myweb.repositories.*;
import com.myweb.services.CandidateReviewService;
import com.myweb.utils.GeneralUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.Date;
import java.util.Map;

@Service
@Transactional
public class CandidateReviewServiceImplement implements CandidateReviewService {

    @Autowired
    private CandidateReviewRepository reviewRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Override
    public GetCandidateReviewDTO createReview(CreateCandidateReviewDTO dto, Principal principal) {
        System.out.println("DTO: " + dto);
        System.out.println("Principal: " + principal.getName());

        if (dto == null) {
            throw new IllegalArgumentException("Dữ liệu đánh giá là bắt buộc.");
        }

        User user = userRepository.getUserByUsername(principal.getName());
        System.out.println("User ID: " + user.getId() + ", Role: " + user.getRole());
        if (!user.getRole().equals(GeneralUtils.Role.ROLE_COMPANY.toString())) {
            throw new SecurityException("Chỉ công ty mới có thể tạo đánh giá ứng viên.");
        }

        Company company = companyRepository.getCompanyById(dto.getCompanyId());
        System.out.println("Company User ID: " + (company != null ? company.getUserId().getId() : "null"));
        Job job = jobRepository.getJobById(dto.getJobId());
        System.out.println("Job Company ID: " + (job != null ? job.getCompanyId().getId() : "null"));
        Candidate candidate = candidateRepository.getCandidateById(dto.getCandidateId());

        if (company == null || job == null || candidate == null) {
            throw new IllegalArgumentException("Công ty, công việc hoặc ứng viên không hợp lệ.");
        }

        if (!company.getUserId().getId().equals(user.getId())) {
            throw new SecurityException("Bạn không có quyền tạo đánh giá này.");
        }

        if (!job.getCompanyId().getId().equals(company.getId())) {
            throw new IllegalArgumentException("Công việc không thuộc công ty này.");
        }

        // Kiểm tra xem đã có đánh giá cho ứng viên và công việc này chưa
        CandidateReview existingReview = reviewRepository.findByCandidateIdAndJobId(dto.getCandidateId(), dto.getJobId());
        if (existingReview != null) {
            throw new IllegalArgumentException("Đã tồn tại đánh giá cho ứng viên này trong công việc này.");
        }

        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new IllegalArgumentException("Điểm đánh giá phải từ 1 đến 5.");
        }

        CandidateReview review = new CandidateReview();
        review.setCompanyId(company);
        review.setJobId(job);
        review.setCandidateId(candidate);
        review.setRating(dto.getRating());
        review.setReview(dto.getReview());
        review.setReviewDate(new Date());

        review = reviewRepository.addOrUpdateReview(review);
        return new GetCandidateReviewDTO(review);
    }

    @Override
    public Map<String, Object> getListReview(Map<String, String> params, Integer candidateId) {
        return reviewRepository.getListReview(params, candidateId);
    }

    @Override
    public GetCandidateReviewDTO getReviewById(Integer id) {
        CandidateReview review = reviewRepository.getReviewById(id);
        if (review == null) {
            throw new IllegalArgumentException("Không tìm thấy đánh giá.");
        }
        return new GetCandidateReviewDTO(review);
    }

    @Override
    public GetCandidateReviewDTO updateReview(Integer id, CreateCandidateReviewDTO dto, Principal principal) {
        if (dto == null) {
            throw new IllegalArgumentException("Dữ liệu đánh giá là bắt buộc.");
        }

        User user = userRepository.getUserByUsername(principal.getName());
        CandidateReview review = reviewRepository.getReviewById(id);

        if (review == null) {
            throw new IllegalArgumentException("Không tìm thấy đánh giá.");
        }

        if (!user.getRole().equals(GeneralUtils.Role.ROLE_COMPANY.toString()) ||
            !review.getCompanyId().getUserId().getId().equals(user.getId())) {
            throw new SecurityException("Bạn không có quyền cập nhật đánh giá này.");
        }

        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new IllegalArgumentException("Điểm đánh giá phải từ 1 đến 5.");
        }

        review.setRating(dto.getRating());
        review.setReview(dto.getReview());
        review.setReviewDate(new Date());
        review = reviewRepository.addOrUpdateReview(review);
        return new GetCandidateReviewDTO(review);
    }

    @Override
    public void deleteReview(Integer id, Principal principal) {
        User user = userRepository.getUserByUsername(principal.getName());
        CandidateReview review = reviewRepository.getReviewById(id);

        if (review == null) {
            throw new IllegalArgumentException("Không tìm thấy đánh giá.");
        }

        if (!user.getRole().equals(GeneralUtils.Role.ROLE_COMPANY.toString()) &&
            !user.getRole().equals(GeneralUtils.Role.ROLE_ADMIN.toString()) ||
            (!user.getRole().equals(GeneralUtils.Role.ROLE_ADMIN.toString()) &&
             !review.getCompanyId().getUserId().getId().equals(user.getId()))) {
            throw new SecurityException("Bạn không có quyền xóa đánh giá này.");
        }

        reviewRepository.deleteReview(id);
    }

    @Override
    public Double getAverageRating(Integer candidateId) {
        return reviewRepository.getAverageRating(candidateId);
    }
}