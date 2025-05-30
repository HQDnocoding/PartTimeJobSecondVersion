/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories;

import com.myweb.pojo.Major;
import java.util.List;

/**
 *
 * @author Admin
 */
public interface MajorRepository {

    List<Major> getMajors();
    // Thêm các phương thức khác nếu cần

    public Major getMajorById(Integer majorId);

    Major getMajorById(int id);
}
