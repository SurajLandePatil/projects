package com.vehiclebreakdown.serviceImpl;

import com.vehiclebreakdown.model.Report;
import com.vehiclebreakdown.repository.ReportRepository;
import com.vehiclebreakdown.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Override
    public Report createReport(Long userId, Long mechanicId, Long bookingId, String reason, String description) {
        Report report = new Report();
        report.setUserId(userId);
        report.setMechanicId(mechanicId);
        report.setBookingId(bookingId);
        report.setReason(reason);
        report.setDescription(description);
        report.setStatus(Report.ReportStatus.PENDING);
        report.setCreatedAt(LocalDateTime.now());
        
        return reportRepository.save(report);
    }

    @Override
    public Optional<Report> getReportById(Long id) {
        return reportRepository.findById(id);
    }

    @Override
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Override
    public List<Report> getReportsByStatus(Report.ReportStatus status) {
        return reportRepository.findByStatus(status);
    }

    @Override
    public List<Report> getReportsByMechanicId(Long mechanicId) {
        return reportRepository.findByMechanicId(mechanicId);
    }

    @Override
    public void resolveReport(Long reportId) {
        Optional<Report> report = reportRepository.findById(reportId);
        if (report.isPresent()) {
            report.get().setStatus(Report.ReportStatus.RESOLVED);
            report.get().setResolvedAt(LocalDateTime.now());
            reportRepository.save(report.get());
        }
    }

    @Override
    public void dismissReport(Long reportId) {
        Optional<Report> report = reportRepository.findById(reportId);
        if (report.isPresent()) {
            report.get().setStatus(Report.ReportStatus.DISMISSED);
            report.get().setResolvedAt(LocalDateTime.now());
            reportRepository.save(report.get());
        }
    }
}
