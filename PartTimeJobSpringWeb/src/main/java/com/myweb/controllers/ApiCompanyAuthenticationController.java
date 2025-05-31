package com.myweb.controllers;

import com.myweb.pojo.Company;
import com.myweb.pojo.CompanyAuthentication;
import com.myweb.services.CompanyAuthenticationService;
import com.myweb.services.CompanyService;
import com.myweb.utils.GeneralUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.Date;
import java.util.Map;
import org.springframework.http.MediaType;

@Controller
@RestController
@RequestMapping("/api")
public class ApiCompanyAuthenticationController {

    @Autowired
    private CompanyAuthenticationService companyAuthenticationService;

    @Autowired
    private CompanyService compService;

    @PostMapping(path = "/secure/company-authentication")
    public ResponseEntity<?> addCompanyAuthentication(
            @RequestParam("paperFile") MultipartFile paperFile,
            @RequestParam("idCardFrontFile") MultipartFile idCardFrontFile,
            @RequestParam("idCardBackFile") MultipartFile idCardBackFile,
            @RequestParam("companyId") Integer companyId, Principal principal) {
        try {
            Company company = this.compService.getCompanyApproved(companyId);
            if (!company.getUserId().getUsername().equals(principal.getName())) {
                return new ResponseEntity<>(Map.of("error", "Không có quyền truy cập"), HttpStatus.FORBIDDEN);
            }
            CompanyAuthentication ca = new CompanyAuthentication();
            ca.setPaperFile(paperFile);
            ca.setIdCardFrontFile(idCardFrontFile);
            ca.setIdCardBackFile(idCardBackFile);
            ca.setCompanyId(company);
            ca.setLastUpdated(new Date());

            CompanyAuthentication created = companyAuthenticationService.addCompanyAuthentication(ca);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(Map.of("error", "Lỗi server: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/secure/company-authentication/{id}")
    public ResponseEntity<?> updateCompanyAuthentication(
            @PathVariable("id") Integer id,
            @RequestParam(value = "paperFile", required = false) MultipartFile paperFile,
            @RequestParam(value = "idCardFrontFile", required = false) MultipartFile idCardFrontFile,
            @RequestParam(value = "idCardBackFile", required = false) MultipartFile idCardBackFile,
            Principal principal) {
        try {
            CompanyAuthentication ca = new CompanyAuthentication(id);
            ca.setPaperFile(paperFile);
            ca.setIdCardFrontFile(idCardFrontFile);
            ca.setIdCardBackFile(idCardBackFile);
            ca.setLastUpdated(new Date());

            CompanyAuthentication updated = companyAuthenticationService.updateCompanyAuthentication(ca, principal);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (SecurityException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/secure/company-authentication/{id}")
    public ResponseEntity<?> deleteCompanyAuthentication(
            @PathVariable("id") Integer id,
            Principal principal) {
        try {
            companyAuthenticationService.deleteCompanyAuthentication(id, principal);
            return new ResponseEntity<>(Map.of("message", "Xóa thông tin xác thực công ty thành công"), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (SecurityException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Lỗi server: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/admin/company-authentications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCompany(@PathVariable(value = "id") int id) {
        this.companyAuthenticationService.remove(id);
    }

}
