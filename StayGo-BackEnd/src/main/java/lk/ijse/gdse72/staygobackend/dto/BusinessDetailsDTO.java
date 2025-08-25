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
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BusinessDetailsDTO {
    private Long businessDetailId;

    @NotNull(message = "Rooms count cannot be null")
    @Min(value = 1, message = "Rooms count must be at least 1")
    private Integer roomsCount;

    @NotNull(message = "Beds count cannot be null")
    @Min(value = 1, message = "Beds count must be at least 1")
    private Integer bedsCount;

    @NotNull(message = "Price per day cannot be null")
    @Min(value = 0, message = "Price per day cannot be negative")
    private BigDecimal pricePerDay;

    @NotBlank(message = "Luxury level cannot be blank")
    private String luxuryLevel;

    private String facilities;

    private String roomImage;

    private Timestamp createdAt;
    private Timestamp updatedAt;

    private Long businessId; // maps to Business.businessId
}
