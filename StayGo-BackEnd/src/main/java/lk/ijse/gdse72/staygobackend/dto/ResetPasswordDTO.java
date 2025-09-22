package lk.ijse.gdse72.staygobackend.dto;

import lombok.Data;

@Data
public class ResetPasswordDTO {
    private String token;      // reset token from email
    private String newUsername;
    private String newPassword;
}
