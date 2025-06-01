/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories.impl;

import com.myweb.pojo.CandidateReview;
import com.myweb.pojo.Job;
import com.myweb.pojo.Application;
import com.myweb.pojo.Candidate;
import com.myweb.repositories.CandidateReviewRepository;
import com.myweb.utils.GeneralUtils;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class CandidateReviewRepositoryImplement implements CandidateReviewRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public CandidateReview addOrUpdateReview(CandidateReview review) {
        Session session = factory.getObject().getCurrentSession();
        if (review.getId() == null) {
            session.persist(review);
        } else {
            session.merge(review);
        }
        return review;
    }

    @Override
    public Map<String, Object> getListReview(Map<String, String> params, Integer candidateId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<CandidateReview> query = builder.createQuery(CandidateReview.class);
        Root<CandidateReview> root = query.from(CandidateReview.class);

        // Nạp các thực thể liên quan
        root.fetch("companyId", JoinType.LEFT);
        root.fetch("jobId", JoinType.LEFT);
        root.fetch("candidateId", JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(builder.equal(root.get("candidateId").get("id"), candidateId));

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

        Query<CandidateReview> q = session.createQuery(query);
        List<CandidateReview> reviews = q.setFirstResult(start).setMaxResults(pageSize).getResultList();

        CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        Root<CandidateReview> countRoot = countQuery.from(CandidateReview.class);
        countQuery.select(builder.count(countRoot));
        countQuery.where(builder.equal(countRoot.get("candidateId").get("id"), candidateId));
        Long total = session.createQuery(countQuery).getSingleResult();

        Map<String, Object> result = new HashMap<>();
        result.put("reviews", reviews);
        result.put("currentPage", page);
        result.put("totalPages", (int) Math.ceil(total.doubleValue() / pageSize));
        result.put("totalItems", total);

        return result;
    }

    @Override
    public CandidateReview getReviewById(Integer id) {
        Session session = factory.getObject().getCurrentSession();
        return session.get(CandidateReview.class, id);
    }

    @Override
    public void deleteReview(Integer id) {
        Session session = factory.getObject().getCurrentSession();
        CandidateReview review = getReviewById(id);
        if (review != null) {
            session.remove(review);
        }
    }

    @Override
    public Double getAverageRating(Integer candidateId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Double> query = builder.createQuery(Double.class);
        Root<CandidateReview> root = query.from(CandidateReview.class);
        Join<CandidateReview, Job> jobJoin = root.join("jobId", JoinType.LEFT);
        Join<Job, Application> applicationJoin = jobJoin.join("applicationCollection", JoinType.LEFT);
        Join<Application, Candidate> candidateJoin = applicationJoin.join("candidateId", JoinType.LEFT);

        query.select(builder.avg(root.get("rating")))
                .where(builder.equal(candidateJoin.get("id"), candidateId));

        Double result = session.createQuery(query).getSingleResult();
        return result != null ? result : 0.0;
    }

    @Override
    public CandidateReview findByCandidateIdAndJobId(Integer candidateId, Integer jobId) {
        Session session = factory.getObject().getCurrentSession();
        Query<CandidateReview> query = session.createNamedQuery("CandidateReview.findByCandidateIdAndJobId", CandidateReview.class);
        query.setParameter("candidateId", candidateId);
        query.setParameter("jobId", jobId);
        return query.getSingleResultOrNull();
    }
    
    @Override
    public Map<String, Object> getReviewsByCompany(Map<String, String> params, Integer companyId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<CandidateReview> query = builder.createQuery(CandidateReview.class);
        Root<CandidateReview> root = query.from(CandidateReview.class);
        Join<CandidateReview, Candidate> candidateJoin = root.join("candidateId");
        Join<Candidate, Application> applicationJoin = candidateJoin.join("applicationCollection", JoinType.LEFT);
        Join<Application, Job> jobJoin = applicationJoin.join("jobId", JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(builder.equal(jobJoin.get("companyId").get("id"), companyId));

        // Thêm bộ lọc
        if (params.containsKey("candidateName")) {
            predicates.add(builder.like(
                builder.lower(candidateJoin.get("fullName")),
                "%" + params.get("candidateName").toLowerCase() + "%"
            ));
        }
        if (params.containsKey("jobName")) {
            predicates.add(builder.like(
                builder.lower(jobJoin.get("jobName")),
                "%" + params.get("jobName").toLowerCase() + "%"
            ));
        }
        if (params.containsKey("companyName")) {
            predicates.add(builder.like(
                builder.lower(root.get("companyId").get("companyName")),
                "%" + params.get("companyName").toLowerCase() + "%"
            ));
        }

        query.where(predicates.toArray(new Predicate[0]));
        query.orderBy(builder.desc(root.get("reviewDate")));

        int page = params.containsKey("page") ? Integer.parseInt(params.get("page")) : 1;
        int pageSize = GeneralUtils.PAGE_SIZE;
        int start = (page - 1) * pageSize;

        Query<CandidateReview> q = session.createQuery(query);
        List<CandidateReview> reviews = q.setFirstResult(start).setMaxResults(pageSize).getResultList();
        for (CandidateReview review : reviews) {
            Hibernate.initialize(review.getCandidateId());
            Hibernate.initialize(review.getJobId());
            Hibernate.initialize(review.getCompanyId());
        }

        CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        Root<CandidateReview> countRoot = countQuery.from(CandidateReview.class);
        Join<CandidateReview, Candidate> countCandidateJoin = countRoot.join("candidateId");
        Join<Candidate, Application> countApplicationJoin = countCandidateJoin.join("applicationCollection", JoinType.LEFT);
        Join<Application, Job> countJobJoin = countApplicationJoin.join("jobId", JoinType.LEFT);

        countQuery.select(builder.count(countRoot));
        countQuery.where(builder.equal(countJobJoin.get("companyId").get("id"), companyId));
        Long total = session.createQuery(countQuery).getSingleResult();

        Map<String, Object> result = new HashMap<>();
        result.put("reviews", reviews);
        result.put("currentPage", page);
        result.put("totalPages", (int) Math.ceil(total.doubleValue() / pageSize));
        result.put("totalItems", total);

        return result;
    }
}
