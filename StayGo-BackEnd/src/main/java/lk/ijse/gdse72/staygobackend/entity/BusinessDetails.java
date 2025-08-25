package lk.ijse.gdse72.staygobackend.entity;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BusinessDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long BusinessDetailId;

    private Integer roomsCount;
    private Integer bedsCount;
    private BigDecimal pricePerDay;
    private String luxuryLevel;
    private String facilities;
    private String roomImage;

    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Many BusinessDetails → One Business
    @ManyToOne
    @JoinColumn(name = "business_id", referencedColumnName = "businessId", nullable = false)
    private Business business;
}
