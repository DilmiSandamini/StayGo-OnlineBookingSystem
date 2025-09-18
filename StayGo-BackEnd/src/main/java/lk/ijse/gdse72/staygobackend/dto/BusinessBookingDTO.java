package lk.ijse.gdse72.staygobackend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BusinessBookingDTO {

    private Long bookingId;
    private Integer availableRoomCount; // Calculated field
//    private Integer availableGuestCount; // Calculated field

    // 🟢 Relationships
    @NotNull(message = "User ID cannot be null")
    private Long userId;   // maps to User.id

    @NotNull(message = "BusinessDetail ID cannot be null")
    private Long businessDetailId;  // maps to BusinessDetails.businessDetailId

    // 🟢 Customer details
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Address is required")
    private String address;

    // 🟢 Booking info
    @NotBlank(message = "Booking time must be DAY, NIGHT, or BOTH")
    private String bookingTime;   // "DAY" | "NIGHT" | "BOTH"

    @NotNull(message = "Check-in time cannot be null")
    private LocalDateTime checkInTime;

    @NotNull(message = "Check-out time cannot be null")
    private LocalDateTime checkOutTime;

    @NotNull(message = "Room count cannot be null")
    @Min(value = 1, message = "At least one room must be booked")
    private Integer roomCount;

    @NotNull(message = "Guest count cannot be null")
    @Min(value = 1, message = "Guest count cannot be negative")
    private Integer guestCount;

    private BigDecimal totalPrice;

    // 🟢 Audit + Status
    private String status; // PENDING, CONFIRMED, CANCELLED
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
