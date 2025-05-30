/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories.impl;

import com.myweb.pojo.Major;
import com.myweb.repositories.MajorRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class MajorRepositoryImplement implements MajorRepository {

    @Autowired
    private SessionFactory sessionFactory;

    // Lấy tất cả ngành nghề
    @Override
    public List<Major> getMajors() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM Major", Major.class).getResultList();
    }

    // Triển khai phương thức getMajorById để lấy Major theo ID
    @Override
    public Major getMajorById(Integer majorId) {
        Session session = sessionFactory.getCurrentSession();
        Major major = session.get(Major.class, majorId);
        if (major == null) {
            // Log hoặc xử lý trường hợp không tìm thấy major (tùy chọn)
            // Ví dụ: logger.warning("Major not found for ID: " + majorId);
            return null;
        }
        return major;
    }
    
    @Override
    public Major getMajorById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Major.class, id);
    }
}