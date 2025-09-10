package lk.ijse.gdse72.staygobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String username;
    private String password;
    private String status; // "Active" or "Inactive"
    private String role;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
