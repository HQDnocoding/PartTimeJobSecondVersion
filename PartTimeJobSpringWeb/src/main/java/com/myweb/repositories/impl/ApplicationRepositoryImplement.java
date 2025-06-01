/*
 * Click nbfs://SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories.impl;

import com.myweb.pojo.Application;
import com.myweb.pojo.Job;
import com.myweb.pojo.User;
import com.myweb.repositories.ApplicationRepository;
import com.myweb.utils.GeneralUtils;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.*;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * @author huaquangdat
 */
@Repository
@Transactional
public class ApplicationRepositoryImplement implements ApplicationRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    // Thêm mới hoặc cập nhật một đơn ứng tuyển
    @Override
    public Application addOrUpdateApplication(Application a) {
        Session session = this.factory.getObject().getCurrentSession();
        try {
            if (a.getId() == null) {
                session.persist(a);
            } else {
                session.merge(a);
            }
            return a;
        } catch (Exception e) {
            return null;
        }
    }

    // Lấy danh sách đơn ứng tuyển với các tiêu chí lọc và phân trang
    @Override
    public Map<String, Object> getListApplication(Map<String, String> params, User user) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();

        // Đếm tổng số bản ghi
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Application> countRoot = countQuery.from(Application.class);
        countRoot.join("jobId", JoinType.LEFT);
        countRoot.join("candidateId", JoinType.LEFT);
        countQuery.select(cb.count(countRoot));
        countQuery.where(buildPredicates(params, user, cb, countRoot).toArray(new Predicate[0]));
        Long totalRecords = session.createQuery(countQuery).getSingleResult();

        // Tạo CriteriaQuery cho Application
        CriteriaQuery<Application> cq = cb.createQuery(Application.class);
        Root<Application> applicationRoot = cq.from(Application.class);
        applicationRoot.join("jobId", JoinType.LEFT);
        applicationRoot.join("candidateId", JoinType.LEFT);
        cq.where(buildPredicates(params, user, cb, applicationRoot).toArray(new Predicate[0]));

        // Sắp xếp
        String sortBy = params.getOrDefault("sortBy", "appliedDate");
        String sortOrder = params.getOrDefault("sortOrder", "desc");
        if ("candidateId.fullName".equals(sortBy)) {
            Path<String> sortPath = applicationRoot.get("candidateId").get("fullName");
            cq.orderBy(sortOrder.equalsIgnoreCase("asc") ? cb.asc(sortPath) : cb.desc(sortPath));
        } else if ("jobId.jobName".equals(sortBy)) {
            Path<String> sortPath = applicationRoot.get("jobId").get("jobName");
            cq.orderBy(sortOrder.equalsIgnoreCase("asc") ? cb.asc(sortPath) : cb.desc(sortPath));
        } else {
            cq.orderBy(sortOrder.equalsIgnoreCase("asc") ? cb.asc(applicationRoot.get(sortBy)) : cb.desc(applicationRoot.get(sortBy)));
        }

        Query query = session.createQuery(cq);

        // Phân trang
        int page = 1;
        try {
            page = Integer.parseInt(params.getOrDefault("page", "1"));
        } catch (NumberFormatException e) {
            System.out.println("Invalid page number, defaulting to 1");
        }
        int start = (page - 1) * GeneralUtils.PAGE_SIZE;
        query.setFirstResult(start);
        query.setMaxResults(GeneralUtils.PAGE_SIZE);

        // Lấy danh sách kết quả
        List<Application> results = query.getResultList();

        // Tính tổng số trang
        int totalPages = (int) Math.ceil((double) totalRecords / GeneralUtils.PAGE_SIZE);
        if (totalPages < page || page <= 0) {
            page = 1;
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("applications", results);
        result.put("currentPage", page);
        result.put("pageSize", GeneralUtils.PAGE_SIZE);
        result.put("totalPages", totalPages);
        result.put("totalItems", totalRecords);

        return result;
    }

    // Xây dựng các điều kiện lọc
    private List<Predicate> buildPredicates(Map<String, String> params, User user, CriteriaBuilder cb, Root<Application> root) {
        List<Predicate> predicates = new ArrayList<>();

        // Kiểm tra quyền người dùng
        if (user.getRole().equals(GeneralUtils.Role.ROLE_COMPANY.toString())) {
            predicates.add(cb.equal(root.get("jobId").get("companyId").get("id"), user.getCompany().getId()));
        } else if (user.getRole().equals(GeneralUtils.Role.ROLE_CANDIDATE.toString())) {
            predicates.add(cb.equal(root.get("candidateId").get("id"), user.getCandidate().getId()));
        }

        predicates.add(cb.equal(root.get("jobId").get("isActive"), true));

        if (params != null) {
            String status = params.get("status");
            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            String keyword = params.get("keyword");
            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("jobId").get("jobName")), "%" + keyword.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("jobId").get("description")), "%" + keyword.toLowerCase() + "%")
                ));
            }

            String candidateName = params.get("candidateName");
            if (candidateName != null && !candidateName.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("candidateId").get("fullName")), "%" + candidateName.toLowerCase() + "%"));
            }

            String jobName = params.get("jobName");
            if (jobName != null && !jobName.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("jobId").get("jobName")), "%" + jobName.toLowerCase() + "%"));
            }

            String jobIdStr = params.get("jobId");
            if (jobIdStr != null && !jobIdStr.isEmpty()) {
                try {
                    Long jobId = Long.valueOf(jobIdStr);
                    predicates.add(cb.equal(root.get("jobId").get("id"), jobId));
                } catch (NumberFormatException e) {
                    System.out.println("Invalid jobId: " + jobIdStr);
                }
            }

            String city = params.get("city");
            if (city != null && !city.isEmpty()) {
                String normalizedCity = normalizeLocation(city);
                if (normalizedCity != null) {
                    predicates.add(cb.equal(cb.lower(root.get("jobId").get("city")), normalizedCity.toLowerCase()));
                }
            }

            String district = params.get("district");
            if (district != null && !district.isEmpty()) {
                String normalizedDistrict = normalizeLocation(district);
                if (normalizedDistrict != null) {
                    predicates.add(cb.equal(cb.lower(root.get("jobId").get("district")), normalizedDistrict.toLowerCase()));
                }
            }
        }

        return predicates;
    }

    // Chuẩn hóa tên địa điểm
    private String normalizeLocation(String location) {
        String normalized = location.trim()
                .replaceAll("^(Thành phố|Tỉnh)\\s*", "")
                .replaceAll("\\s+", " ");
        return normalized.substring(0, 1).toUpperCase() + normalized.substring(1).toLowerCase();
    }

    // Lấy chi tiết một đơn ứng tuyển theo ID
    @Override
    public Application getApplicationById(int applicationId) {
        Session session = this.factory.getObject().getCurrentSession();
        Application application = session.get(Application.class, applicationId);
        return application;
    }

    // Xóa một đơn ứng tuyển theo ID
    @Override
    public void deleteApplication(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        Application a = getApplicationById(id);
        session.remove(a);
    }

    @Override
    public List<Application> findByJobIdAndStatus(Integer jobId, String status) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Application> query = builder.createQuery(Application.class);
        Root<Application> root = query.from(Application.class);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(builder.equal(root.get("jobId").get("id"), jobId));
        predicates.add(builder.equal(root.get("status"), status));

        query.where(predicates.toArray(new Predicate[0]));
        return session.createQuery(query).getResultList();
    }

}