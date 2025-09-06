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

    // 🟢 Relationships
    @NotNull(message = "User ID cannot be null")
    private Long userId;   // maps to User.id

    @NotNull(message = "BusinessDetail ID cannot be null")
    private Long businessDetailId;  // maps to BusinessDetails.businessDetailId

    // 🟢 Booking info
    @NotBlank(message = "Booking time must be DAY or NIGHT")
    private String bookingTime;   // "DAY" | "NIGHT"

    @NotNull(message = "Check-in time cannot be null")
    private LocalDateTime checkInTime;

    @NotNull(message = "Check-out time cannot be null")
    private LocalDateTime checkOutTime;

    @NotNull(message = "Room count cannot be null")
    @Min(value = 1, message = "At least one room must be booked")
    private Integer roomCount;

    private BigDecimal totalPrice;

    // 🟢 Audit + Status
    private String status; // PENDING, CONFIRMED, CANCELLED
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
