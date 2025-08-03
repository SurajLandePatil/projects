package com.vehiclebreakdown.service;

import com.vehiclebreakdown.model.Report;
import java.util.List;
import java.util.Optional;

public interface ReportService {
    Report createReport(Long userId, Long mechanicId, Long bookingId, String reason, String description);
    Optional<Report> getReportById(Long id);
    List<Report> getAllReports();
    List<Report> getReportsByStatus(Report.ReportStatus status);
    List<Report> getReportsByMechanicId(Long mechanicId);
    void resolveReport(Long reportId);
    void dismissReport(Long reportId);
}
