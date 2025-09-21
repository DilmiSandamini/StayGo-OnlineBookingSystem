package lk.ijse.gdse72.staygobackend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PaymentDTO {
    private Long paymentId;
    private Long userId;
    private String paymentStatus; // e.g., "Paid", "Unpaid", "Pending"
    private String paymentMethod; // e.g., "Cash on Delivery", "Credit/Debit Card"
    private BigDecimal totalAmount;
    private Long bookingId;

    private Timestamp createdAt;
}