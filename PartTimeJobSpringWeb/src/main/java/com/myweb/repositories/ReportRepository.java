package com.myweb.repositories;

import java.util.Date;
import java.util.List;

public interface ReportRepository {
    List<Object[]> generateJobReport(Date fromDate, Date toDate);
    List<Object[]> generateCandidateReport(Date fromDate, Date toDate);
    List<Object[]> generateCompanyReport(Date fromDate, Date toDate);
}