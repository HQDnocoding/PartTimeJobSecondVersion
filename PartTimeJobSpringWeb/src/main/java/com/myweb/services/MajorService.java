/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services;

import com.myweb.pojo.Major;

import java.util.List;

public interface MajorService {

    // Lấy danh sách tất cả các ngành nghề
    List<Major> getMajors();

    Major getMajorById(int id);
}
