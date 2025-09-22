package lk.ijse.gdse72.staygobackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String username;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;    //   ADMIN, CLIENT, BUSINESS

    private String status;  // Active, Inactive

    @CreationTimestamp
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updatedAt;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Business> businesses;

    private String resetOtp;
    private Timestamp otpExpiration;
}