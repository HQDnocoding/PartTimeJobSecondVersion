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
        Join<CandidateReview, Job> jobJoin = root.join("jobId", JoinType.LEFT);
        Join<Job, Application> applicationJoin = jobJoin.join("applicationCollection", JoinType.LEFT);
        Join<Application, Candidate> candidateJoin = applicationJoin.join("candidateId", JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(builder.equal(candidateJoin.get("id"), candidateId));

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
        for (CandidateReview review : reviews) {
            if (review.getJobId() != null) {
                Hibernate.initialize(review.getJobId().getApplicationCollection());
            }
        }

        CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        Root<CandidateReview> countRoot = countQuery.from(CandidateReview.class);
        Join<CandidateReview, Job> countJobJoin = countRoot.join("jobId", JoinType.LEFT);
        Join<Job, Application> countApplicationJoin = countJobJoin.join("applicationCollection", JoinType.LEFT);
        Join<Application, Candidate> countCandidateJoin = countApplicationJoin.join("candidateId", JoinType.LEFT);

        countQuery.select(builder.count(countRoot));
        countQuery.where(builder.equal(countCandidateJoin.get("id"), candidateId));
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
}