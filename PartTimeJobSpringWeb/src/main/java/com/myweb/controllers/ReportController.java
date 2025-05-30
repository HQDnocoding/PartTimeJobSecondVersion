package com.myweb.controllers;

import com.myweb.dto.GetReportDTO;
import com.myweb.services.ReportService;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/report")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private SimpleDateFormat simpleDateFormat;

    @GetMapping
    public String report(Model model,
                        @RequestParam(name = "fromDate", defaultValue = "") String fromDate,
                        @RequestParam(name = "toDate", defaultValue = "") String toDate) throws ParseException {
        Date fr = null, to = null;
        if (!fromDate.isEmpty()) {
            fr = simpleDateFormat.parse(fromDate);
        }
        if (!toDate.isEmpty()) {
            to = simpleDateFormat.parse(toDate);
        }

        List<GetReportDTO> reports = reportService.generateReport(fr, to);
        model.addAttribute("reportData", reports);
        model.addAttribute("fromDate", fromDate);
        model.addAttribute("toDate", toDate);

        return "report";
    }

    @GetMapping("/data")
    @ResponseBody
    public List<GetReportDTO> getReportData(
            @RequestParam(name = "fromDate", required = false) String fromDate,
            @RequestParam(name = "toDate", required = false) String toDate) throws ParseException {
        Date fr = null, to = null;
        if (fromDate != null && !fromDate.isEmpty()) {
            fr = simpleDateFormat.parse(fromDate);
        }
        if (toDate != null && !toDate.isEmpty()) {
            to = simpleDateFormat.parse(toDate);
        }
        return reportService.generateReport(fr, to);
    }

    @GetMapping("/export-excel")
    public void exportToExcel(
            @RequestParam(name = "fromDate", required = false) String fromDate,
            @RequestParam(name = "toDate", required = false) String toDate,
            HttpServletResponse response) throws ParseException, IOException {
        // Kiểm tra định dạng ngày
        Date fr = null, to = null;
        if (fromDate != null && !fromDate.isEmpty()) {
            fr = simpleDateFormat.parse(fromDate);
        }
        if (toDate != null && !toDate.isEmpty()) {
            to = simpleDateFormat.parse(toDate);
        }

        // Lấy dữ liệu báo cáo
        List<GetReportDTO> reports = reportService.generateReport(fr, to);

        // Kiểm tra nếu không có dữ liệu
        if (reports.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Không có dữ liệu để xuất Excel.");
            return;
        }

        // Tạo workbook Excel
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Báo Cáo Thống Kê");

        // Tạo hàng tiêu đề
        Row headerRow = sheet.createRow(0);
        String[] columns = {"Ngày", "Số việc làm", "Số ứng viên", "Số nhà tuyển dụng"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
        }

        // Điền dữ liệu
        int rowNum = 1;
        for (GetReportDTO report : reports) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(simpleDateFormat.format(report.getDate()));
            row.createCell(1).setCellValue(report.getJobCount());
            row.createCell(2).setCellValue(report.getCandidateCount());
            row.createCell(3).setCellValue(report.getCompanyCount());
        }

        // Tự động điều chỉnh kích thước cột
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Thiết lập response để tải file Excel
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=thong_ke_bao_cao.xlsx");

        // Ghi workbook vào response
        try {
            workbook.write(response.getOutputStream());
        } finally {
            workbook.close();
        }
    }
}