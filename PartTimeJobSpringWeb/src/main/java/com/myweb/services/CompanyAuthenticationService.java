package com.myweb.services;

import com.myweb.pojo.CompanyAuthentication;
import java.security.Principal;
import java.util.Map;

public interface CompanyAuthenticationService {

    CompanyAuthentication addCompanyAuthentication(CompanyAuthentication ca);

    CompanyAuthentication updateCompanyAuthentication(CompanyAuthentication ca, Principal principal);

    void deleteCompanyAuthentication(int id, Principal principal);

    Map<String, Object> getListCompanyAuthentication(Map<String, String> params);

    CompanyAuthentication getCompanyAuthentication(int id);

    CompanyAuthentication update(CompanyAuthentication ca);
    
    boolean remove(int id);
}
