/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services.impl;

import com.myweb.pojo.Major;
import com.myweb.repositories.MajorRepository;
import com.myweb.services.MajorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MajorServiceImplement implements MajorService {

    @Autowired
    private MajorRepository majorRepository;

    @Override
    public List<Major> getMajors() {
        return majorRepository.getMajors();
    }
    
    @Override
    public Major getMajorById(int id) {
        return majorRepository.getMajorById(id);
    }
}