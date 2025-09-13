package lk.ijse.gdse72.staygobackend.service.impl;

import lk.ijse.gdse72.staygobackend.dto.BusinessDetailsDTO;
import lk.ijse.gdse72.staygobackend.entity.Business;
import lk.ijse.gdse72.staygobackend.entity.BusinessDetails;
import lk.ijse.gdse72.staygobackend.repository.BusinessDetailsRepository;
import lk.ijse.gdse72.staygobackend.repository.BusinessRepository;
import lk.ijse.gdse72.staygobackend.service.BusinessDetailsService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class BusinessDetailsServiceImpl implements BusinessDetailsService {
    private final BusinessDetailsRepository businessDetailsRepository;
    private final BusinessRepository businessRepository;
    private final ModelMapper modelMapper;

    @Override
    public void saveBusinessDetails(BusinessDetailsDTO businessDetailsDTO) {
        BusinessDetails businessDetails = modelMapper.map(businessDetailsDTO, BusinessDetails.class);

        businessDetails.setCreatedAt(new java.sql.Timestamp(System.currentTimeMillis()));
        businessDetails.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        if (businessDetailsDTO.getBusinessId() != null) {
            Business business = businessRepository.findById(businessDetailsDTO.getBusinessId())
                    .orElseThrow(() -> new RuntimeException("Business not found with ID: " + businessDetailsDTO.getBusinessId()));
            businessDetails.setBusiness(business);
        } else {
            throw new RuntimeException("Business ID is required to save business details");
        }

        businessDetailsRepository.save(businessDetails);

    }

    @Override
    public List<BusinessDetails> getAllBusinessDetails() {
        return businessDetailsRepository.findAll();
    }

    @Override
    public List<BusinessDetails> getDetailsByBusinessId(Long businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found with ID: " + businessId));

        return businessDetailsRepository.findByBusiness(business);
    }

    @Override
    public BusinessDetails getDetailsById(Long businessDetailId) {
        Optional<BusinessDetails> optional = businessDetailsRepository.findById(businessDetailId);
        return optional.orElse(null);
    }

    @Override
    public void updateBusinessDetails(BusinessDetailsDTO dto) {
        BusinessDetails existing = businessDetailsRepository.findById(dto.getBusinessDetailId())
                .orElseThrow(() -> new RuntimeException("BusinessDetails not found with ID: " + dto.getBusinessDetailId()));

        // Update fields
        existing.setRoomsCount(dto.getRoomsCount());
        existing.setBedsCount(dto.getBedsCount());
        existing.setPricePerDay(dto.getPricePerDay());
        existing.setPricePerNight(dto.getPricePerNight());
        existing.setLuxuryLevel(dto.getLuxuryLevel());
        existing.setFacilities(dto.getFacilities());
        existing.setStatus(dto.getStatus()); // ✅ Now updates status too

        // If new image path comes -> update
        if (dto.getRoomImage() != null && !dto.getRoomImage().isEmpty()) {
            existing.setRoomImage(dto.getRoomImage());
        }

        // Update business reference if provided
        if (dto.getBusinessId() != null) {
            Business business = businessRepository.findById(dto.getBusinessId())
                    .orElseThrow(() -> new RuntimeException("Business not found with ID: " + dto.getBusinessId()));
            existing.setBusiness(business);
        }

        existing.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        businessDetailsRepository.save(existing);
    }

    @Override
    public void deleteBusinessDetails(Long businessDetailId) {
        BusinessDetails details = businessDetailsRepository.findById(businessDetailId)
                .orElseThrow(() -> new RuntimeException("BusinessDetails not found with ID: " + businessDetailId));
        businessDetailsRepository.delete(details);
    }

}
