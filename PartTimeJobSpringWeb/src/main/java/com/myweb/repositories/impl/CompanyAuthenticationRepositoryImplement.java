package com.myweb.repositories.impl;

import com.myweb.pojo.Company;
import com.myweb.pojo.CompanyAuthentication;
import com.myweb.repositories.CompanyAuthenticationRepository;
import com.myweb.utils.GeneralUtils;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@Transactional
public class CompanyAuthenticationRepositoryImplement implements CompanyAuthenticationRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    private Session getSession() {
        SessionFactory sessionFactory = factory.getObject();
        return sessionFactory.getCurrentSession();
    }

    @Override
    public CompanyAuthentication addCompanyAuthentication(CompanyAuthentication ca) {
        try {
            getSession().persist(ca);
            return ca;
        } catch (Exception e) {
            throw new IllegalArgumentException("Lỗi khi thêm thông tin xác thực công ty: " + e.getMessage());
        }
    }

    @Override
    public CompanyAuthentication updateCompanyAuthentication(CompanyAuthentication ca) {
        try {
            getSession().merge(ca);
            return ca;
        } catch (Exception e) {
            throw new IllegalArgumentException("Lỗi khi cập nhật thông tin xác thực công ty: " + e.getMessage());
        }
    }

    @Override
    public void deleteCompanyAuthentication(int id) {
        try {
            Session session = getSession();
            CompanyAuthentication ca = session.get(CompanyAuthentication.class, id);
            if (ca == null) {
                throw new IllegalArgumentException("Không tìm thấy thông tin xác thực công ty.");
            }

            Company company = ca.getCompanyId();
            if (company != null) {
                company.setCompanyAuthentication(null);
                session.merge(company);
            }

            session.remove(ca);
        } catch (Exception e) {
            throw new IllegalArgumentException("Lỗi khi xóa thông tin xác thực công ty: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> findAllWithFilters(Map<String, String> params) {
        Session session = getSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();

        // Đếm tổng số bản ghi
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<CompanyAuthentication> countRoot = countQuery.from(CompanyAuthentication.class);
        countQuery.select(cb.count(countRoot));
        countQuery.where(buildFilterConditions(params, cb, countRoot).toArray(new Predicate[0]));
        Long totalRecords = session.createQuery(countQuery).getSingleResult();

        // Tạo query cho danh sách CompanyAuthentication
        CriteriaQuery<CompanyAuthentication> dataQuery = cb.createQuery(CompanyAuthentication.class);
        Root<CompanyAuthentication> dataRoot = dataQuery.from(CompanyAuthentication.class);
        dataQuery.select(dataRoot);
        dataQuery.where(buildFilterConditions(params, cb, dataRoot).toArray(new Predicate[0]));
        dataQuery.orderBy(cb.desc(dataRoot.get("lastUpdated")));

        Query<CompanyAuthentication> query = session.createQuery(dataQuery);

        // Phân trang
        int page = 1;
        if (params.containsKey("page")) {
            try {
                page = Integer.parseInt(params.get("page"));
                if (page < 1) {
                    page = 1;
                }
            } catch (NumberFormatException e) {
                // Giữ page = 1 nếu parse lỗi
            }
        }
        int pageSize = params.containsKey("pageSize") ? Integer.parseInt(params.get("pageSize")) : GeneralUtils.PAGE_SIZE;
        int startPosition = (page - 1) * pageSize;

        query.setFirstResult(startPosition);
        query.setMaxResults(pageSize);

        List<CompanyAuthentication> results = query.getResultList();

        // Tính tổng số trang
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);

        // Chuẩn hóa page nếu vượt giới hạn
        if (totalPages > 0 && page > totalPages) {
            page = totalPages;
        }

        // Kết quả trả về
        Map<String, Object> result = new HashMap<>();
        result.put("companiesAuth", results);
        result.put("currentPage", page);
        result.put("pageSize", pageSize);
        result.put("totalPages", totalPages);
        result.put("totalItems", totalRecords);

        return result;
    }

    @Override
    public CompanyAuthentication findById(int id) {
        Session session = getSession();
        return session.get(CompanyAuthentication.class, id);
    }

    private List<Predicate> buildFilterConditions(Map<String, String> params, CriteriaBuilder cb, Root<CompanyAuthentication> root) {
        List<Predicate> predicates = new ArrayList<>();

        // Tìm kiếm theo tên công ty
        String companyName = params.getOrDefault("name", "").trim();
        if (!companyName.isEmpty()) {
            predicates.add(cb.like(
                    cb.lower(root.get("companyId").get("name")),
                    "%" + companyName.toLowerCase() + "%"
            ));
        }

        // Lọc theo trạng thái
        String status = params.getOrDefault("status", "").trim();
        if (!status.isEmpty()) {
            predicates.add(cb.equal(root.get("status"), status));
        }

        return predicates;
    }

    @Override
    public CompanyAuthentication update(CompanyAuthentication ca) {
        Session session = getSession();
        if (ca.getId() != null) {
            session.merge(ca);
            return ca;
        } else {
            return null;
        }
    }

    @Override
    public void remove(int id) {
        Session session = getSession();
        CompanyAuthentication ca = session.get(CompanyAuthentication.class, id);
        Company company = ca.getCompanyId();
        if (company != null) {
            company.setCompanyAuthentication(null);
            session.merge(company);
        }
        session.remove(ca);

    }

}
