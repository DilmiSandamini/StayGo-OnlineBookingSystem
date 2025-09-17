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

        // Map DTO to Entity manually (avoid ModelMapper conflicts)
        BusinessBooking booking = new BusinessBooking();
        booking.setUser(user);
        booking.setBusinessDetail(details);
        booking.setFirstName(dto.getFirstName());
        booking.setLastName(dto.getLastName());
        booking.setEmail(dto.getEmail());
        booking.setPhoneNumber(dto.getPhoneNumber());
        booking.setAddress(dto.getAddress());
        booking.setBookingTime(dto.getBookingTime());
        booking.setCheckInTime(dto.getCheckInTime());
        booking.setCheckOutTime(dto.getCheckOutTime());
        booking.setRoomCount(dto.getRoomCount());
        booking.setGuestCount(dto.getGuestCount());
        booking.setCreatedAt(Timestamp.from(Instant.now()));
        booking.setUpdatedAt(Timestamp.from(Instant.now()));
        booking.setStatus("PENDING");

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

        // Save booking
        BusinessBooking saved = bookingRepository.save(booking);

        // Map Entity to DTO manually
        BusinessBookingDTO responseDTO = new BusinessBookingDTO();
        responseDTO.setBookingId(saved.getBookingId());
        responseDTO.setUserId(saved.getUser().getId());
        responseDTO.setBusinessDetailId(saved.getBusinessDetail().getBusinessDetailId());
        responseDTO.setFirstName(saved.getFirstName());
        responseDTO.setLastName(saved.getLastName());
        responseDTO.setEmail(saved.getEmail());
        responseDTO.setPhoneNumber(saved.getPhoneNumber());
        responseDTO.setAddress(saved.getAddress());
        responseDTO.setBookingTime(saved.getBookingTime());
        responseDTO.setCheckInTime(saved.getCheckInTime());
        responseDTO.setCheckOutTime(saved.getCheckOutTime());
        responseDTO.setRoomCount(saved.getRoomCount());
        responseDTO.setGuestCount(saved.getGuestCount());
        responseDTO.setTotalPrice(saved.getTotalPrice());
        responseDTO.setStatus(saved.getStatus());
        responseDTO.setCreatedAt(saved.getCreatedAt());
        responseDTO.setUpdatedAt(saved.getUpdatedAt());

        return responseDTO;
    }

    @Override
    public List<BusinessBookingDTO> getBookingsByUser(Long userId) {
        return bookingRepository.findByUser_Id(userId)
                .stream()
                .map(b -> {
                    BusinessBookingDTO dto = new BusinessBookingDTO();
                    dto.setBookingId(b.getBookingId());
                    dto.setUserId(b.getUser().getId());
                    dto.setBusinessDetailId(b.getBusinessDetail().getBusinessDetailId());
                    dto.setFirstName(b.getFirstName());
                    dto.setLastName(b.getLastName());
                    dto.setEmail(b.getEmail());
                    dto.setPhoneNumber(b.getPhoneNumber());
                    dto.setAddress(b.getAddress());
                    dto.setBookingTime(b.getBookingTime());
                    dto.setCheckInTime(b.getCheckInTime());
                    dto.setCheckOutTime(b.getCheckOutTime());
                    dto.setRoomCount(b.getRoomCount());
                    dto.setGuestCount(b.getGuestCount());
                    dto.setTotalPrice(b.getTotalPrice());
                    dto.setStatus(b.getStatus());
                    dto.setCreatedAt(b.getCreatedAt());
                    dto.setUpdatedAt(b.getUpdatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<BusinessBookingDTO> getBookingsByBusiness(Long businessId) {
        return bookingRepository.findByBusinessDetail_Business_BusinessId(businessId)
                .stream()
                .map(b -> {
                    BusinessBookingDTO dto = new BusinessBookingDTO();
                    dto.setBookingId(b.getBookingId());
                    dto.setUserId(b.getUser().getId());
                    dto.setBusinessDetailId(b.getBusinessDetail().getBusinessDetailId());
                    dto.setFirstName(b.getFirstName());
                    dto.setLastName(b.getLastName());
                    dto.setEmail(b.getEmail());
                    dto.setPhoneNumber(b.getPhoneNumber());
                    dto.setAddress(b.getAddress());
                    dto.setBookingTime(b.getBookingTime());
                    dto.setCheckInTime(b.getCheckInTime());
                    dto.setCheckOutTime(b.getCheckOutTime());
                    dto.setRoomCount(b.getRoomCount());
                    dto.setGuestCount(b.getGuestCount());
                    dto.setTotalPrice(b.getTotalPrice());
                    dto.setStatus(b.getStatus());
                    dto.setCreatedAt(b.getCreatedAt());
                    dto.setUpdatedAt(b.getUpdatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
