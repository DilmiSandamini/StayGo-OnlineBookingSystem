package lk.ijse.gdse72.staygobackend.controller;

import lk.ijse.gdse72.staygobackend.dto.BusinessBookingDTO;
import lk.ijse.gdse72.staygobackend.service.BusinessBookingService;
import lk.ijse.gdse72.staygobackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class BusinessBookingController {

    private final BusinessBookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<APIResponse<BusinessBookingDTO>> createBooking(@RequestBody BusinessBookingDTO bookingDTO) {
        try {
            // Validate incoming DTO
            if (bookingDTO.getUserId() == null || bookingDTO.getBusinessDetailId() == null || bookingDTO.getRoomCount() <= 0
                    || bookingDTO.getCheckInTime() == null || bookingDTO.getCheckOutTime() == null
                    || bookingDTO.getBookingTime() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new APIResponse<>(400, "Invalid booking data", null));
            }

            BusinessBookingDTO saved = bookingService.createBooking(bookingDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new APIResponse<>(201, "Booking created successfully", saved));

        } catch (RuntimeException e) {
            log.error("Booking creation failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new APIResponse<>(400, e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error creating booking", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse<>(500, "Error creating booking", null));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<APIResponse<List<BusinessBookingDTO>>> getBookingsByUser(@PathVariable Long userId) {
        List<BusinessBookingDTO> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(new APIResponse<>(200, "User bookings fetched", bookings));
    }

    @GetMapping("/business/{businessId}")
    public ResponseEntity<APIResponse<List<BusinessBookingDTO>>> getBookingsByBusiness(@PathVariable Long businessId) {
        List<BusinessBookingDTO> bookings = bookingService.getBookingsByBusiness(businessId);
        return ResponseEntity.ok(new APIResponse<>(200, "Business bookings fetched", bookings));
    }

    @PutMapping("/confirm/{id}")
    public ResponseEntity<APIResponse<Void>> confirmBooking(@PathVariable Long id) {
        try {
            bookingService.confirmBooking(id);
            return ResponseEntity.ok(new APIResponse<>(200, "Booking confirmed successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new APIResponse<>(400, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new APIResponse<>(500, "Error confirming booking", null));
        }
    }

    @PutMapping("/reject/{bookingId}")
    public ResponseEntity<APIResponse<Void>> rejectBooking(@PathVariable Long bookingId) {
        bookingService.rejectBooking(bookingId);
        return ResponseEntity.ok(new APIResponse<>(200, "Booking rejected successfully", null));
    }


}
