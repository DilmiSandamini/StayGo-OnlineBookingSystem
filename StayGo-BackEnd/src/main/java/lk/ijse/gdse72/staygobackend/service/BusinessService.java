package lk.ijse.gdse72.staygobackend.service;

import lk.ijse.gdse72.staygobackend.dto.BusinessDTO;
import lk.ijse.gdse72.staygobackend.entity.Business;

import java.util.List;

public interface BusinessService {
    void SaveBusiness(BusinessDTO businessDTO);

    List<Business> getAllBusinessesEntity();

    List<Business> getBusinessesByUserId(Long userId);
}
