/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.dto.CreateCompanyDTO;
import com.myweb.pojo.Company;
import com.myweb.pojo.User;
import com.myweb.services.CompanyService;
import com.myweb.services.EmailService;
import com.myweb.services.UserService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 *
 * @author huaquangdat
 */
@Controller
@ControllerAdvice
public class CompanyController {

    @Autowired
    private CompanyService cpnyService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/companies")
    public String companyView(Model model, @RequestParam Map<String, String> params) {
        Collection<String> headCols = new ArrayList<>(List.of("STT", "Tên công ty","Địa chỉ", "Mã số thuế", "Ngày đăng ký", "Trạng thái"));

        Map<String, Object> result = cpnyService.getListCompany(params);

        model.addAttribute("companies", result.get("companies"));
        model.addAttribute("currentPage", result.get("currentPage"));
        model.addAttribute("pageSize", result.get("pageSize"));
        model.addAttribute("totalPages", result.get("totalPages"));
        model.addAttribute("totalItems", result.get("totalItems"));
        model.addAttribute("headCols", headCols);
        
        
        


        return "company";
    }

    @GetMapping("/companies/{companyId}")
    public String companyDetailView(Model model, @PathVariable(value = "companyId") int id) {
        model.addAttribute("company", this.cpnyService.getCompany(id));
        return "company-detail";
    }

    @PostMapping("/companies/{companyId}/update-status")
    public String updateCompanyStatus(@PathVariable("companyId") int id,
            @RequestParam("status") String status,
            RedirectAttributes redirectAttributes) {
        Company company = cpnyService.getCompany(id);
        company.setStatus(status);
        cpnyService.addOrUpdate(company);

        String email = company.getUserId().getUsername();
        String username = company.getUserId().getUsername();
        String subject = status.equalsIgnoreCase("approved")
                ? "Tài khoản công ty của bạn đã được duyệt"
                : "Tài khoản công ty của bạn đã bị từ chối";
        String body = String.format(
                "Chào %s,\n\n"
                + "Tài khoản công ty %s của bạn đã được %s vào lúc %s.\n"
                + "Trân trọng,\nHệ thống JobHome",
                username, company.getName(),
                status.equalsIgnoreCase("approved") ? "duyệt" : "từ chối",
                LocalDateTime.now()
        );
        emailService.sendEmail(email, subject, body);

        redirectAttributes.addFlashAttribute("successMessage", "Cập nhật trạng thái công ty thành công.");
        return "redirect:/companies/" + id;
    }

    @GetMapping("/companies/create-company")
    public String createCompanyView(Model model) {
        model.addAttribute("companyDTO", new CreateCompanyDTO());
        return "create-company";
    }

    @PostMapping("/companies")
    public String createCompany(Model model, @ModelAttribute(value = "companyDTO") CreateCompanyDTO companyDTO) {
        try {
            Company company = this.cpnyService.createCompanyDTO(companyDTO);
            return "redirect:/companies/" + company.getId();
        } catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "create-company";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Đã có lỗi xảy ra, vui lòng thử lại.");
            return "create-company";
        }
    }

    @PostMapping("/companies/{companyId}/update")
    public String updateCompany(Model model, @PathVariable("companyId") int id, @ModelAttribute(value = "company") Company company) {
        try {
            System.out.println(company.getDistrict());
            Company updatedCompany = this.cpnyService.addOrUpdate(company);

            // Gửi email nếu trạng thái thay đổi thành approved hoặc refused
            if ("approved".equalsIgnoreCase(company.getStatus()) || "refused".equalsIgnoreCase(company.getStatus())) {
                String username = updatedCompany.getUserId().getUsername();
                System.out.println("hehe "+username);
                String subject = "approved".equalsIgnoreCase(company.getStatus())
                        ? "Tài khoản công ty của bạn đã được duyệt"
                        : "Tài khoản công ty của bạn đã bị từ chối";
                String body = String.format(
                        "Chào bạn"
                        + "Tài khoản công ty %s của bạn đã được %s vào lúc %s.\n"
                        + "Trân trọng,\nHệ thống JobHome",
                        company.getName(),
                        "approved".equalsIgnoreCase(company.getStatus()) ? "duyệt" : "từ chối",
                        LocalDateTime.now()
                );
                this.emailService.sendEmail(username, subject, body);
            }

            System.out.println("City: " + updatedCompany.getCity() + ", District: " + updatedCompany.getDistrict());
            return "redirect:/companies/" + id;
        } catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "redirect:/companies/" + id;
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Đã có lỗi xảy ra, vui lòng thử lại.");
            return "redirect:/companies/" + id;
        }
    }
}
