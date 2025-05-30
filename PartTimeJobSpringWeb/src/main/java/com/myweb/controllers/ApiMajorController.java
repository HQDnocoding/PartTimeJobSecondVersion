/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.pojo.Major;
import com.myweb.services.MajorService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author huaquangdat
 */
@RestController
@RequestMapping("/api")
public class ApiMajorController {

    @Autowired
    private MajorService majorService;
    
    @GetMapping("/majors")
    public List<Major> listMajor(){
        return majorService.getMajors();
    }

}
