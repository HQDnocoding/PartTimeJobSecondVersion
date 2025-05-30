/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.formatters;

import com.myweb.pojo.Job;
import java.text.ParseException;
import java.util.Locale;
import org.springframework.format.Formatter;

/**
 *
 * @author huaquangdat
 */
public class JobFormatter implements Formatter<Job>{

    @Override
    public Job parse(String text, Locale locale) throws ParseException {
        Job j=new Job();
        j.setId(Integer.valueOf(text));
        return j;
    }

    @Override
    public String print(Job object, Locale locale) {
        return String.valueOf(object.getId());
    }
    
    
    
}
