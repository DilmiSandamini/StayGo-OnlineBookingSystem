package lk.ijse.gdse72.staygobackend.dto;

import lombok.Data;

/**
 * @author Dusan
 * @date 8/6/2025
 */

@Data

public class RegisterDTO {
    private String fullName;
    private String email;
    private String username;
    private String password;
    private String role;
}
