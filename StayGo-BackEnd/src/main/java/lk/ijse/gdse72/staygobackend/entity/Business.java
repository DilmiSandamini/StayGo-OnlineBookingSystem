package lk.ijse.gdse72.staygobackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long businessId;

    private String businessName;
    private String contactNumber1;
    private String contactNumber2;
    private String businessEmail;
    private String businessAddress;
    private String businessCategory;
    private String businessLogo;
    @Lob
    private String businessDescription;
    private String businessStatus;

    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    private User user;

    private Timestamp createdAt;
    private Timestamp updatedAt;

    // One Business → Many BusinessDetails
    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BusinessDetails> businessDetailsList = new ArrayList<>();
}
