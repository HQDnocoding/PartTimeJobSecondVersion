/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.formatters;

import com.myweb.pojo.Company;
import java.text.ParseException;
import java.util.Locale;
import org.springframework.format.Formatter;

/**
 *
 * @author huaquangdat
 */
public class CompanyFormatter implements Formatter<Company> {

    @Override
    public Company parse(String companyId, Locale locale) throws ParseException {
        Company c = new Company();
        c.setId(Integer.valueOf(companyId));
        return c;
    }

    @Override
    public String print(Company company, Locale locale) {
        return String.valueOf(company.getId());
    }

}
