package lk.ijse.gdse72.staygobackend.service;

import lk.ijse.gdse72.staygobackend.dto.BusinessBookingDTO;

import java.util.List;

public interface BusinessBookingService {

    BusinessBookingDTO createBooking(BusinessBookingDTO dto);

    List<BusinessBookingDTO> getBookingsByUser(Long userId);

    List<BusinessBookingDTO> getBookingsByBusiness(Long businessId);

    void confirmBooking(Long bookingId);
    void rejectBooking(Long bookingId);
}
