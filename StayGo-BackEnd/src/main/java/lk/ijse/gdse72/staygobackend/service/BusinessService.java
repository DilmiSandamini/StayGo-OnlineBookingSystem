package lk.ijse.gdse72.staygobackend.service;

import lk.ijse.gdse72.staygobackend.dto.BusinessDTO;
import lk.ijse.gdse72.staygobackend.entity.Business;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BusinessService {
    void SaveBusiness(BusinessDTO businessDTO);
    List<BusinessDTO> getBusinessesByCategory(String category);
    List<Business> getBusinessesByUserId(Long userId);
    List<BusinessDTO> getAllBusinesses();
    Business getBusinessById(Long businessId);
    void updateBusiness(Business business);

    Page<BusinessDTO> getAllBusinessesPaginated(int page, int size);
    Page<BusinessDTO> getAllActiveBusinessesPaginated(int page, int size);
    Page<BusinessDTO> getAllInactiveBusinessesPaginated(int page, int size);
}
