//tệp tin DispatcherServlet chịu trách nhiệm sẽ xử lý tất cả các request từ client và điều hướng tới Controller phù hợp

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.configs;

import com.myweb.filters.JwtFilters;
import jakarta.servlet.Filter;
import jakarta.servlet.MultipartConfigElement;
import jakarta.servlet.ServletRegistration;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

/**
 *
 * @author Admin
 */
public class DispatcherServletInit extends AbstractAnnotationConfigDispatcherServletInitializer {

    // Xác định các lớp cấu hình cho ứng dụng
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{
            ThymeleafConfig.class,
            HibernateConfigs.class,
            SpringSecurityConfigs.class,
            EnvConfig.class,
            CacheConfig.class};

    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{
            WebApplicationContextConfig.class
        };
    }

    // Xử lý các yêu cầu tới các URL ("/")
    @Override
    protected String[] getServletMappings() {
        return new String[]{
            "/"
        };
    }

    // Xử lý các tệp tin tải lên
    @Override
    protected void customizeRegistration(ServletRegistration.Dynamic registration) {
        String location = "/";
        long maxFileSize = 5242880; // 5MB
        long maxRequestSize = 20971520; // 20MB
        int fileSizeThreshold = 0;

        registration.setMultipartConfig(new MultipartConfigElement(location, maxFileSize, maxRequestSize, fileSizeThreshold));
    }

    @Override
    protected Filter[] getServletFilters() {
        return new Filter[]{new JwtFilters()}; // Filter sẽ áp dụng cho mọi request
    }
}
