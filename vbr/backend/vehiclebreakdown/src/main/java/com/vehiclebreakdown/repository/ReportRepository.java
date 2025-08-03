package com.vehiclebreakdown.repository;

import com.vehiclebreakdown.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByMechanicId(Long mechanicId);
    List<Report> findByUserId(Long userId);
    List<Report> findByStatus(Report.ReportStatus status);
}
