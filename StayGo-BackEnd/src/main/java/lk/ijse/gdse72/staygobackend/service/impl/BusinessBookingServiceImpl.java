package lk.ijse.gdse72.staygobackend.service.impl;

import jakarta.transaction.Transactional;
import lk.ijse.gdse72.staygobackend.dto.BusinessBookingDTO;
import lk.ijse.gdse72.staygobackend.entity.BusinessBooking;
import lk.ijse.gdse72.staygobackend.entity.BusinessDetails;
import lk.ijse.gdse72.staygobackend.entity.User;
import lk.ijse.gdse72.staygobackend.repository.BusinessBookingRepository;
import lk.ijse.gdse72.staygobackend.repository.BusinessDetailsRepository;
import lk.ijse.gdse72.staygobackend.repository.UserRepository;
import lk.ijse.gdse72.staygobackend.service.BusinessBookingService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BusinessBookingServiceImpl implements BusinessBookingService {

    private final BusinessBookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final BusinessDetailsRepository detailsRepository;
    private final ModelMapper modelMapper;

    @Override
    public BusinessBookingDTO createBooking(BusinessBookingDTO dto) {
        // Validate User
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));

        // Validate BusinessDetails
        BusinessDetails details = detailsRepository.findById(dto.getBusinessDetailId())
                .orElseThrow(() -> new RuntimeException("BusinessDetails not found with ID: " + dto.getBusinessDetailId()));

        // Validate dates
        if (dto.getCheckInTime().isAfter(dto.getCheckOutTime()) || dto.getCheckInTime().isEqual(dto.getCheckOutTime())) {
            throw new RuntimeException("Check-in date must be before check-out date");
        }

        // Map DTO to entity
        BusinessBooking booking = modelMapper.map(dto, BusinessBooking.class);

        // Calculate days
        long days = ChronoUnit.DAYS.between(dto.getCheckInTime().toLocalDate(), dto.getCheckOutTime().toLocalDate());

        // Calculate total price
        BigDecimal totalPrice;
        switch (dto.getBookingTime().toUpperCase()) {
            case "DAY":
                totalPrice = details.getPricePerDay().multiply(BigDecimal.valueOf(days))
                        .multiply(BigDecimal.valueOf(dto.getRoomCount()));
                break;

            case "NIGHT":
                totalPrice = details.getPricePerNight().multiply(BigDecimal.valueOf(days))
                        .multiply(BigDecimal.valueOf(dto.getRoomCount()));
                break;

            case "BOTH":
                BigDecimal perDay = details.getPricePerDay().add(details.getPricePerNight());
                totalPrice = perDay.multiply(BigDecimal.valueOf(days))
                        .multiply(BigDecimal.valueOf(dto.getRoomCount()));
                break;

            default:
                throw new RuntimeException("Invalid bookingTime. Must be DAY, NIGHT, or BOTH");
        }

        booking.setTotalPrice(totalPrice);
        booking.setUser(user);
        booking.setBusinessDetail(details);
        booking.setCreatedAt(Timestamp.from(Instant.now()));
        booking.setUpdatedAt(Timestamp.from(Instant.now()));
        booking.setStatus("PENDING");

        BusinessBooking saved = bookingRepository.save(booking);
        return modelMapper.map(saved, BusinessBookingDTO.class);
    }

    @Override
    public List<BusinessBookingDTO> getBookingsByUser(Long userId) {
        return bookingRepository.findByUser_Id(userId)
                .stream()
                .map(b -> modelMapper.map(b, BusinessBookingDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<BusinessBookingDTO> getBookingsByBusiness(Long businessId) {
        return bookingRepository.findByBusinessDetail_Business_BusinessId(businessId)
                .stream()
                .map(b -> modelMapper.map(b, BusinessBookingDTO.class))
                .collect(Collectors.toList());
    }
}
