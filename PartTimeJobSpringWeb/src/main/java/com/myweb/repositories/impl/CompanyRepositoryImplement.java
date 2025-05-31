/*
 * Click nbfs://SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories.impl;

import com.myweb.pojo.Company;
import com.myweb.pojo.Job;
import com.myweb.pojo.User;
import com.myweb.repositories.CompanyRepository;
import com.myweb.utils.GeneralUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.*;
import java.util.*;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author dat
 */
@Repository
@Transactional
public class CompanyRepositoryImplement implements CompanyRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Object[]> countCompaniesByMonth(Date startDate) {
        String query = "SELECT DATE_FORMAT(c.createdDate, '%Y-%m') as time, COUNT(c) as count "
                + "FROM Company c WHERE c.createdDate >= :startDate "
                + "GROUP BY DATE_FORMAT(c.createdDate, '%Y-%m')";
        return em.createQuery(query, Object[].class)
                .setParameter("startDate", startDate)
                .getResultList();
    }

    // Thêm hoặc cập nhật công ty
    @Override
    public Company addOrUpdateCompany(Company c) {
        Session session = this.factory.getObject().getCurrentSession();
        try {
            if (c.getId() == null) {
                session.persist(c);
            } else {
                session.merge(c);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return c;
    }

    private String normalizeLocation(String location) {
        if (location == null || location.trim().isEmpty()) {
            return null;
        }
        // Loại bỏ tiền tố "Thành phố", "Tỉnh" và chuẩn hóa
        String normalized = location.trim()
                .replaceAll("^(Thành phố|Tỉnh)\\s*", "")
                .replaceAll("\\s+", " ");
        // Viết hoa chữ cái đầu, còn lại viết thường
        return normalized.substring(0, 1).toUpperCase() + normalized.substring(1).toLowerCase();
    }

    // Lấy danh sách công ty với lọc/phân trang
    @Override
    public Map<String, Object> getListCompany(Map<String, String> params) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();

        // Đếm tổng số bản ghi
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Company> countRoot = countQuery.from(Company.class);
        countQuery.select(cb.count(countRoot));
        countQuery.where(buildPredicates(params, cb, countRoot).toArray(new Predicate[0]));
        Long totalRecords = session.createQuery(countQuery).getSingleResult();

        // Tạo CriteriaQuery cho Company
        CriteriaQuery<Company> cq = cb.createQuery(Company.class);
        Root<Company> companyRoot = cq.from(Company.class);
        cq.where(buildPredicates(params, cb, companyRoot).toArray(new Predicate[0]));

        cq.orderBy(cb.desc(companyRoot.get("userId").get("registerDate")));

        Query query = session.createQuery(cq);

        // Phân trang
        int page = 1;
        try {
            page = Integer.parseInt(params.getOrDefault("page", "1"));

        } catch (NumberFormatException e) {
        }
        int pageSize = GeneralUtils.PAGE_SIZE;
        int start = (page - 1) * pageSize;
        query.setFirstResult(start);
        query.setMaxResults(pageSize);

        // Lấy danh sách kết quả
        List<Company> results = query.getResultList();

        // Tính tổng số trang
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);
       
        if (totalPages < page || page <= 0) {
            page = 1;
        }

        // Tạo kết quả trả về
        Map<String, Object> result = new HashMap<>();
        result.put("companies", results);
        result.put("currentPage", page);
        result.put("pageSize", pageSize);
        result.put("totalPages", totalPages);
        result.put("totalItems", totalRecords);

        return result;
    }

    // Xây dựng các điều kiện lọc
    private List<Predicate> buildPredicates(Map<String, String> params, CriteriaBuilder cb, Root<Company> companyRoot) {
        List<Predicate> predicates = new ArrayList<>();

        if (params != null) {
            // Từ khóa (tìm trong name)
            String keyword = params.get("name");
            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(cb.or(
                        cb.like(cb.lower(companyRoot.get("name")), "%" + keyword.toLowerCase() + "%")
                ));
            }

            // Mã số thuế
            String taxCode = params.get("taxCode");
            if (taxCode != null && !taxCode.isEmpty()) {
                predicates.add(cb.equal(companyRoot.get("taxCode"), taxCode));
            }

            // Trạng thái
            String status = params.get("status");
            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(companyRoot.get("status"), status));
            }

            // Thành phố
            String city = params.get("city");
            if (city != null && !city.isEmpty()) {
                String normalizedCity = normalizeLocation(city);
                if (normalizedCity != null) {
                    predicates.add(cb.equal(cb.lower(companyRoot.get("city")), normalizedCity.toLowerCase()));
                }
            }

            // Quận/Huyện
            String district = params.get("district");
            if (district != null && !district.isEmpty()) {
                String normalizedDistrict = normalizeLocation(district);
                if (normalizedDistrict != null) {
                    predicates.add(cb.equal(cb.lower(companyRoot.get("district")), normalizedDistrict.toLowerCase()));
                }
            }
        }

        return predicates;
    }

    // Lấy chi tiết công ty
    @Override
    public Company getCompanyById(int companyId) {
        Session session = this.factory.getObject().getCurrentSession();
        return session.get(Company.class, companyId);
    }

    @Override
    public Company getCompanyApproved(int companyId) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();

        CriteriaQuery<Company> cq = cb.createQuery(Company.class);
        Root<Company> companyRoot = cq.from(Company.class);

        Join<Company, User> userJoin = companyRoot.join("userId");
        List<Predicate> predicates = new ArrayList<>();

        predicates.add(cb.equal(companyRoot.get("id"), companyId));
        predicates.add(cb.equal(companyRoot.get("status"), "approved"));
        predicates.add(cb.equal(userJoin.get("isActive"), true));
        cq.where(predicates.toArray(Predicate[]::new));

        try {
            Company company = session.createQuery(cq).getSingleResult();
            return company;
        } catch (Exception e) {
            return null;
        }
    }

    // Xóa công ty và tài khoản người dùng
    @Override
    public void deleteCompany(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        Company c = this.getCompanyById(id);
        session.remove(c.getUserId());
    }

    // Tạo công ty và tài khoản người dùng
    @Override
    public Company createCompanyDTO(User u, Company c) {
        Session session = this.factory.getObject().getCurrentSession();
        try {
            session.persist(u);
            session.persist(c);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi: " + e.getMessage());
        }
        return c;
    }

    // Kiểm tra công ty theo email
    @Override
    public Company getCompanyByEmail(String email) {
        Session session = this.factory.getObject().getCurrentSession();
        Query q = session.createNamedQuery("Company.findByEmail", Company.class);
        q.setParameter("email", email);
        List<Company> rs = q.getResultList();
        return rs.isEmpty() ? null : rs.get(0);
    }

    // Kiểm tra công ty theo mã số thuế
    @Override
    public Company getCompanyByTaxCode(String taxCode) {
        Session session = this.factory.getObject().getCurrentSession();
        Query q = session.createNamedQuery("Company.findByTaxCode", Company.class);
        q.setParameter("taxCode", taxCode);
        List<Company> rs = q.getResultList();
        return rs.isEmpty() ? null : rs.get(0);
    }

    @Override
    public List<Company> getAllCompaniesForDropdown() {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Company> cq = cb.createQuery(Company.class);
        Root<Company> companyRoot = cq.from(Company.class);

        cq.orderBy(cb.asc(companyRoot.get("id")));

        List<Company> companies = session.createQuery(cq).getResultList();
        System.out.println("Total companies retrieved for dropdown: " + companies.size());
        return companies;
    }

    @Override
    public Collection<Job> getCompanyWithJobs(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Company> cq = cb.createQuery(Company.class);
        Root<Company> companyRoot = cq.from(Company.class);
        companyRoot.fetch("jobCollection", JoinType.LEFT);
        Join<Company, User> userJoin = companyRoot.join("userId");
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(companyRoot.get("id"), id));
        predicates.add(cb.equal(companyRoot.get("status"), "approved"));
        predicates.add(cb.equal(userJoin.get("isActive"), true));
        cq.where(predicates.toArray(Predicate[]::new));
        try {
            Company company = session.createQuery(cq).getSingleResult();
            return company.getJobCollection();
        } catch (Exception e) {
            System.out.println("Error in getCompanyWithJobs: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    public User getUser(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();

        CriteriaQuery<Company> cq = cb.createQuery(Company.class);
        Root<Company> companyRoot = cq.from(Company.class);

        Join<Company, User> userJoin = companyRoot.join("userId");
        List<Predicate> predicates = new ArrayList<>();

        predicates.add(cb.equal(companyRoot.get("id"), id));
        predicates.add(cb.equal(companyRoot.get("status"), "approved"));
        predicates.add(cb.equal(userJoin.get("isActive"), true));
        cq.where(predicates.toArray(Predicate[]::new));

        try {
            Company company = session.createQuery(cq).getSingleResult();
            return company.getUserId();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Company getCompanyByUserId(int userId) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();

        CriteriaQuery<Company> cq = cb.createQuery(Company.class);
        Root<Company> companyRoot = cq.from(Company.class);
        Join<Company, User> userJoin = companyRoot.join("userId");
        List<Predicate> predicates = new ArrayList<>();

        predicates.add(cb.equal(companyRoot.get("userId").get("id"), userId));
        predicates.add(cb.equal(companyRoot.get("status"), "approved"));
        predicates.add(cb.equal(userJoin.get("isActive"), true));
        cq.where(predicates.toArray(Predicate[]::new));

        try {
            Company company = session.createQuery(cq).getSingleResult();
            return company;
        } catch (Exception e) {
            return null;
        }
    }
}
