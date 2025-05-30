/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories.impl;

import com.myweb.pojo.Candidate;
import com.myweb.pojo.User;
import com.myweb.repositories.CandidateRepository;
import com.myweb.utils.GeneralUtils;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author huaquangdat
 */
@Repository
@Transactional
public class CandidateRepositoryImplement implements CandidateRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    // Thêm hoặc cập nhật ứng viên
    @Override
    public Candidate addOrUpdateCandidate(Candidate c) {
        Session session = this.factory.getObject().getCurrentSession();
        try {
            if (c.getId() == null) {
                session.persist(c.getUserId());
                session.persist(c);
            } else {
                session.merge(c);
            }
            return c;
        } catch (Exception e) {
            return null;
        }
    }

    // Chuẩn hóa giá trị địa điểm (location) bằng cách loại bỏ tiền tố "Thành phố", "Tỉnh" và định dạng lại chuỗi.
    private String normalizeLocation(String location) {
        // Kiểm tra nếu location null hoặc rỗng sau khi trim
        if (location == null || location.trim().isEmpty()) {
            return null;
        }
        // Loại bỏ tiền tố "Thành phố", "Tỉnh" và chuẩn hóa khoảng trắng
        String normalized = location.trim()
                .replaceAll("^(Thành phố|Tỉnh)\\s*", "") // Bỏ "Thành phố" hoặc "Tỉnh" ở đầu
                .replaceAll("\\s+", " "); // Thay nhiều khoảng trắng bằng 1 khoảng trắng
        // Viết hoa chữ cái đầu, còn lại viết thường
        return normalized.substring(0, 1).toUpperCase() + normalized.substring(1).toLowerCase();
    }

    // Lấy danh sách ứng viên với các tiêu chí lọc và phân trang.
    @Override
    public Map<String, Object> getListCandidate(Map<String, String> params) {
        boolean flag = false;
        // Lấy session hiện tại từ Hibernate
        Session s = this.factory.getObject().getCurrentSession();
        // Khởi tạo CriteriaBuilder để xây dựng truy vấn động
        CriteriaBuilder cb = s.getCriteriaBuilder();

        // Tạo CriteriaQuery để truy vấn đối tượng Candidate
        CriteriaQuery<Candidate> cq = cb.createQuery(Candidate.class);
        Root<Candidate> candidateRoot = cq.from(Candidate.class);

        // Danh sách các điều kiện lọc
        List<Predicate> predicates = new ArrayList<>();

        // Xử lý các tham số lọc
        if (params != null) {
            String fullName = params.get("fullName");
            if (fullName != null && !fullName.isEmpty()) {
                predicates.add(cb.like(candidateRoot.get("fullName"), String.format("%%%s%%", fullName)));
            }

            String email = params.get("email");
            if (email != null && !email.isEmpty()) {
                predicates.add(cb.equal(candidateRoot.get("email"), email));
            }

            String city = params.get("city");
            if (city != null && !city.isEmpty()) {
                city = normalizeLocation(city);
                if (city != null) {
                    predicates.add(cb.equal(cb.lower(candidateRoot.get("city")), city.toLowerCase()));
                }
            }

            String phone = params.get("phone");
            if (phone != null && !phone.isEmpty()) {
                predicates.add(cb.equal(candidateRoot.get("phone"), phone));
            }
        }
        if (!predicates.isEmpty()) {
            flag = true;
            cq.where(cb.and(predicates.toArray(Predicate[]::new)));
        }

        // Tạo truy vấn và đếm tổng số bản ghi
        Query query = s.createQuery(cq);
        int totalRecords = query.getResultList().size();

        // Xử lý phân trang
        int page = 1;
        page = Integer.parseInt(params.getOrDefault("page", "1"));

        int start = flag ? 0 : (page - 1) >= 1 ? (page - 1) * GeneralUtils.PAGE_SIZE : 0;

        // Thiết lập phân trang cho truy vấn
        query.setFirstResult(start);
        query.setMaxResults(GeneralUtils.PAGE_SIZE);

        // Lấy danh sách ứng viên
        List<Candidate> results = query.getResultList();

        int totalPages = (int) Math.ceil((double) totalRecords / GeneralUtils.PAGE_SIZE);
        if (totalPages < page || page <= 0) {
            page = 1;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("candidates", results);
        result.put("currentPage", page);
        result.put("pageSize", GeneralUtils.PAGE_SIZE);
        result.put("totalPages", totalPages);
        result.put("totalItems", totalRecords);

        return result;
    }

    // Lấy chi tiết ứng viên theo ID
    @Override
    public Candidate getCandidateById(int candidateId) {
        Session s = this.factory.getObject().getCurrentSession();
        Candidate candidate = s.get(Candidate.class, candidateId);
        if (candidate != null) {
            System.out.println(candidate.getApplicationCollection());
        }
        return candidate;
    }

    // Tạo ứng viên và tài khoản người dùng
    @Override
    public Object createCandidate(User u, Candidate c, boolean flag) {
        Session s = this.factory.getObject().getCurrentSession();
        try {
            s.persist(u);

            s.persist(c);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi: " + e.getMessage());
        }

        return flag ? c.getUserId() : c;
    }

    // Kiểm tra ứng viên theo email 
    @Override
    public Candidate getCandidateByEmail(String email) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("Candidate.findByEmail", Candidate.class);
        q.setParameter("email", email);
        List<Candidate> rs = q.getResultList();
        return rs.isEmpty() ? null : rs.get(0);
    }

    // Kiểm tra ứng viên theo số điện thoại
    @Override
    public Candidate getCandidateByPhone(String phone) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("Candidate.findByPhone", Candidate.class);
        q.setParameter("phone", phone);
        List<Candidate> rs = q.getResultList();
        return rs.isEmpty() ? null : rs.get(0);
    }

    // Lấy tất cả ứng viên active
    @Override
    public List<Candidate> getCandidateList() {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder cb = s.getCriteriaBuilder();
        CriteriaQuery<Candidate> cq = cb.createQuery(Candidate.class);
        Root<Candidate> root = cq.from(Candidate.class);
        Predicate isActivePredicate = cb.equal(root.get("userId").get("isActive"), true);
        cq.where(isActivePredicate);

        return s.createQuery(cq).getResultList();
    }

    // Xóa ứng viên và tài khoản người dùng liên quan
    @Override
    public void deleteCandidate(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Candidate c = this.getCandidateById(id);

        s.remove(c.getUserId());
    }

    @Override
    public Candidate getCandidateByUserId(int userId) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder cb = s.getCriteriaBuilder();

        CriteriaQuery<Candidate> cq = cb.createQuery(Candidate.class);
        Root<Candidate> candidateRoot = cq.from(Candidate.class);
        Join<Candidate, User> userJoin = candidateRoot.join("userId");
        List<Predicate> predicates = new ArrayList<>();

        predicates.add(cb.equal(candidateRoot.get("userId").get("id"), userId));
        predicates.add(cb.equal(userJoin.get("isActive"), true));
        cq.where(predicates.toArray(Predicate[]::new));

        try {
            Candidate candidate = s.createQuery(cq).getSingleResult();
            return candidate;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Candidate updateCandidate(Candidate can) {
        try {
            Session session = this.factory.getObject().getCurrentSession();

            if (can.getId() != null) {
                session.merge(can);
                System.out.println("ok2");

                return can;
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
        @Override
    public User getUser(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();

        CriteriaQuery<Candidate> cq = cb.createQuery(Candidate.class);
        Root<Candidate> candidateRoot = cq.from(Candidate.class);

        Join<Candidate, User> userJoin = candidateRoot.join("userId");
        List<Predicate> predicates = new ArrayList<>();

        predicates.add(cb.equal(candidateRoot.get("id"), id));
        predicates.add(cb.equal(userJoin.get("isActive"), true));
        cq.where(predicates.toArray(Predicate[]::new));

        try {
            Candidate candidate = session.createQuery(cq).getSingleResult();
            return candidate.getUserId();
        } catch (Exception e) {
            return null;
        }
    }


}
