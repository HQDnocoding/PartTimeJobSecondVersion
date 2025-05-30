/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services;

import com.myweb.exeption.AuthenticationException;
import com.myweb.pojo.User;
import java.util.Map;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author huaquangdat
 */
public interface UserService extends UserDetailsService {

    // Lấy thông tin người dùng theo tên đăng nhập
    User getUserByUsername(String username);

    // Thêm mới người dùng với thông tin và ảnh đại diện
    User addUser(Map<String, String> params, MultipartFile avatar);

    // Xóa người dùng theo ID
    void deleteUser(int id);

    User authenticate(String username, String password) throws AuthenticationException;

    // lấy thông tin người dùng theo id
    User getUserById(int id);

}
