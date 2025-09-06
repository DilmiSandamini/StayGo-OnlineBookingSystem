package lk.ijse.gdse72.staygobackend.dto;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;


@Data

public class RegisterDTO {
    private String fullName;
    private String email;
    private String username;
    private String password;
    private String role;
    private String status;  // Active, Inactive

    @CreationTimestamp
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updatedAt;
}
