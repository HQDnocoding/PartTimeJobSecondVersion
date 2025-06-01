/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories.impl;

import com.myweb.pojo.Company;
import com.myweb.pojo.CompanyReview;
import com.myweb.pojo.Job;
import com.myweb.repositories.CompanyReviewRepository;
import com.myweb.utils.GeneralUtils;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class CompanyReviewRepositoryImplement implements CompanyReviewRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public CompanyReview addOrUpdateReview(CompanyReview review) {
        Session session = factory.getObject().getCurrentSession();
        if (review.getId() == null) {
            session.persist(review);
        } else {
            session.merge(review);
        }
        return review;
    }

    @Override
    public Map<String, Object> getListReview(Map<String, String> params, Integer companyId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<CompanyReview> query = builder.createQuery(CompanyReview.class);
        Root<CompanyReview> root = query.from(CompanyReview.class);
        Join<CompanyReview, Job> jobJoin = root.join("jobId");
        Join<Job, Company> companyJoin = jobJoin.join("companyId");

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(builder.equal(companyJoin.get("id"), companyId));

        if (params != null && params.containsKey("rating")) {
            try {
                Integer rating = Integer.parseInt(params.get("rating"));
                predicates.add(builder.equal(root.get("rating"), rating));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid rating format", e);
            }
        }

        query.where(predicates.toArray(new Predicate[0]));
        query.orderBy(builder.desc(root.get("reviewDate")));

        int page = params != null && params.containsKey("page") ? Integer.parseInt(params.get("page")) : 1;
        int pageSize = GeneralUtils.PAGE_SIZE;
        int start = (page - 1) * pageSize;

        Query<CompanyReview> q = session.createQuery(query);
        List<CompanyReview> reviews = q.setFirstResult(start).setMaxResults(pageSize).getResultList();

        CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        Root<CompanyReview> countRoot = countQuery.from(CompanyReview.class);
        Join<CompanyReview, Job> countJobJoin = countRoot.join("jobId");
        Join<Job, Company> countCompanyJoin = countJobJoin.join("companyId");

        countQuery.select(builder.count(countRoot));
        countQuery.where(builder.equal(countCompanyJoin.get("id"), companyId));
        Long total = session.createQuery(countQuery).getSingleResult();

        Map<String, Object> result = new HashMap<>();
        result.put("reviews", reviews);
        result.put("currentPage", page);
        result.put("totalPages", (int) Math.ceil(total.doubleValue() / pageSize));
        result.put("totalItems", total);

        return result;
    }

    @Override
    public CompanyReview getReviewById(Integer id) {
        Session session = factory.getObject().getCurrentSession();
        return session.get(CompanyReview.class, id);
    }

    @Override
    public void deleteReview(Integer id) {
        Session session = factory.getObject().getCurrentSession();
        CompanyReview review = getReviewById(id);
        if (review != null) {
            session.remove(review);
        }
    }

    @Override
    public Double getAverageRating(Integer companyId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Double> query = builder.createQuery(Double.class);
        Root<CompanyReview> root = query.from(CompanyReview.class);
        Join<CompanyReview, Job> jobJoin = root.join("jobId");
        Join<Job, Company> companyJoin = jobJoin.join("companyId");

        query.select(builder.avg(root.get("rating")))
             .where(builder.equal(companyJoin.get("id"), companyId));

        Double result = session.createQuery(query).getSingleResult();
        return result != null ? result : 0.0;
    }
    
    @Override
    public CompanyReview findByApplicationId(Integer applicationId) {
        Session session = factory.getObject().getCurrentSession();
        Query<CompanyReview> query = session.createNamedQuery("CompanyReview.findByApplicationId", CompanyReview.class);
        query.setParameter("applicationId", applicationId);
        try {
            return query.getSingleResult();
        } catch (jakarta.persistence.NoResultException e) {
            return null;
        }
    }
}