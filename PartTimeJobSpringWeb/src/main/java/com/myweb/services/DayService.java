/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services;

import com.myweb.pojo.Day;

import java.util.List;

public interface DayService {

    // Lấy danh sách tất cả các ngày trong tuần
    List<Day> getDays();

    Day getDayById(int id);
}
