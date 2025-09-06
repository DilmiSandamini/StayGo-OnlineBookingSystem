package lk.ijse.gdse72.staygobackend.repository;

import lk.ijse.gdse72.staygobackend.entity.BusinessBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessBookingRepository extends JpaRepository<BusinessBooking, Long> {
    List<BusinessBooking> findByUser_Id(Long userId);
    List<BusinessBooking> findByBusinessDetail_Business_BusinessId(Long businessId);
}
