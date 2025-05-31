package com.myweb.repositories;

import com.myweb.pojo.Company;
import com.myweb.pojo.CompanyAuthentication;

import java.security.Principal;
import java.util.Map;

public interface CompanyAuthenticationRepository {

    CompanyAuthentication addCompanyAuthentication(CompanyAuthentication ca);

    CompanyAuthentication updateCompanyAuthentication(CompanyAuthentication ca);

    void deleteCompanyAuthentication(int id);

    Map<String, Object> findAllWithFilters(Map<String, String> params);

    CompanyAuthentication findById(int id);

    CompanyAuthentication update(CompanyAuthentication ca);

    void remove(int id);
}
