package lk.ijse.gdse72.staygobackend.service;

import lk.ijse.gdse72.staygobackend.dto.BusinessDetailsDTO;
import lk.ijse.gdse72.staygobackend.entity.BusinessDetails;

import java.util.List;

public interface BusinessDetailsService {
    void saveBusinessDetails(BusinessDetailsDTO businessDTO);

    List<BusinessDetails> getAllBusinessDetails();

    List<BusinessDetails> getDetailsByBusinessId(Long businessId);

    BusinessDetails getDetailsById(Long businessDetailId);

    void updateBusinessDetails(BusinessDetailsDTO dto);

    void deleteBusinessDetails(Long businessDetailId);

    // add this method declaration to the interface
    Integer getAvailableRooms(Long businessDetailId, java.time.LocalDateTime checkIn, java.time.LocalDateTime checkOut);

}
