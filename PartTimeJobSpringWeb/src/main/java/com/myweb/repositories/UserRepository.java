/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories;

import com.myweb.pojo.User;

/**
 *
 * @author huaquangdat
 */
public interface UserRepository {
    User getUserByUsername(String username);
    User addUser(User user);
    
    void deleteUser(int id);
    
    User getUserById(int id);

    User authenticate(String username, String password);

}
