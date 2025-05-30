/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.controllers;

import com.myweb.dto.CreateCandidateDTO;
import com.myweb.pojo.Candidate;
import com.myweb.services.CandidateService;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author huaquangdat
 */
@Controller
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping("/candidates")
    public String candidateView(Model model, @RequestParam Map<String, String> params) {
        Collection<String> headCols = new ArrayList<>(List.of(
                "STT", "Họ tên", "Email", "Ngày sinh", "Thành phố", "Số điện thoại"
        ));

        Map<String, Object> result = candidateService.getListCandidate(params);

        // Thêm dữ liệu vào model
        model.addAttribute("candidates", result.get("candidates"));
        model.addAttribute("currentPage", result.get("currentPage"));
        model.addAttribute("pageSize", result.get("pageSize"));
        model.addAttribute("totalPages", result.get("totalPages"));
        model.addAttribute("totalItems", result.get("totalItems"));
        model.addAttribute("headCols", headCols);

        return "candidate";
    }

    @GetMapping("/candidates/{id}")
    public String candidateDetailView(Model model, @PathVariable("id") int id) {
        Candidate candidate = candidateService.getCandidateById(id);

        // Kiểm tra null
        if (candidate == null) {
            model.addAttribute("error", "Không tìm thấy ứng viên với ID: " + id);
            return "candidate-detail";
        }

        model.addAttribute("candidate", candidate);

        return "candidate-detail";
    }

    @GetMapping("/candidates/create-candidate")
    public String createCandidateView(Model model) {
        model.addAttribute("candidateDTO", new CreateCandidateDTO());
        return "create-candidate";
    }

    @PostMapping("/candidates")
    public String createCandidate(Model model, @ModelAttribute(value = "candidateDTO") CreateCandidateDTO c) {
        try {
            Candidate can = this.candidateService.createCandidateDTO(c);
            return "redirect:/candidates/" + can.getId();
        } catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "create-candidate";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Đã có lỗi xảy ra, vui lòng thử lại.");
            System.out.println();
            return "create-candidate";
        }
    }

    @PostMapping("/candidates/{candidateId}/update")
    public String updateCandidate(Model model, @PathVariable("candidateId") int id, @ModelAttribute("candidate") Candidate candidate) {
        try {
            System.out.println("City: " + candidate.getCity() + ", FullName: " + candidate.getFullName() + ", tinh: " + candidate.getCity());
            Candidate updatedCandidate = candidateService.addOrUpdateCandidate(candidate);
            System.out.println("City: " + candidate.getCity() + ", FullName: " + candidate.getFullName() + ", tinh: " + updatedCandidate.getCity());

            return "redirect:/candidates/" + id;
        } catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", e.getMessage());
            e.printStackTrace();
            return "redirect:/candidates/" + id;
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("errorMessage", e.getMessage());
            return "redirect:/candidates/" + id;
        }
    }
}
