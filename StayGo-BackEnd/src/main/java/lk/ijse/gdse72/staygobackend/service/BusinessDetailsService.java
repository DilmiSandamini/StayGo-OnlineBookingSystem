package lk.ijse.gdse72.staygobackend.service;

import lk.ijse.gdse72.staygobackend.dto.BusinessDetailsDTO;
import lk.ijse.gdse72.staygobackend.entity.BusinessDetails;

import java.util.List;

public interface BusinessDetailsService {
    void saveBusinessDetails(BusinessDetailsDTO businessDTO);

    List<BusinessDetails> getAllBusinessDetails();

    List<BusinessDetails> getDetailsByBusinessId(Long businessId);
}
