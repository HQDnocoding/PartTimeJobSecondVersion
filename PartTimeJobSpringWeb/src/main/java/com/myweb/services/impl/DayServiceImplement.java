/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services.impl;

import com.myweb.pojo.Day;
import com.myweb.repositories.DayRepository;
import com.myweb.services.DayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DayServiceImplement implements DayService {

    @Autowired
    private DayRepository dayRepository;

    // Lấy danh sách tất cả các ngày
    @Override
    public List<Day> getDays() {
        return dayRepository.getDays();
    }

    @Override
    public Day getDayById(int id) {
        return dayRepository.getDayById(id);
    }
}
