package com.myweb.services;

import com.myweb.dto.GetReportDTO;
import java.util.Date;
import java.util.List;

public interface ReportService {
    List<GetReportDTO> generateReport(Date fromDate, Date toDate);
}