/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.services.impl;

import com.cloudinary.Cloudinary;
import com.myweb.dto.CreateCompanyDTO;
import com.myweb.dto.GetJobDTO;
import com.myweb.pojo.Company;
import com.myweb.pojo.ImageWorkplace;
import com.myweb.pojo.Job;
import com.myweb.pojo.User;
import com.myweb.repositories.CompanyRepository;
import com.myweb.repositories.UserRepository;
import com.myweb.services.CompanyService;
import com.myweb.services.EmailService;
import com.myweb.utils.GeneralUtils;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import static com.myweb.utils.ValidationUtils.isValidPassword;
import java.util.HashMap;

/**
 * @author dat
 */
@Service
public class CompanyServiceImplement implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Override
    public Map<String, Object> getListCompany(Map<String, String> params) {
        return this.companyRepository.getListCompany(params);
    }

    @Override
    public Company getCompany(int companyId) {
        return this.companyRepository.getCompanyById(companyId);
    }

    @Override
    public Company getCompanyApproved(int id) {
        return this.companyRepository.getCompanyApproved(id);
    }

    @Override
    public Company addOrUpdate(Company c) {      
        System.out.println(c.getStatus());

        if (!c.getAvatarFile().isEmpty()) {
            c.setAvatar(GeneralUtils.uploadFileToCloud(cloudinary, c.getAvatarFile()));
        }
        this.companyRepository.addOrUpdateCompany(c);
        Company newCompany = this.getCompany(c.getId());
        return newCompany;
    }

    @Override
    public void deleteCompany(int id) {
        this.companyRepository.deleteCompany(id);
    }

    @Override
    public Company createCompanyDTO(CreateCompanyDTO c) {
        // Kiểm tra các trường bắt buộc
        if (c.getUsername() == null || c.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng email.");
        }
        if (userRepository.getUserByUsername(c.getUsername()) != null) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }
        if( !Pattern.matches("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", c.getUsername())){
            throw new IllegalArgumentException("Sai định dạng email");
        }
        if (!isValidPassword(c.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ thường, chữ hoa và số.");
        }
        if (c.getPassword() == null || c.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập mật khẩu.");
        }
        if (c.getName() == null || c.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập tên công ty.");
        }
        if (c.getTaxCode() == null || c.getTaxCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập mã số thuế.");
        }
        if (companyRepository.getCompanyByTaxCode(c.getTaxCode()) != null) {
            throw new IllegalArgumentException("Mã số thuế đã được sử dụng.");
        }
        if (c.getTaxCode().length() != 13 && c.getTaxCode().length() != 10) {
            throw new IllegalArgumentException("Mã số thuế không hợp lệ (phải có 10 hoặc 13 chữ số).");
        }
        if (c.getCity() == null || c.getCity().trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng chọn thành phố.");
        }
        if (c.getDistrict() == null || c.getDistrict().trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập quận/huyện.");
        }
        if (c.getFullAddress() == null || c.getFullAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập địa chỉ đầy đủ.");
        }
        if (c.getFiles().isEmpty() || c.getFiles().size() < 3) {
            System.out.println("service" + c.getFiles().isEmpty());
            System.out.println("size" + c.getFiles().size());
            throw new IllegalArgumentException("Vui lòng cung cấp tối thiểu 3 hình của nơi làm việc.");
        }

        if (c.getAvatarFile() == null || c.getAvatarFile().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng cung cấp ảnh đại diện.");
        }

        // Tạo người dùng
        User u = new User();
        u.setUsername(c.getUsername());
        u.setPassword(this.passwordEncoder.encode(c.getPassword()));
        u.setRegisterDate(new Date());
        u.setRole(GeneralUtils.Role.ROLE_COMPANY.toString());
        u.setIsActive(true);

        // Tạo công ty
        Company company = new Company();
        company.setName(c.getName());
        company.setCity(c.getCity());
        company.setDistrict(c.getDistrict());
        company.setAvatar(GeneralUtils.uploadFileToCloud(cloudinary, c.getAvatarFile()));
        company.setSelfDescription(c.getSelfDescription());
        company.setFullAddress(c.getFullAddress());
        company.setTaxCode(c.getTaxCode());
        company.setStatus(GeneralUtils.Status.pending.toString());
        company.setUserId(u);

        // Upload hình nơi làm việc
        List<ImageWorkplace> imageList = c.getFiles().stream()
                .map(file -> new ImageWorkplace(GeneralUtils.uploadFileToCloud(cloudinary, file), company))
                .collect(Collectors.toList());

        company.setImageWorkplaceCollection(imageList);

        try {
            Company createdCompany = companyRepository.createCompanyDTO(u, company);

            // Gửi email thông báo
            String subject = "Chào mừng bạn đến với hệ thống tìm kiếm việc làm bán thời gian!";
            String body = String.format(
                    "Chào bạn"
                    + "Tài khoản công ty của bạn đã được tạo thành công. Hiện tại, tài khoản đang chờ xét duyệt.\n"
                    + "Thông tin tài khoản:\n"
                    + "- Email: %s\n"
                    + "- Tên công ty: %s\n\n"
                    + "Vui lòng chờ quản trị viên phê duyệt để bắt đầu đăng tuyển dụng.\n"
                    + "Trân trọng,\nHệ thống tìm kiếm việc làm bán thời gian",
                    c.getUsername(), company.getName()
            );
            emailService.sendEmail(c.getUsername(), subject, body);

            return createdCompany;
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Dữ liệu không hợp lệ, vui lòng kiểm tra lại thông tin.");
        }
    }

    @Override
    public Object getAllCompany() {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public List<Company> getAllCompaniesForDropdown() {
        return companyRepository.getAllCompaniesForDropdown();
    }

    @Override
    public Collection<Job> getCompanyWithJobs(int companyId) {
        return this.companyRepository.getCompanyWithJobs(companyId);
    }

    @Override
    public Map<String, Object> getUserIdAndRole(int id) {
        User user = this.companyRepository.getUser(id);
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("role", user.getRole());
        return map;
    }

    @Override
    public Company getCompanyByUserId(int userId) {
        return this.companyRepository.getCompanyByUserId(userId);
    }

}
