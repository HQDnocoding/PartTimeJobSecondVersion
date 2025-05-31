/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.pojo.Company;
import com.myweb.pojo.CompanyAuthentication;
import org.springframework.stereotype.Controller;

import com.myweb.services.CompanyAuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

/**
 *
 * @author huaquangdat
 */
@Controller
public class CompanyAuthencationController {

    @Autowired
    private CompanyAuthenticationService companyAuthenticationService;

    @GetMapping("/company-authentications")
    public String companyAuthenticationView(Model model, @RequestParam Map<String, String> params) {
        Collection<String> headCols = new ArrayList<>(List.of("STT", "Tên công ty", "Địa chỉ", "Mã số thuế", "Ngày cập nhật", "Trạng thái"));

        Map<String, Object> result = companyAuthenticationService.getListCompanyAuthentication(params);

        model.addAttribute("companiesAuth", result.get("companiesAuth"));
        model.addAttribute("currentPage", result.get("currentPage"));
        model.addAttribute("pageSize", result.get("pageSize"));
        model.addAttribute("totalPages", result.get("totalPages"));
        model.addAttribute("totalItems", result.get("totalItems"));
        model.addAttribute("headCols", headCols);

        return "company-authentication";
    }

    @GetMapping("/company-authentications/{companyAuthenticationId}")
    public String companyAuthenticationDetailView(Model model, @PathVariable(value = "companyAuthenticationId") int id) {
        model.addAttribute("companyAuth", this.companyAuthenticationService.getCompanyAuthentication(id));
        return "company-authentication-detail";
    }

    @PostMapping("/company-authentications/{id}/update-status")
    public String updateStatus(@ModelAttribute(value = "companyAuth") CompanyAuthentication ca, @PathVariable(value = "id") int id) {
        try {
            CompanyAuthentication upCa = this.companyAuthenticationService.update(ca);
            if (upCa == null) {
                return "redirect:/company-authentications";
            }
            return "redirect:/company-authentications/" + ca.getId();
        } catch (Exception e) {
            e.printStackTrace();
            return "/";
        }
    }
}
