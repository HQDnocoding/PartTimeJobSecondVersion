/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories.impl;

import com.myweb.pojo.Day;
import com.myweb.repositories.DayRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class DayRepositoryImplement implements DayRepository {

    @Autowired
    private SessionFactory sessionFactory;

    // Lấy tất cả các ngày
    @Override
    public List<Day> getDays() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM Day", Day.class).getResultList();
    }

    @Override
    public Day getDayById(Integer dayId) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public Day getDayById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Day.class, id);
    }
}
