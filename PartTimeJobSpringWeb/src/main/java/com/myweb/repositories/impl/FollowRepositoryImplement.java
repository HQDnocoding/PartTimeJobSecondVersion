/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories.impl;

import com.myweb.pojo.Follow;
import com.myweb.repositories.FollowRepository;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import java.util.Date;
import java.util.List;

@Repository
@Transactional
public class FollowRepositoryImplement implements FollowRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Follow addFollow(Follow follow) {
        Session session = factory.getObject().getCurrentSession();
        follow.setFollowDate(new Date());
        follow.setIsActive(true);
        follow.setIsCandidateFollowed(true);
        session.save(follow);
        return follow;
    }

    @Override
    public void deleteFollow(int candidateId, int companyId) {
        Session session = factory.getObject().getCurrentSession();
        session.createQuery("UPDATE Follow f SET f.isActive = false WHERE f.candidateId.id = :candidateId AND f.companyId.id = :companyId")
                .setParameter("candidateId", candidateId)
                .setParameter("companyId", companyId)
                .executeUpdate();
    }

    @Override
    public boolean isFollowing(int candidateId, int companyId) {
        Session session = factory.getObject().getCurrentSession();
        Long count = session.createQuery(
                "SELECT COUNT(f) FROM Follow f WHERE f.candidateId.id = :candidateId AND f.companyId.id = :companyId AND f.isActive = true AND f.isCandidateFollowed = true",
                Long.class
        )
                .setParameter("candidateId", candidateId)
                .setParameter("companyId", companyId)
                .getSingleResult();
        return count > 0;
    }

    @Override
    public List<Follow> getFollowedCompanies(int candidateId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Follow> query = builder.createQuery(Follow.class);
        Root<Follow> root = query.from(Follow.class);
        query.select(root)
                .where(
                        builder.and(
                                builder.equal(root.get("candidateId").get("id"), candidateId),
                                builder.equal(root.get("isActive"), true),
                                builder.equal(root.get("isCandidateFollowed"), true)
                        )
                );
        return session.createQuery(query).getResultList();
    }

    @Override
    public List<Follow> getFollowers(int companyId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Follow> query = builder.createQuery(Follow.class);
        Root<Follow> root = query.from(Follow.class);
        query.select(root)
                .where(
                        builder.and(
                                builder.equal(root.get("companyId").get("id"), companyId),
                                builder.equal(root.get("isActive"), true),
                                builder.equal(root.get("isCandidateFollowed"), true)
                        )
                );
        return session.createQuery(query).getResultList();
    }
}