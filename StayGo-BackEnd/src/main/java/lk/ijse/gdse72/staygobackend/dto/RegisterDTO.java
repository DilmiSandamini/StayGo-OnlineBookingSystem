package lk.ijse.gdse72.staygobackend.dto;

import lombok.Data;


@Data

public class RegisterDTO {
    private String fullName;
    private String email;
    private String username;
    private String password;
    private String role;
    private String status;  // Active, Inactive
}
