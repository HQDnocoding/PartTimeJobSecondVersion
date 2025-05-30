package com.myweb.repositories.impl;

import com.myweb.pojo.Job;
import com.myweb.pojo.Candidate;
import com.myweb.pojo.Company;
import com.myweb.repositories.ReportRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class ReportRepositoryImplement implements ReportRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    @Transactional
    public List<Object[]> generateJobReport(Date fromDate, Date toDate) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = builder.createQuery(Object[].class);
        Root<Job> jobRoot = query.from(Job.class);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(builder.equal(jobRoot.get("isActive"), true));

        if (fromDate != null) {
            predicates.add(builder.greaterThanOrEqualTo(jobRoot.get("postedDate"), fromDate));
        }
        if (toDate != null) {
            predicates.add(builder.lessThanOrEqualTo(jobRoot.get("postedDate"), toDate));
        }

        Expression<Date> dateExpression = builder.function("DATE", Date.class, jobRoot.get("postedDate"));

        query.multiselect(
            dateExpression,
            builder.countDistinct(jobRoot.get("id")).alias("jobCount")
        );

        query.where(predicates.toArray(Predicate[]::new));
        query.groupBy(dateExpression);

        Query<Object[]> q = session.createQuery(query);
        return q.getResultList();
    }

    @Override
    @Transactional
    public List<Object[]> generateCandidateReport(Date fromDate, Date toDate) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = builder.createQuery(Object[].class);
        Root<Candidate> candidateRoot = query.from(Candidate.class);
        jakarta.persistence.criteria.Join userJoin = candidateRoot.join("userId");

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(builder.equal(userJoin.get("isActive"), true));

        if (fromDate != null) {
            predicates.add(builder.greaterThanOrEqualTo(userJoin.get("registerDate"), fromDate));
        }
        if (toDate != null) {
            predicates.add(builder.lessThanOrEqualTo(userJoin.get("registerDate"), toDate));
        }

        Expression<Date> dateExpression = builder.function("DATE", Date.class, userJoin.get("registerDate"));

        query.multiselect(
            dateExpression,
            builder.countDistinct(candidateRoot.get("id")).alias("candidateCount")
        );

        query.where(predicates.toArray(Predicate[]::new));
        query.groupBy(dateExpression);

        Query<Object[]> q = session.createQuery(query);
        return q.getResultList();
    }

    @Override
    @Transactional
    public List<Object[]> generateCompanyReport(Date fromDate, Date toDate) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = builder.createQuery(Object[].class);
        Root<Company> companyRoot = query.from(Company.class);
        jakarta.persistence.criteria.Join userJoin = companyRoot.join("userId");

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(builder.equal(userJoin.get("isActive"), true));

        if (fromDate != null) {
            predicates.add(builder.greaterThanOrEqualTo(userJoin.get("registerDate"), fromDate));
        }
        if (toDate != null) {
            predicates.add(builder.lessThanOrEqualTo(userJoin.get("registerDate"), toDate));
        }

        Expression<Date> dateExpression = builder.function("DATE", Date.class, userJoin.get("registerDate"));

        query.multiselect(
            dateExpression,
            builder.countDistinct(companyRoot.get("id")).alias("companyCount")
        );

        query.where(predicates.toArray(Predicate[]::new));
        query.groupBy(dateExpression);

        Query<Object[]> q = session.createQuery(query);
        return q.getResultList();
    }
}