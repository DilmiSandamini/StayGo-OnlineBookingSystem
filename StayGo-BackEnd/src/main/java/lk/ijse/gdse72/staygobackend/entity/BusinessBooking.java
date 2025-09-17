package lk.ijse.gdse72.staygobackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BusinessBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    // 🟢 Booking details
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private String bookingTime;   // "DAY", "NIGHT", or "BOTH"
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private Integer roomCount;    // Number of rooms booked
    private Integer guestCount;   // Number of guests
    private BigDecimal totalPrice;

    // 🟢 Status + audit
    private String status; // PENDING, CONFIRMED, CANCELLED
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // 🟢 Relationships
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // Who made the booking

    @ManyToOne
    @JoinColumn(name = "business_detail_id", nullable = false)
    private BusinessDetails businessDetail;  // Which room type booked
}
