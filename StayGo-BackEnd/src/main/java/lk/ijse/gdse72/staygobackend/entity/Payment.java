package lk.ijse.gdse72.staygobackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    private Long userId;
    private String paymentStatus;
    private String paymentMethod;
    private BigDecimal totalAmount;

    private Timestamp createdAt;

    @OneToOne
    @JoinColumn(name = "booking_id", referencedColumnName = "bookingId", nullable = false, unique = true)
    private BusinessBooking businessBooking;

}
