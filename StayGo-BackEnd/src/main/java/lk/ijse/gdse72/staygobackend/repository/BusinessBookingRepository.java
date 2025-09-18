package lk.ijse.gdse72.staygobackend.repository;

import lk.ijse.gdse72.staygobackend.entity.BusinessBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface BusinessBookingRepository extends JpaRepository<BusinessBooking, Long> {
    List<BusinessBooking> findByUser_Id(Long userId);
    List<BusinessBooking> findByBusinessDetail_Business_BusinessId(Long businessId);

    @Query("SELECT COALESCE(SUM(b.roomCount), 0) " +
            "FROM BusinessBooking b " +
            "WHERE b.businessDetail.BusinessDetailId = :detailId " +
            "AND b.status <> 'CANCELLED' " +
            "AND b.checkInTime < :checkOut " +
            "AND b.checkOutTime > :checkIn")
    Integer sumBookedRoomsInRange(@Param("detailId") Long detailId,
                                  @Param("checkIn") LocalDateTime checkIn,
                                  @Param("checkOut") LocalDateTime checkOut);



}
