/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories;

import com.myweb.pojo.Day;

import java.util.List;

public interface DayRepository {

    List<Day> getDays();

    public Day getDayById(Integer dayId);

    Day getDayById(int id);
}
