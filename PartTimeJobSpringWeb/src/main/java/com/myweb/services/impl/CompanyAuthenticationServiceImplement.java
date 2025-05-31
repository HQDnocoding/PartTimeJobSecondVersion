package com.myweb.services.impl;

import com.cloudinary.Cloudinary;
import com.myweb.pojo.Company;
import com.myweb.pojo.CompanyAuthentication;
import com.myweb.pojo.User;
import com.myweb.repositories.CompanyAuthenticationRepository;
import com.myweb.repositories.UserRepository;
import com.myweb.services.CompanyAuthenticationService;
import com.myweb.services.CompanyService;
import com.myweb.services.EmailService;
import com.myweb.utils.GeneralUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Date;
import java.util.Map;
import java.util.Objects;

@Service
public class CompanyAuthenticationServiceImplement implements CompanyAuthenticationService {

    @Autowired
    private CompanyAuthenticationRepository companyAuthenticationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CompanyService compService;

    @Override
    public CompanyAuthentication addCompanyAuthentication(CompanyAuthentication ca) {
        // Kiểm tra các trường bắt buộc
        if (ca.getPaperFile() == null || ca.getPaperFile().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng cung cấp giấy phép kinh doanh.");
        }
        if (ca.getIdCardFrontFile() == null || ca.getIdCardFrontFile().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng cung cấp mặt trước CMND/CCCD.");
        }
        if (ca.getIdCardBackFile() == null || ca.getIdCardBackFile().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng cung cấp mặt sau CMND/CCCD.");
        }

        // Upload hình ảnh
        ca.setPaper(GeneralUtils.uploadFileToCloud(cloudinary, ca.getPaperFile()));
        ca.setIdCardFront(GeneralUtils.uploadFileToCloud(cloudinary, ca.getIdCardFrontFile()));
        ca.setIdCardBack(GeneralUtils.uploadFileToCloud(cloudinary, ca.getIdCardBackFile()));
        ca.setStatus(GeneralUtils.Status.pending.toString());

        return companyAuthenticationRepository.addCompanyAuthentication(ca);
    }

    @Override
    public CompanyAuthentication updateCompanyAuthentication(CompanyAuthentication ca, Principal principal) {
        User currentUser = userRepository.getUserByUsername(principal.getName());
        // Kiểm tra xem CompanyAuthentication có thuộc về user hiện tại không
        if (currentUser.getCompany().getCompanyAuthentication() == null) {
            throw new IllegalArgumentException("Không tìm thấy thông tin xác thực công ty.");
        }
        if (!Objects.equals(currentUser.getCompany().getCompanyAuthentication().getId(), ca.getId())) {
            throw new SecurityException("Bạn không có quyền cập nhật thông tin xác thực này.");
        }

        // Cập nhật các trường nếu có file mới
        if (ca.getPaperFile() != null && !ca.getPaperFile().isEmpty()) {
            ca.setPaper(GeneralUtils.uploadFileToCloud(cloudinary, ca.getPaperFile()));
        } else {
            ca.setPaper(currentUser.getCompany().getCompanyAuthentication().getPaper());
        }
        if (ca.getIdCardFrontFile() != null && !ca.getIdCardFrontFile().isEmpty()) {
            ca.setIdCardFront(GeneralUtils.uploadFileToCloud(cloudinary, ca.getIdCardFrontFile()));
        } else {
            ca.setIdCardFront(currentUser.getCompany().getCompanyAuthentication().getIdCardFront());
        }
        if (ca.getIdCardBackFile() != null && !ca.getIdCardBackFile().isEmpty()) {
            ca.setIdCardBack(GeneralUtils.uploadFileToCloud(cloudinary, ca.getIdCardBackFile()));
        } else {
            ca.setIdCardBack(currentUser.getCompany().getCompanyAuthentication().getIdCardBack());
        }

        ca.setCompanyId(currentUser.getCompany().getCompanyAuthentication().getCompanyId());
        ca.setStatus(currentUser.getCompany().getCompanyAuthentication().getStatus());
        ca.setFeedback(currentUser.getCompany().getCompanyAuthentication().getFeedback());

        return companyAuthenticationRepository.updateCompanyAuthentication(ca);
    }

    @Override
    public void deleteCompanyAuthentication(int id, Principal principal) {
        User currentUser = userRepository.getUserByUsername(principal.getName());
        // Kiểm tra xem CompanyAuthentication có thuộc về user hiện tại không
        if (currentUser.getCompany().getCompanyAuthentication() == null) {
            throw new IllegalArgumentException("Không tìm thấy thông tin xác thực công ty.");
        }
        if (currentUser.getCompany().getCompanyAuthentication().getId() != id) {
            throw new SecurityException("Bạn không có quyền xóa thông tin xác thực này.");
        }

        companyAuthenticationRepository.deleteCompanyAuthentication(id);
    }

    @Override
    public Map<String, Object> getListCompanyAuthentication(Map<String, String> params) {
        return this.companyAuthenticationRepository.findAllWithFilters(params);
    }

    @Override
    public CompanyAuthentication getCompanyAuthentication(int id) {
        return this.companyAuthenticationRepository.findById(id);
    }

    @Override
    public CompanyAuthentication update(CompanyAuthentication ca) {
        ca.setLastUpdated(new Date());

        if (this.companyAuthenticationRepository.update(ca) == null) {
            return null;
        } else {
            String subject = "Thông báo về hồ sơ công ty!";
            String body = String.format(
                    "Chào bạn %s"
                    + "Hồ sơ chứng thực công ty bạn đã được duyệt hay vào web để xem kết quả.\n"
                    + "Trân trọng,\nHệ thống tìm kiếm việc làm bán thời gian", ca.getCompanyId().getName()
            );
            try {
                Company com = this.compService.getCompany(ca.getCompanyId().getId());
                emailService.sendEmail(com.getUserId().getUsername(), subject, body);
                System.out.println("%s " + com.getUserId().getUsername()
                );
            } catch (Exception e) {
                e.printStackTrace();
            }
            return ca;
        }

    }

    @Override
    public boolean remove(int id) {

        try {
            this.companyAuthenticationRepository.remove(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
