/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories.impl;

import com.myweb.pojo.User;
import com.myweb.repositories.UserRepository;
import jakarta.persistence.Query;
import java.util.List;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author huaquangdat
 */
@Repository
@Transactional
public class UserRepositoryImplement implements UserRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Thêm tài khoản người dùng
    @Override
    public User addUser(User user) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(user);
        s.refresh(user);
        return user;
    }

    // Lấy thông tin người dùng theo username 
    @Override
    public User getUserByUsername(String username) {
        Session s = this.factory.getObject().getCurrentSession();
        Query query = s.createNamedQuery("User.findByUsername", User.class);
        query.setParameter("username", username);

        List<User> rs = query.getResultList();

        return rs.isEmpty() ? null : rs.get(0);
    }

    // Xóa tài khoản người dùng
    @Override
    public void deleteUser(int id) {
        Session s = this.factory.getObject().getCurrentSession();

        User u = this.getUserById(id);
        s.remove(u);
    }

    // Lấy thông tin người dùng theo ID
    @Override
    public User getUserById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.get(User.class, id);
    }

    @Override
    public User authenticate(String username, String password) {
        User u = this.getUserByUsername(username);
        if (u == null) {
            return null;
        }
        System.out.println("client" + password);
        System.out.println("pw" + u.getPassword());

        if (this.passwordEncoder.matches(password, u.getPassword())) {
            return u;
        } else {
            throw new IllegalArgumentException("Sai mật khẩu");
        }
    }

}
