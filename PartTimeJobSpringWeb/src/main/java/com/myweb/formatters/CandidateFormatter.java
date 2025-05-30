/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.formatters;

import com.myweb.pojo.Candidate;
import java.text.ParseException;
import java.util.Locale;
import org.springframework.format.Formatter;

/**
 *
 * @author huaquangdat
 */
public class CandidateFormatter implements Formatter<Candidate> {

    @Override
    public Candidate parse(String candidateId, Locale locale) throws ParseException {
        Candidate c = new Candidate();
        c.setId(Integer.valueOf(candidateId));
        return c;
    }

    @Override
    public String print(Candidate candidate, Locale locale) {
        return String.valueOf(candidate.getId());
    }

}
